/**
 * DiscountBanner 折價券橫幅
 *
 * 顯示可用的折價券資訊，醒目提示
 */

'use client'

import { Ticket, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface DiscountBannerProps {
  discountAmount: number
  expiryDate?: Date
  code?: string
  onClaim?: () => void
  onDismiss?: () => void
  className?: string
}

export default function DiscountBanner({
  discountAmount,
  expiryDate,
  code,
  onClaim,
  onDismiss,
  className,
}: DiscountBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  const formattedDate = expiryDate
    ? new Intl.DateTimeFormat('zh-TW', {
        month: 'long',
        day: 'numeric',
      }).format(expiryDate)
    : null

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg',
        'bg-gradient-to-r from-primary/20 via-primary/10 to-transparent',
        'border-2 border-primary/50',
        'p-4',
        className
      )}
    >
      {/* 背景裝飾 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiNGRkQ3MDAiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50" />

      {/* 內容 */}
      <div className="relative flex items-center gap-4">
        {/* 圖示 */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <Ticket className="w-6 h-6 text-primary" />
        </div>

        {/* 文字內容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-lg font-bold text-primary">
              你有一張 NT$ {discountAmount.toLocaleString()} 折價券
            </h3>
            {code && (
              <span className="px-2 py-0.5 rounded bg-primary/20 text-xs font-mono text-primary">
                {code}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">
            {formattedDate
              ? `${formattedDate} 前有效，購買課程時自動折抵`
              : '購買課程時自動折抵，限時優惠中'}
          </p>
        </div>

        {/* 行動按鈕 */}
        {onClaim && (
          <button
            onClick={onClaim}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-lg',
              'bg-primary text-black font-semibold',
              'hover:bg-primary-dark transition-colors',
              'flex items-center gap-1'
            )}
          >
            <span>立即使用</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* 關閉按鈕 */}
        {onDismiss && (
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-background-hover transition-colors"
            aria-label="關閉"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
