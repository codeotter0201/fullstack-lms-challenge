/**
 * PromotionalBanner 促銷橫幅
 *
 * 顯示課程折價券促銷訊息
 * 符合目標網站設計：https://world.waterballsa.tw/
 */

'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

interface PromotionalBannerProps {
  message?: string
  highlightText?: string
  ctaText?: string
  ctaLink?: string
  dismissible?: boolean
  storageKey?: string
  className?: string
}

export default function PromotionalBanner({
  message = '將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！',
  highlightText = '3000 元課程折價券',
  ctaText = '前往',
  ctaLink = '/journeys/software-design-pattern/chapters/8/missions/1',
  dismissible = true,
  storageKey = 'promotional-banner-closed',
  className,
}: PromotionalBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // 檢查 localStorage 中是否已關閉橫幅
    if (dismissible && storageKey) {
      const isClosed = localStorage.getItem(storageKey) === 'true'
      setIsDismissed(isClosed)
    }
  }, [dismissible, storageKey])

  const handleClose = () => {
    setIsDismissed(true)
    if (storageKey) {
      localStorage.setItem(storageKey, 'true')
    }
  }

  if (isDismissed) {
    return null
  }

  // 將 message 分割成 highlightText 前後兩部分
  const parts = message.split(highlightText)
  const beforeHighlight = parts[0] || ''
  const afterHighlight = parts[1] || ''

  return (
    <div
      className={cn(
        'relative w-full bg-[#2D3142] text-white px-6 py-4',
        'border-b border-border',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* 促銷訊息 */}
        <p className="text-sm md:text-base flex-1">
          {beforeHighlight}
          <span className="underline decoration-2 underline-offset-4">
            {highlightText}
          </span>
          {afterHighlight}
        </p>

        {/* CTA 按鈕 */}
        {ctaLink && (
          <Link href={ctaLink}>
            <Button
              variant="primary"
              size="sm"
              className="whitespace-nowrap shrink-0"
            >
              {ctaText}
            </Button>
          </Link>
        )}

        {/* 關閉按鈕 */}
        {dismissible && (
          <button
            onClick={handleClose}
            className={cn(
              'p-1 rounded-md shrink-0',
              'text-text-secondary hover:text-white',
              'hover:bg-background-hover',
              'transition-colors duration-200'
            )}
            aria-label="關閉橫幅"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}
