/**
 * FeatureCard 特色卡片
 *
 * 顯示平台特色，包含圖標、標題與描述
 */

'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
  className?: string
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = 'text-primary',
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        'group relative bg-background-tertiary border border-border rounded-xl p-6',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1 hover:border-primary/50',
        className
      )}
    >
      {/* 背景光暈效果 */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative space-y-4">
        {/* 圖標 */}
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center',
          'bg-background-secondary border border-border',
          'group-hover:bg-primary/10 group-hover:border-primary/30',
          'transition-all duration-300'
        )}>
          <Icon className={cn('w-7 h-7', iconColor, 'group-hover:scale-110 transition-transform duration-300')} />
        </div>

        {/* 標題 */}
        <h3 className="text-xl font-bold text-text-primary group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* 描述 */}
        <p className="text-text-secondary leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}
