/**
 * JourneyContext 課程上下文
 *
 * 管理課程資料、進度追蹤
 * R1: 使用 Mock 資料
 * R2: 整合真實 API
 */

'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Journey, Chapter, Lesson } from '@/types/journey'
import { LessonProgress, GymChallengeRecord } from '@/types/lesson'
import {
  journeys,
  getJourneyById,
  getLessonById,
  hasJourneyAccess,
} from '@/lib/mock/journeys'
import {
  userLessonProgress,
  getLessonProgress,
  updateLessonProgress,
  deliverLesson,
} from '@/lib/mock/progress'
import { useAuth } from './AuthContext'

interface JourneyContextType {
  // 資料
  journeys: Journey[]
  currentJourney: Journey | null
  ownedJourneys: Journey[]
  progressMap: Record<number, LessonProgress>

  // 載入狀態
  isLoading: boolean

  // 方法
  loadJourney: (journeyId: number) => Promise<void>
  loadJourneys: () => Promise<void>
  updateProgress: (lessonId: number, progress: Partial<LessonProgress>) => Promise<void>
  submitLesson: (lessonId: number) => Promise<void>
  unlockChapter: (chapterId: number, password: string) => Promise<boolean>
  checkAccess: (journeyId: number) => boolean
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [allJourneys, setAllJourneys] = useState<Journey[]>([])
  const [currentJourney, setCurrentJourney] = useState<Journey | null>(null)
  const [ownedJourneys, setOwnedJourneys] = useState<Journey[]>([])
  const [progressMap, setProgressMap] = useState<Record<number, LessonProgress>>({})
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 載入所有課程
   */
  const loadJourneys = useCallback(async () => {
    setIsLoading(true)
    try {
      // R1: 使用 Mock 資料
      await new Promise(resolve => setTimeout(resolve, 300))
      setAllJourneys(journeys)

      // 設置擁有的課程（R1: Mock - 假設用戶擁有所有課程的訪問權限）
      if (user) {
        const owned = journeys.filter(journey => hasJourneyAccess(user.id, journey.id))
        setOwnedJourneys(owned)
      } else {
        setOwnedJourneys([])
      }

      // R2 TODO: 從 API 載入
      // const response = await fetch('/api/journeys')
      // const data = await response.json()
      // setAllJourneys(data.journeys)
      // setOwnedJourneys(data.ownedJourneys)
    } catch (error) {
      console.error('Failed to load journeys:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  /**
   * 載入特定課程及其進度
   */
  const loadJourney = async (journeyId: number) => {
    setIsLoading(true)
    try {
      // R1: 使用 Mock 資料
      await new Promise(resolve => setTimeout(resolve, 300))

      const journey = getJourneyById(journeyId)
      if (!journey) {
        throw new Error('Journey not found')
      }

      setCurrentJourney(journey)

      // 載入用戶進度
      if (user) {
        const userProgress = userLessonProgress[user.id] || {}
        setProgressMap(userProgress)
      }

      // R2 TODO: 從 API 載入
      // const [journeyRes, progressRes] = await Promise.all([
      //   fetch(`/api/journeys/${journeyId}`),
      //   fetch(`/api/journeys/${journeyId}/progress`),
      // ])
      // const journey = await journeyRes.json()
      // const progress = await progressRes.json()
      // setCurrentJourney(journey)
      // setProgressMap(progress)
    } catch (error) {
      console.error('Failed to load journey:', error)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * 更新課程進度
   */
  const updateProgress = async (
    lessonId: number,
    progressUpdate: Partial<LessonProgress>
  ) => {
    if (!user) return

    try {
      // R1: 更新 Mock 資料
      const updated = updateLessonProgress(user.id, lessonId, progressUpdate)

      setProgressMap(prev => ({
        ...prev,
        [lessonId]: updated,
      }))

      // R2 TODO: 同步到後端
      // await fetch(`/api/lessons/${lessonId}/progress`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(progressUpdate),
      // })
    } catch (error) {
      console.error('Failed to update progress:', error)
      throw error
    }
  }

  /**
   * 繳交單元
   */
  const submitLesson = async (lessonId: number) => {
    if (!user) return

    try {
      // R1: Mock 繳交邏輯
      await new Promise(resolve => setTimeout(resolve, 500))

      const result = deliverLesson(user.id, lessonId)

      setProgressMap(prev => ({
        ...prev,
        [lessonId]: result,
      }))

      // R2 TODO: 呼叫繳交 API
      // const response = await fetch(`/api/lessons/${lessonId}/submit`, {
      //   method: 'POST',
      // })
      // const data = await response.json()
      // setProgressMap(prev => ({
      //   ...prev,
      //   [lessonId]: data.progress,
      // }))

      return result
    } catch (error) {
      console.error('Failed to submit lesson:', error)
      throw error
    }
  }

  /**
   * 解鎖章節
   */
  const unlockChapter = async (chapterId: number, password: string): Promise<boolean> => {
    if (!currentJourney) return false

    try {
      // R1: Mock 解鎖邏輯
      await new Promise(resolve => setTimeout(resolve, 300))

      const chapter = currentJourney.chapters.find(c => c.id === chapterId)
      if (!chapter) return false

      // 檢查密碼
      const isCorrect = chapter.password === password

      if (isCorrect) {
        // 更新章節狀態
        setCurrentJourney(prev => {
          if (!prev) return null
          return {
            ...prev,
            chapters: prev.chapters.map(c =>
              c.id === chapterId ? { ...c, locked: false } : c
            ),
          }
        })
      }

      // R2 TODO: 呼叫解鎖 API
      // const response = await fetch(`/api/chapters/${chapterId}/unlock`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password }),
      // })
      // const data = await response.json()
      // return data.success

      return isCorrect
    } catch (error) {
      console.error('Failed to unlock chapter:', error)
      return false
    }
  }

  /**
   * 檢查課程存取權限
   */
  const checkAccess = (journeyId: number): boolean => {
    if (!user) return false
    return hasJourneyAccess(user.id, journeyId)
  }

  // 初始化：載入所有課程
  useEffect(() => {
    loadJourneys()
  }, [])

  // 當用戶登入狀態改變時，重新載入擁有的課程
  useEffect(() => {
    if (allJourneys.length > 0) {
      if (user) {
        const owned = allJourneys.filter(journey => hasJourneyAccess(user.id, journey.id))
        setOwnedJourneys(owned)
      } else {
        setOwnedJourneys([])
      }
    }
  }, [user, allJourneys])

  const value: JourneyContextType = {
    journeys: allJourneys,
    currentJourney,
    ownedJourneys,
    progressMap,
    isLoading,
    loadJourney,
    loadJourneys,
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
