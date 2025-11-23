/**
 * JourneyContext 課程上下文
 *
 * 管理課程資料、進度追蹤
 * R2: 整合真實 API
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Journey, Chapter, Lesson } from '@/types/journey'
import { LessonProgress } from '@/types/lesson'
import { GymChallengeRecord } from '@/types/gym'
import { useAuth } from './AuthContext'
import { getJourneys, getJourney, getJourneyProgress } from '@/lib/api/journeys'
import { getMyPurchases, checkAccess as checkCourseAccess } from '@/lib/api/purchases'

interface JourneyContextType {
  // 資料
  journeys: Journey[]
  currentJourney: Journey | null
  selectedJourney: Journey | null
  ownedJourneys: Journey[]
  progressMap: Record<number, LessonProgress>

  // 載入狀態
  isLoading: boolean

  // 方法
  loadJourney: (journeyId: number) => Promise<void>
  loadJourneys: () => Promise<void>
  setSelectedJourney: (journey: Journey | null) => void
  updateProgress: (lessonId: number, progress: Partial<LessonProgress>) => Promise<void>
  submitLesson: (lessonId: number) => Promise<any>
  unlockChapter: (chapterId: number, password: string) => Promise<boolean>
  checkAccess: (journeyId: number) => boolean
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [allJourneys, setAllJourneys] = useState<Journey[]>([])
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null)
  const [selectedJourney, setSelectedJourney] = useState<Journey | null>(null)
  const [ownedJourneys, setOwnedJourneys] = useState<Journey[]>([])
  const [progressMap, setProgressMap] = useState<Record<number, LessonProgress>>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 載入所有課程
   */
  const loadJourneys = useCallback(async () => {
    setIsLoading(true)
    try {
      // Fetch all courses from backend
      const response = await getJourneys()

      if (!response.success || !response.data) {
        console.error('Failed to load journeys:', response.error)
        setAllJourneys([])
        setOwnedJourneys([])
        return
      }

      const allCourses = response.data.journeys
      setAllJourneys(allCourses)

      // Determine owned courses based on user login and purchases
      if (user) {
        // Fetch user's purchases
        const purchasesResponse = await getMyPurchases()

        if (purchasesResponse.success && purchasesResponse.data) {
          const purchasedCourseIds = new Set(
            purchasesResponse.data.map((p) => p.courseId)
          )

          // Owned = free courses + purchased premium courses
          const owned = allCourses.filter(
            (journey) => !journey.isPremium || purchasedCourseIds.has(journey.id)
          )
          setOwnedJourneys(owned)
        } else {
          // If can't fetch purchases, assume only free courses
          const freeCourses = allCourses.filter((journey) => !journey.isPremium)
          setOwnedJourneys(freeCourses)
        }
      } else {
        // Not logged in: only show free courses as accessible
        const freeCourses = allCourses.filter((journey) => !journey.isPremium)
        setOwnedJourneys(freeCourses)
      }
    } catch (error) {
      console.error('Failed to load journeys:', error)
      setAllJourneys([])
      setOwnedJourneys([])
    } finally {
      setIsLoading(false)
    }
  }, [user])

  /**
   * 載入特定課程及其進度
   */
  const loadJourney = useCallback(async (journeyId: number) => {
    setIsLoading(true)
    try {
      // Fetch journey details from backend
      const journeyResponse = await getJourney(journeyId)

      if (!journeyResponse.success || !journeyResponse.data) {
        console.error('Failed to load journey:', journeyResponse.error)
        throw new Error('Journey not found')
      }

      const journey = journeyResponse.data.journey
      setCurrentJourney(journey)

      // Load user progress if logged in
      if (user) {
        const progressResponse = await getJourneyProgress(journeyId, String(user.id))

        if (progressResponse.success && progressResponse.data) {
          // Transform string keys to numbers and map to LessonProgress
          const transformedProgress: Record<number, LessonProgress> = {}
          Object.entries(progressResponse.data.progress).forEach(([key, value]) => {
            transformedProgress[parseInt(key)] = {
              userId: user.id,
              lessonId: parseInt(key),
              currentTime: 0,
              duration: 0,
              percentage: value.progress,
              completed: value.completed,
              delivered: false,
              lastUpdated: Date.now(),
            }
          })
          setProgressMap(transformedProgress)
        } else {
          // No progress data, start fresh
          setProgressMap({})
        }
      } else {
        setProgressMap({})
      }
    } catch (error) {
      console.error('Failed to load journey:', error)
      setCurrentJourney(null)
      setProgressMap({})
    } finally {
      setIsLoading(false)
    }
  }, [user])

  /**
   * 更新課程進度
   * R2: 整合真實後端 API
   */
  const updateProgress = async (
    lessonId: number,
    progressUpdate: Partial<LessonProgress>
  ) => {
    if (!user) return

    try {
      // Update local state immediately for better UX (optimistic update)
      const previousState = progressMap[lessonId]

      setProgressMap((prev) => ({
        ...prev,
        [lessonId]: {
          ...(prev[lessonId] || { completed: false, percentage: 0 }),
          ...progressUpdate,
        },
      }))

      // Sync to backend
      if (progressUpdate.currentTime !== undefined && progressUpdate.duration !== undefined) {
        const { updateLessonProgress } = await import('@/lib/api/progress')
        const response = await updateLessonProgress(
          lessonId,
          progressUpdate.currentTime,
          progressUpdate.duration
        )

        // Update with backend response data
        if (response.success && response.data) {
          setProgressMap((prev) => ({
            ...prev,
            [lessonId]: {
              ...prev[lessonId],
              completed: response.data!.isCompleted,
              percentage: response.data!.progressPercentage,
            },
          }))
        } else {
          // Rollback on failure
          setProgressMap((prev) => ({
            ...prev,
            [lessonId]: previousState || { completed: false, percentage: 0 },
          }))
        }
      }
    } catch (error) {
      console.error('Failed to update progress:', error)
      // Don't throw - silently fail to not disrupt viewing experience
    }
  }

  /**
   * 繳交單元
   * R2: 整合真實後端 API
   */
  const submitLesson = async (lessonId: number) => {
    if (!user) return

    try {
      // Call backend submit API
      const { submitLessonCompletion } = await import('@/lib/api/progress')
      const response = await submitLessonCompletion(lessonId)

      if (!response.success || !response.data) {
        throw new Error(response.error?.message || '單元提交失敗')
      }

      // Mark as submitted locally
      const result: LessonProgress = {
        ...(progressMap[lessonId] || { completed: false, percentage: 0 }),
        completed: true,
        percentage: 100,
        delivered: true,
        lastUpdated: Date.now(),
      }

      setProgressMap((prev) => ({
        ...prev,
        [lessonId]: result,
      }))

      // Update user data with new experience and level from backend
      // Note: User update is handled by the page component that receives the response
      // if (response.data.user) {
      //   // Update user in AuthContext
      // }

      return {
        ...result,
        experienceGained: response.data.experienceGained,
        user: response.data.user,
      }
    } catch (error) {
      console.error('Failed to submit lesson:', error)
      throw error
    }
  }

  /**
   * 解鎖章節
   * Note: Chapter system not yet implemented in backend
   * This is a placeholder for future implementation
   */
  const unlockChapter = async (chapterId: number, password: string): Promise<boolean> => {
    if (!currentJourney) return false

    try {
      const chapter = currentJourney.chapters.find((c) => c.id === chapterId)
      if (!chapter) return false

      // Check password locally (backend doesn't have chapter system yet)
      const isCorrect = (chapter as any).password === password

      if (isCorrect) {
        // Update chapter state locally
        setCurrentJourney((prev) => {
          if (!prev) return null
          return {
            ...prev,
            chapters: prev.chapters.map((c) =>
              c.id === chapterId ? { ...c, locked: false } : c
            ),
          }
        })
      }

      // TODO: Call backend unlock API when chapter system is implemented
      // const response = await apiClient.post(`/chapters/${chapterId}/unlock`, {
      //   password,
      // })
      // return response.success

      return isCorrect
    } catch (error) {
      console.error('Failed to unlock chapter:', error)
      return false
    }
  }

  /**
   * 檢查課程存取權限
   * Based on: free courses + purchased courses
   */
  const checkAccess = (journeyId: number): boolean => {
    // Check if course is in ownedJourneys list
    return ownedJourneys.some((journey) => journey.id === journeyId)
  }

  // 初始化：載入所有課程
  useEffect(() => {
    loadJourneys()
  }, [])

  // 當用戶登入狀態改變時，重新載入課程（以獲取最新的購買狀態）
  useEffect(() => {
    if (user) {
      // Reload journeys to update owned courses based on purchases
      loadJourneys()
    } else {
      // User logged out, show only free courses
      const freeCourses = allJourneys.filter((journey) => !journey.isPremium)
      setOwnedJourneys(freeCourses)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const value: JourneyContextType = {
    journeys: allJourneys,
    currentJourney,
    selectedJourney,
    ownedJourneys,
    progressMap,
    isLoading,
    loadJourney,
    loadJourneys,
    setSelectedJourney,
    updateProgress,
    submitLesson,
    unlockChapter,
    checkAccess,
  }

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
}

/**
 * useJourney Hook
 * 用於在元件中存取課程資料
 */
export function useJourney() {
  const context = useContext(JourneyContext)
  if (context === undefined) {
    throw new Error('useJourney must be used within JourneyProvider')
  }
  return context
}
