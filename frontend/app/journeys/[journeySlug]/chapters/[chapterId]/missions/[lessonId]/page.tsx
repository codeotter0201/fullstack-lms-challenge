/**
 * 課程單元頁面（影片播放）
 *
 * 顯示影片播放器、單元資訊、完成按鈕
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout, Container, Section, Breadcrumb } from '@/components/layout'
import { VideoPlayer, LessonCard } from '@/components/course'
import { Button, Card, Badge, Spinner, EmptyState } from '@/components/ui'
import { useJourney, useAuth, useToast } from '@/contexts'
import { getLessonById } from '@/lib/mock/journeys'
import { BookOpen, CheckCircle, Award, ChevronLeft, ChevronRight } from 'lucide-react'

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { currentJourney, progressMap, updateProgress, submitLesson, loadJourney } = useJourney()
  const { success, error } = useToast()

  const journeyId = parseInt(params.journeySlug as string)
  const chapterId = parseInt(params.chapterId as string)
  const lessonId = parseInt(params.lessonId as string)

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/sign-in')
      return
    }

    if (!isNaN(journeyId)) {
      loadJourney(journeyId)
    }
  }, [journeyId, isAuthenticated])

  const lesson = getLessonById(lessonId)
  const progress = progressMap[lessonId]
  const isCompleted = progress?.completed || false

  // 找出上一個和下一個單元
  const findAdjacentLessons = () => {
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
  }

  const { prev, next } = findAdjacentLessons()

  const handleVideoProgress = async (videoProgress: { currentTime: number; duration: number; percentage: number }) => {
    if (!user || !lesson) return

    try {
      await updateProgress(lessonId, {
        currentTime: videoProgress.currentTime,
        duration: videoProgress.duration,
        percentage: videoProgress.percentage,
        lastUpdated: Date.now(),
      })
    } catch (err) {
      console.error('Failed to update progress:', err)
    }
  }

  const handleVideoComplete = async () => {
    if (!user || !lesson) return

    try {
      await updateProgress(lessonId, {
        percentage: 100,
        completed: true,
        lastUpdated: Date.now(),
      })
      success('影片已看完！')
    } catch (err) {
      console.error('Failed to mark as complete:', err)
    }
  }

  const handleSubmit = async () => {
    if (!user || !lesson) return

    setIsSubmitting(true)
    try {
      await submitLesson(lessonId)
      success(`單元繳交成功！獲得 ${lesson.reward.exp} EXP`)

      // 自動跳到下一個單元
      if (next) {
        setTimeout(() => {
          router.push(`/journeys/${journeyId}/chapters/${chapterId}/missions/${next}`)
        }, 1500)
      }
    } catch (err) {
      console.error('Failed to submit lesson:', err)
      error('繳交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

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
                <VideoPlayer
                  videoId={lesson.videoUrl || ''}
                  onProgress={handleVideoProgress}
                  onComplete={handleVideoComplete}
                />
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
                        {lesson.reward.exp} EXP
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
                      {lesson.reward.exp}
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
