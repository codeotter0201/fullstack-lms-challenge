/**
 * OwnershipBadge 擁有狀態徽章
 *
 * 顯示課程的擁有狀態：已擁有、尚未擁有、付費專屬
 */

'use client'

import { Lock, Check, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

type OwnershipStatus = 'owned' | 'not-owned' | 'premium'

interface OwnershipBadgeProps {
  status: OwnershipStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const statusConfig = {
  owned: {
    label: '已擁有',
    icon: Check,
    bgColor: 'bg-status-success/20',
    textColor: 'text-status-success',
    borderColor: 'border-status-success/30',
  },
  'not-owned': {
    label: '尚未擁有',
    icon: Lock,
    bgColor: 'bg-text-disabled/20',
    textColor: 'text-text-secondary',
    borderColor: 'border-text-disabled/30',
  },
  premium: {
    label: '付費專屬',
    icon: Crown,
    bgColor: 'bg-primary/20',
    textColor: 'text-primary',
    borderColor: 'border-primary/30',
  },
}

const sizeConfig = {
  sm: {
    padding: 'px-2 py-1',
    text: 'text-xs',
    icon: 'w-3 h-3',
  },
  md: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 'w-4 h-4',
  },
  lg: {
    padding: 'px-4 py-2',
    text: 'text-base',
    icon: 'w-5 h-5',
  },
}

export default function OwnershipBadge({
  status,
  size = 'md',
  className,
}: OwnershipBadgeProps) {
  const config = statusConfig[status]
  const sizeStyle = sizeConfig[size]
  const Icon = config.icon

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border',
        'font-medium',
        sizeStyle.padding,
        sizeStyle.text,
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <Icon className={sizeStyle.icon} />
      <span>{config.label}</span>
    </div>
  )
}
