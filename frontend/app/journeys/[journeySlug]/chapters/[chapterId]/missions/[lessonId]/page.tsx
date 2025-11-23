/**
 * 課程單元頁面（影片播放）
 *
 * 顯示影片播放器、單元資訊、完成按鈕
 */

'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout, Container, Section, Breadcrumb } from '@/components/layout'
import { VideoPlayer, LessonCard } from '@/components/course'
import { Button, Card, Badge, Spinner, EmptyState } from '@/components/ui'
import { useJourney, useAuth, useToast } from '@/contexts'
import { getLesson } from '@/lib/api/lessons'
import { Lesson } from '@/types/journey'
import { BookOpen, CheckCircle, Award, ChevronLeft, ChevronRight, Lock } from 'lucide-react'

// Extract YouTube video ID from URL
function extractYouTubeId(url: string | null): string | null {
  if (!url) return null

  // If it's already just an ID (no slashes or query params), return it
  if (!url.includes('/') && !url.includes('?')) {
    return url
  }

  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  if (watchMatch) return watchMatch[1]

  // Handle youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  if (shortMatch) return shortMatch[1]

  // Handle youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/\/embed\/([^?]+)/)
  if (embedMatch) return embedMatch[1]

  return null
}

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { currentJourney, progressMap, updateProgress, submitLesson, loadJourney } = useJourney()
  const { success, error } = useToast()

  const journeyId = parseInt(params.journeySlug as string)
  const chapterId = parseInt(params.chapterId as string)
  const lessonId = parseInt(params.lessonId as string)

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoadingLesson, setIsLoadingLesson] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Load journey and lesson
  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return

    if (!isAuthenticated) {
      router.push('/sign-in')
      return
    }

    if (!isNaN(journeyId)) {
      loadJourney(journeyId)
    }
  }, [journeyId, isAuthenticated, authLoading])

  // Load lesson details from API
  useEffect(() => {
    async function fetchLesson() {
      setIsLoadingLesson(true)
      try {
        const response = await getLesson(lessonId)
        if (response.success && response.data) {
          const lessonData = response.data

          // If videoUrl is null (premium course not purchased), redirect to course page
          if (!lessonData.videoUrl) {
            setIsRedirecting(true)
            error('此課程需要購買後才能觀看')
            setTimeout(() => {
              router.push(`/journeys/${journeyId}`)
            }, 1500)
            // Don't set lesson and don't set loading to false to prevent rendering
            return
          }

          // Only set lesson if user has access (videoUrl exists)
          setLesson(lessonData)
          setIsLoadingLesson(false)
        } else {
          setLesson(null)
          setIsLoadingLesson(false)
        }
      } catch (err) {
        console.error('Failed to load lesson:', err)
        setLesson(null)
        setIsLoadingLesson(false)
      }
    }

    if (!isNaN(lessonId) && !authLoading) {
      fetchLesson()
    }
  }, [lessonId, authLoading, journeyId, router])

  const progress = progressMap[lessonId]
  const isCompleted = progress?.completed || false

  // 找出上一個和下一個單元 - memoize to avoid recalculation
  const { prev, next } = React.useMemo(() => {
    if (!currentJourney) return { prev: null, next: null }

    const allLessons: number[] = []
    currentJourney.chapters.forEach(chapter => {
      chapter.lessons.forEach(l => allLessons.push(l.id))
    })

    const currentIndex = allLessons.indexOf(lessonId)
    return {
      prev: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next: currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null,
    }
  }, [currentJourney, lessonId])

  const handleVideoProgress = async (videoProgress: { currentTime: number; duration: number; percentage: number }) => {
    if (!user || !lesson) return

    try {
      await updateProgress(lessonId, {
        currentTime: Math.floor(videoProgress.currentTime),
        duration: Math.floor(videoProgress.duration),
        percentage: videoProgress.percentage,
        lastUpdated: Date.now(),
      })
    } catch (err) {
      // Silently fail - don't disrupt viewing experience
      console.error('Failed to update progress:', err)
    }
  }

  const handleVideoComplete = async () => {
    if (!user || !lesson) return

    try {
      await updateProgress(lessonId, {
        currentTime: Math.floor(lesson.videoDuration || 0),
        duration: Math.floor(lesson.videoDuration || 0),
        percentage: 100,
        completed: true,
        lastUpdated: Date.now(),
      })
      success('影片已看完！現在可以繳交單元了')
    } catch (err) {
      console.error('Failed to mark as complete:', err)
    }
  }

  const handleSubmit = async () => {
    if (!user || !lesson) return

    // Check if lesson is completed first
    const lessonProgress = progressMap[lessonId]
    if (!lessonProgress || !lessonProgress.completed) {
      error('請先觀看完整影片才能繳交單元')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitLesson(lessonId)

      // Display experience gained from backend response
      const expGained = (result as any)?.experienceGained || lesson.reward?.exp || 0
      success(`單元繳交成功！獲得 ${expGained} EXP`)

      // Update user context if user data was returned
      if ((result as any)?.user) {
        // User level/exp will be updated in AuthContext
        // For now, just log it
        console.log('User updated:', (result as any).user)
      }

      // 自動跳到下一個單元
      if (next) {
        setTimeout(() => {
          router.push(`/journeys/${journeyId}/chapters/${chapterId}/missions/${next}`)
        }, 1500)
      }
    } catch (err: any) {
      console.error('Failed to submit lesson:', err)
      const errorMessage = err?.message || '繳交失敗，請稍後再試'
      error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state while auth is initializing
  if (authLoading) {
    return (
      <MainLayout>
        <Section className="py-12">
          <Container>
            <div className="flex justify-center items-center min-h-[60vh]">
              <Spinner size="lg" />
            </div>
          </Container>
        </Section>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Show loading state while fetching lesson or redirecting
  if (isLoadingLesson || isRedirecting) {
    return (
      <MainLayout>
        <Section className="py-12">
          <Container>
            <div className="flex justify-center items-center min-h-[60vh]">
              <Spinner size="lg" />
              {isRedirecting && (
                <p className="mt-4 text-gray-600">正在重定向到課程頁面...</p>
              )}
            </div>
          </Container>
        </Section>
      </MainLayout>
    )
  }

  // Show empty state if lesson not found
  if (!lesson) {
    return (
      <MainLayout>
        <Section className="py-12">
          <Container>
            <EmptyState
              icon={<BookOpen className="w-16 h-16" />}
              title="找不到課程單元"
              description="此單元不存在或已被移除"
              action={
                <Button onClick={() => router.push(`/journeys/${journeyId}`)}>
                  返回課程
                </Button>
              }
            />
          </Container>
        </Section>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Section className="py-8">
        <Container>
          {/* 麵包屑 */}
          {currentJourney && (
            <Breadcrumb
              items={[
                { label: '首頁', href: '/' },
                { label: '課程', href: '/courses' },
                { label: currentJourney.name, href: `/journeys/${journeyId}` },
                { label: lesson.name },
              ]}
            />
          )}

          <div className="flex flex-col lg:flex-row gap-8 mt-6">
            {/* 左側：影片播放器 */}
            <div className="flex-1">
              {/* 影片 */}
              <Card className="overflow-hidden mb-6">
                {(() => {
                  const videoId = extractYouTubeId(lesson.videoUrl || null)
                  return videoId ? (
                    <VideoPlayer
                      key={`video-${lessonId}-${videoId}`}
                      videoId={videoId}
                      onProgress={handleVideoProgress}
                      onComplete={handleVideoComplete}
                    />
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-gray-900">
                      <div className="text-center text-white p-8">
                        <p className="text-lg font-medium mb-2">影片載入失敗</p>
                        <p className="text-sm text-gray-400">此課程影片暫時無法使用</p>
                      </div>
                    </div>
                  )
                })()}
              </Card>

              {/* 單元資訊 */}
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{lesson.name}</h1>
                    <p className="text-gray-600">{lesson.description}</p>
                  </div>
                  {isCompleted && (
                    <Badge variant="success" size="lg" className="gap-2">
                      <CheckCircle className="w-5 h-5" />
                      已完成
                    </Badge>
                  )}
                </div>

                {/* 獎勵資訊 */}
                <Card className="p-4 bg-primary-50 border-primary-200">
                  <div className="flex items-center gap-4">
                    <Award className="w-8 h-8 text-primary-600" />
                    <div>
                      <div className="font-bold text-primary-900">
                        完成獎勵
                      </div>
                      <div className="text-sm text-primary-700">
                        {lesson.reward?.exp || 0} EXP
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-4">
                {prev && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/journeys/${journeyId}/chapters/${chapterId}/missions/${prev}`)
                    }
                    icon={<ChevronLeft className="w-5 h-5" />}
                  >
                    上一個
                  </Button>
                )}

                <Button
                  variant={isCompleted ? 'success' : 'primary'}
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={isCompleted}
                  icon={<CheckCircle className="w-5 h-5" />}
                  className="flex-1"
                >
                  {isCompleted ? '已繳交' : '繳交單元'}
                </Button>

                {next && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/journeys/${journeyId}/chapters/${chapterId}/missions/${next}`)
                    }
                    iconPosition="right"
                    icon={<ChevronRight className="w-5 h-5" />}
                  >
                    下一個
                  </Button>
                )}
              </div>
            </div>

            {/* 右側：進度資訊 */}
            <div className="lg:w-80">
              <Card className="p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">學習進度</h3>

                {progress && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">觀看進度</span>
                      <span className="font-medium">{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 單元類型 */}
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">單元類型</div>
                  <Badge variant="primary">{lesson.type}</Badge>
                </div>

                {/* 統計 */}
                <div className="pt-4 border-t space-y-3">
                  {lesson.videoLength && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">影片時長</span>
                      <span className="font-medium">{lesson.videoLength}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">獎勵 EXP</span>
                    <span className="font-medium text-primary-600">
                      {lesson.reward?.exp || 0}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </MainLayout>
  )
}
