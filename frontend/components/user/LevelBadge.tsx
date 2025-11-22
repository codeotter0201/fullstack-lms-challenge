/**
 * LevelBadge 等級徽章元件
 *
 * 用於顯示用戶等級
 */

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showIcon?: boolean
  variant?: 'default' | 'gradient' | 'outline'
  className?: string
}

const sizeStyles = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
  xl: 'w-12 h-12 text-lg',
}

const variantStyles = {
  default: 'bg-primary-500 text-white',
  gradient: 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg',
  outline: 'border-2 border-primary-500 text-primary-600 bg-white',
}

export default function LevelBadge({
  level,
  size = 'md',
  showIcon = false,
  variant = 'gradient',
  className,
}: LevelBadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        'rounded-lg font-bold',
        'transition-all duration-200',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      title={`等級 ${level}`}
    >
      {showIcon ? (
        <Star className={cn('fill-current', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
      ) : (
        <span>{level}</span>
      )}
    </div>
  )
}
