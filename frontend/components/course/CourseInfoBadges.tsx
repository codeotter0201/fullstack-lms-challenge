/**
 * CourseInfoBadges 課程資訊徽章組
 *
 * 顯示課程的關鍵資訊標籤（語言、裝置支援、認證等）
 */

'use client'

import { Globe, Smartphone, Award, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CourseBadge {
  icon: React.ElementType
  label: string
  color?: string
}

interface CourseInfoBadgesProps {
  language?: string
  supportsMobile?: boolean
  hasCertificate?: boolean
  duration?: string
  customBadges?: CourseBadge[]
  className?: string
}

export default function CourseInfoBadges({
  language = '中文課程',
  supportsMobile = true,
  hasCertificate = true,
  duration,
  customBadges = [],
  className,
}: CourseInfoBadgesProps) {
  const defaultBadges: CourseBadge[] = []

  // 語言徽章
  if (language) {
    defaultBadges.push({
      icon: Globe,
      label: language,
      color: 'text-primary',
    })
  }

  // 行動裝置支援
  if (supportsMobile) {
    defaultBadges.push({
      icon: Smartphone,
      label: '支援行動裝置',
      color: 'text-status-info',
    })
  }

  // 專業證書
  if (hasCertificate) {
    defaultBadges.push({
      icon: Award,
      label: '專業完課認證',
      color: 'text-primary',
    })
  }

  // 課程時長
  if (duration) {
    defaultBadges.push({
      icon: Clock,
      label: duration,
      color: 'text-text-secondary',
    })
  }

  const allBadges = [...defaultBadges, ...customBadges]

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {allBadges.map((badge, index) => {
        const Icon = badge.icon
        return (
          <div
            key={index}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'bg-background-secondary border border-border',
              'text-sm font-medium',
              'transition-colors duration-200',
              'hover:bg-background-hover'
            )}
          >
            <Icon className={cn('w-4 h-4', badge.color || 'text-text-secondary')} />
            <span className="text-text-primary">{badge.label}</span>
          </div>
        )
      })}
    </div>
  )
}
