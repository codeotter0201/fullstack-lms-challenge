/**
 * 訂單確認頁面
 *
 * 用戶購買課程的獨立確認頁面
 * MVP 版本：點擊確認購買即可完成訂單
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { MainLayout, Container, Section } from '@/components/layout'
import { Button, Card, Spinner } from '@/components/ui'
import { useJourney, useAuth, useToast } from '@/contexts'
import { purchaseCourse } from '@/lib/api/purchases'
import { Check } from 'lucide-react'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const { currentJourney, loadJourney, loadJourneys, isLoading: journeyLoading } = useJourney()
  const [isPurchasing, setIsPurchasing] = useState(false)

  const journeySlug = params.journeySlug as string
  const productId = searchParams.get('productId')

  useEffect(() => {
    // 檢查是否已登入
    if (!isAuthenticated) {
      showToast('error', '請先登入才能購買課程')
      router.push('/sign-in')
      return
    }

    // 載入課程資訊
    let journeyId: number
    if (!isNaN(Number(journeySlug))) {
      journeyId = Number(journeySlug)
    } else {
      journeyId = journeySlug === 'software-design-pattern' ? 1 : 2
    }

    loadJourney(journeyId)
  }, [journeySlug, isAuthenticated, loadJourney, router, showToast])

  const handlePurchaseConfirm = async () => {
    if (!currentJourney) return

    setIsPurchasing(true)
    try {
      const response = await purchaseCourse(currentJourney.id)

      if (response.success && response.data) {
        showToast('success', '購買成功！您現在可以開始學習課程了')

        // 重新載入課程列表以更新存取權限
        await loadJourneys()

        // 導航回課程詳情頁
        router.push(`/journeys/${journeySlug}`)
      } else {
        const errorMessage = (response.error as any)?.message || response.error || '購買失敗，請稍後再試'
        showToast('error', String(errorMessage))
      }
    } catch (error: any) {
      if (error.message?.includes('already purchased') || error.message?.includes('Conflict')) {
        showToast('info', '您已經擁有此課程了')
        await loadJourneys()
        router.push(`/journeys/${journeySlug}`)
      } else {
        showToast('error', '購買失敗，請稍後再試')
      }
      console.error('Purchase error:', error)
    } finally {
      setIsPurchasing(false)
    }
  }

  if (journeyLoading || !currentJourney) {
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

  const finalPrice = currentJourney.price || 0
  const originalPrice = (currentJourney as any).originalPrice || currentJourney.price || 0
  const discount = originalPrice - finalPrice

  return (
    <MainLayout>
      <Section className="py-8">
        <Container>
          {/* 進度指示器 */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-primary text-black flex items-center justify-center font-bold mb-2">
                  1
                </div>
                <div className="text-sm font-medium text-text-primary">建立訂單</div>
              </div>
              <div className="flex-1 h-1 bg-border" />
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-background-secondary text-text-secondary flex items-center justify-center font-bold mb-2">
                  2
                </div>
                <div className="text-sm text-text-secondary">完成支付</div>
              </div>
              <div className="flex-1 h-1 bg-border" />
              <div className="flex flex-col items-center flex-1">
                <div className="w-10 h-10 rounded-full bg-background-secondary text-text-secondary flex items-center justify-center font-bold mb-2">
                  3
                </div>
                <div className="text-sm text-text-secondary">開始上課！</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左側：課程詳細資訊 */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-4">
                  {currentJourney.name}
                </h1>
                <p className="text-lg text-text-secondary leading-relaxed">
                  {currentJourney.description}
                </p>
              </div>

              {/* 課程內容 */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">課程內容</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Check className="w-5 h-5 text-primary" />
                    <span>{currentJourney.chapters.length} 個章節</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Check className="w-5 h-5 text-primary" />
                    <span>
                      {currentJourney.chapters.reduce(
                        (sum, chapter) => sum + chapter.lessons.length,
                        0
                      )} 個單元
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Check className="w-5 h-5 text-primary" />
                    <span>終身存取</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Check className="w-5 h-5 text-primary" />
                    <span>包含所有未來更新</span>
                  </div>
                </div>
              </Card>

              {/* 章節列表 */}
              <Card className="p-6">
                <h2 className="text-xl font-bold text-text-primary mb-4">章節列表</h2>
                <div className="space-y-3">
                  {currentJourney.chapters.map((chapter, index) => (
                    <div key={chapter.id} className="flex items-start gap-3 p-3 rounded-lg bg-background-secondary">
                      <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{chapter.name}</h3>
                        <p className="text-sm text-text-secondary mt-1">
                          {chapter.lessons.length} 個單元
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* 右側：訂單摘要 */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="text-xl font-bold text-text-primary mb-6">訂單摘要</h2>

                {/* 價格資訊 */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">課程原價</span>
                    <span className="text-text-primary">NT$ {originalPrice.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-status-success">
                      <span>折扣優惠</span>
                      <span>- NT$ {discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="h-px bg-border" />
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-text-primary">售價</span>
                    <span className="text-2xl font-bold text-primary">
                      NT$ {finalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 購買按鈕 */}
                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  onClick={handlePurchaseConfirm}
                  disabled={isPurchasing}
                  loading={isPurchasing}
                >
                  {isPurchasing ? '處理中...' : '確認購買'}
                </Button>

                {/* 說明文字 */}
                <div className="mt-4 p-3 rounded-lg bg-background-secondary">
                  <p className="text-xs text-text-secondary text-center">
                    點擊「確認購買」即表示您同意我們的
                    <a href="/terms/service" className="text-primary hover:underline mx-1">
                      服務條款
                    </a>
                    與
                    <a href="/refund-policy" className="text-primary hover:underline mx-1">
                      退款政策
                    </a>
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </MainLayout>
  )
}
