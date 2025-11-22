/**
 * 課程詳情頁面
 *
 * 深色主題，整合章節手風琴、證書卡片、課程資訊徽章
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout, Container, Section, Breadcrumb } from '@/components/layout'
import {
  ChapterAccordion,
  CertificateCard,
  CourseInfoBadges,
  OwnershipBadge,
} from '@/components/course'
import { ProgressBar, Button, Card, Spinner, EmptyState } from '@/components/ui'
import { useJourney, useAuth, useToast } from '@/contexts'
import { BookOpen, Award, Lock, Calendar, Play } from 'lucide-react'

export default function JourneyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { currentJourney, progressMap, loadJourney, checkAccess, isLoading } = useJourney()
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)

  const journeySlug = params.journeySlug as string

  useEffect(() => {
    // Load journey by slug (in real app, API would handle slug lookup)
    const mockJourneyId = journeySlug === 'software-design-pattern' ? 1 : 2
    loadJourney(mockJourneyId)
  }, [journeySlug])

  if (isLoading) {
    return (
      <MainLayout>
        <Section className="py-12">
          <Container>
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          </Container>
        </Section>
      </MainLayout>
    )
  }

  if (!currentJourney) {
    return (
      <MainLayout>
        <Section className="py-12">
          <Container>
            <EmptyState
              icon={<BookOpen className="w-16 h-16" />}
              title="找不到課程"
              description="此課程不存在或已被移除"
              action={
                <Button onClick={() => router.push('/courses')}>
                  返回課程列表
                </Button>
              }
            />
          </Container>
        </Section>
      </MainLayout>
    )
  }

  const hasAccess = isAuthenticated && checkAccess(currentJourney.id)
  const totalLessons = currentJourney.chapters.reduce(
    (sum, chapter) => sum + chapter.lessons.length,
    0
  )
  const completedLessons = Object.values(progressMap).filter(
    (progress) => progress.completed
  ).length
  const completionPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const isOwned = hasAccess
  const ownershipStatus = isOwned ? 'owned' : currentJourney.isPremium ? 'premium' : 'not-owned'

  const handleConsultationBooking = () => {
    showToast('1v1 諮詢預約功能開發中', 'info')
  }

  const handleDownloadCertificate = () => {
    showToast('證書下載功能開發中', 'info')
  }

  const handleShareCertificate = () => {
    showToast('證書分享功能開發中', 'info')
  }

  return (
    <MainLayout>
      <Section className="py-8">
        <Container>
          {/* 麵包屑 */}
          <Breadcrumb
            items={[
              { label: '首頁', href: '/' },
              { label: '課程', href: '/courses' },
              { label: currentJourney.name },
            ]}
          />

          {/* 課程頭部 */}
          <div className="mt-6 mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {currentJourney.name}
                </h1>
                <p className="text-lg text-text-secondary mb-4">
                  {currentJourney.description}
                </p>
              </div>
              <OwnershipBadge status={ownershipStatus} size="lg" />
            </div>

            {/* 課程資訊徽章 */}
            <CourseInfoBadges />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側：章節導航 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 課程統計卡片 */}
              <Card className="p-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {currentJourney.chapters.length}
                    </div>
                    <div className="text-sm text-text-secondary">章節</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {totalLessons}
                    </div>
                    <div className="text-sm text-text-secondary">單元</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {currentJourney.videoCount}
                    </div>
                    <div className="text-sm text-text-secondary">影片</div>
                  </div>
                </div>
              </Card>

              {/* 權限提示 */}
              {!isAuthenticated && (
                <Card className="p-6 bg-primary/10 border-primary/30">
                  <div className="flex items-start gap-3">
                    <Lock className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary mb-2">
                        需要登入才能學習
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        請先登入或註冊帳號，即可開始學習此課程
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push('/sign-in')}
                      >
                        立即登入
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {isAuthenticated && !hasAccess && currentJourney.isPremium && (
                <Card className="p-6 bg-primary/10 border-primary/30">
                  <div className="flex items-start gap-3">
                    <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-text-primary mb-2">
                        Premium 課程
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        此課程需要購買才能學習，立即解鎖所有內容
                      </p>
                      <Button variant="primary" size="sm">
                        立即購買 NT$ 3,480
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* 章節手風琴 */}
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-4">課程內容</h2>
                <ChapterAccordion
                  chapters={currentJourney.chapters}
                  journeySlug={currentJourney.slug}
                  completedLessonIds={Object.keys(progressMap)
                    .filter((key) => progressMap[parseInt(key)]?.completed)
                    .map((key) => parseInt(key))}
                />
              </div>

              {/* 1v1 諮詢區塊 */}
              {isOwned && (
                <Card className="p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border-primary/30">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-text-primary mb-2">
                        需要 1v1 諮詢嗎？
                      </h3>
                      <p className="text-sm text-text-secondary mb-4">
                        預約專屬時段，與講師進行一對一的技術討論與職涯諮詢
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleConsultationBooking}
                        icon={<Calendar className="w-4 h-4" />}
                      >
                        預約諮詢
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* 右側：進度與證書 */}
            <div className="lg:col-span-1 space-y-6">
              {isAuthenticated && hasAccess && (
                <>
                  {/* 學習進度卡片 */}
                  <Card className="p-6 sticky top-24">
                    <h3 className="font-bold text-lg text-text-primary mb-4">
                      學習進度
                    </h3>

                    <div className="mb-6">
                      <div className="text-center mb-4">
                        <div className="text-4xl font-bold text-primary mb-1">
                          {completionPercentage}%
                        </div>
                        <div className="text-sm text-text-secondary">
                          已完成 {completedLessons} / {totalLessons} 單元
                        </div>
                      </div>
                      <ProgressBar
                        percentage={completionPercentage}
                        height={12}
                        color="bg-primary"
                      />
                    </div>

                    <Button
                      variant="primary"
                      fullWidth
                      icon={<Play className="w-5 h-5" />}
                      onClick={() =>
                        router.push(
                          `/journeys/${currentJourney.slug}/chapters/1/missions/1`
                        )
                      }
                    >
                      {completionPercentage > 0 ? '繼續學習' : '開始學習'}
                    </Button>
                  </Card>

                  {/* 證書卡片 */}
                  {completionPercentage === 100 && (
                    <CertificateCard
                      journeyName={currentJourney.name}
                      userName={user?.displayName || '學員'}
                      completedAt={new Date()}
                      onDownload={handleDownloadCertificate}
                      onShare={handleShareCertificate}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </MainLayout>
  )
}
