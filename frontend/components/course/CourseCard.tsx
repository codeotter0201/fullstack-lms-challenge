/**
 * CourseCard 課程卡片元件
 *
 * 符合目標網站設計：
 * - 整體黃色邊框（border-2 border-primary）
 * - 大圖封面（16:9 比例，帶黃色頂部邊框）
 * - 講師名稱金色
 * - 底部黃色優惠區塊
 * - 雙金色 CTA 按鈕
 */

'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { Journey } from '@/types/journey'

interface CourseCardProps {
  course: Journey
  isOwned?: boolean
  className?: string
  onPurchaseClick?: () => void
  showDiscount?: boolean
  discountText?: string
}

export default function CourseCard({
  course,
  isOwned = false,
  className,
  onPurchaseClick,
  showDiscount = false,
  discountText = '限時優惠',
}: CourseCardProps) {
  const router = useRouter()
  const {
    name,
    slug,
    description,
    thumbnailUrl,
    author,
    isPremium,
  } = course

  const handleNavigate = () => {
    router.push(`/journeys/${slug}`)
  }

  const handlePurchase = (e: React.MouseEvent) => {
    e.stopPropagation()
    onPurchaseClick?.()
  }

  return (
    <div
      className={cn(
        // 整體黃色邊框
        'border-2 border-primary',
        'rounded-md',
        'overflow-hidden',
        'hover:shadow-xl hover:-translate-y-1',
        'transition-all duration-300',
        'bg-background-secondary',
        className
      )}
    >
      {/* 課程封面 - 大圖，16:9，帶黃色頂部邊框 */}
      <div className="relative aspect-video border-t-4 border-primary bg-background-tertiary">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          // 使用下載的課程圖片
          <Image
            src="/images/course-design-patterns.png"
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
      </div>

      {/* 內容區 */}
      <div className="p-4">
        {/* 課程名稱 */}
        <h3 className="text-lg font-semibold text-text-primary mb-1">
          {name}
        </h3>

        {/* 講師名稱 - 金色 */}
        <p className="text-primary text-sm mb-2 font-medium">
          {author}
        </p>

        {/* 課程描述 */}
        {description && (
          <p className="text-sm text-text-secondary line-clamp-2 mb-4">
            {description}
          </p>
        )}

        {/* 底部優惠區塊 + CTA */}
        <div className="flex items-center gap-3">
          {/* 優惠訊息 - 黃色背景 */}
          {showDiscount && (
            <div className="bg-primary text-[rgb(23,25,35)] px-3 py-2 rounded-md text-sm font-medium flex-1">
              {discountText}
            </div>
          )}

          {/* CTA 按鈕 */}
          <Button
            variant="primary"
            size="md"
            onClick={isOwned ? handleNavigate : handlePurchase}
            className={cn(showDiscount ? '' : 'w-full')}
          >
            {isOwned ? '立刻體驗' : isPremium ? '立刻購買' : '立刻體驗'}
          </Button>
        </div>
      </div>
    </div>
  )
}
