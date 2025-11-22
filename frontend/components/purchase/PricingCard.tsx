/**
 * PricingCard 定價卡片
 *
 * 顯示課程價格、折扣資訊與購買按鈕
 */

'use client'

import { Tag, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface PricingCardProps {
  originalPrice: number
  discountedPrice?: number
  discountPercent?: number
  discountLabel?: string
  onPurchase?: () => void
  isOwned?: boolean
  className?: string
}

export default function PricingCard({
  originalPrice,
  discountedPrice,
  discountPercent,
  discountLabel = '限時優惠',
  onPurchase,
  isOwned = false,
  className,
}: PricingCardProps) {
  const hasDiscount = discountedPrice !== undefined && discountedPrice < originalPrice
  const finalPrice = hasDiscount ? discountedPrice : originalPrice
  const calculatedDiscount = hasDiscount
    ? Math.round(((originalPrice - discountedPrice!) / originalPrice) * 100)
    : discountPercent || 0

  return (
    <div
      className={cn(
        'bg-background-tertiary border border-border rounded-lg p-6 space-y-4',
        className
      )}
    >
      {/* 折扣標籤 */}
      {hasDiscount && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-status-error/20 border border-status-error/30">
          <Sparkles className="w-4 h-4 text-status-error" />
          <span className="text-sm font-semibold text-status-error">
            {discountLabel} {calculatedDiscount}折
          </span>
        </div>
      )}

      {/* 價格資訊 */}
      <div>
        {/* 原價 */}
        {hasDiscount && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-text-muted">原價</span>
            <span className="text-lg text-text-muted line-through">
              NT$ {originalPrice.toLocaleString()}
            </span>
          </div>
        )}

        {/* 現價 */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">
            NT$ {finalPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-sm font-medium text-status-success">
              省 NT$ {(originalPrice - finalPrice).toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* 價格細節 */}
      <div className="space-y-2 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">課程費用</span>
          <span className="text-text-primary font-medium">
            NT$ {finalPrice.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">終身存取</span>
          <span className="text-status-success font-medium">✓</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">專業證書</span>
          <span className="text-status-success font-medium">✓</span>
        </div>
      </div>

      {/* 購買按鈕 */}
      <div className="pt-4">
        {isOwned ? (
          <div className="text-center py-3 px-4 rounded-lg bg-status-success/10 border border-status-success/30">
            <span className="text-sm font-medium text-status-success">
              ✓ 你已擁有此課程
            </span>
          </div>
        ) : (
          <Button
            variant="primary"
            size="lg"
            onClick={onPurchase}
            className="w-full"
          >
            立即購買
          </Button>
        )}
      </div>

      {/* 優惠提示 */}
      {hasDiscount && !isOwned && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
          <Tag className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary">
            此優惠價格為限時特惠，購買後即享終身存取權限
          </p>
        </div>
      )}
    </div>
  )
}
