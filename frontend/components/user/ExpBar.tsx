/**
 * ExpBar 經驗值條元件
 *
 * 用於顯示用戶經驗值進度
 */

import { cn } from '@/lib/utils'
import { ProgressBar } from '@/components/ui'
import { TrendingUp } from 'lucide-react'

interface ExpBarProps {
  currentExp: number
  nextLevelExp: number
  level: number
  showLabel?: boolean
  showLevel?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const heightStyles = {
  sm: 6,
  md: 8,
  lg: 12,
}

export default function ExpBar({
  currentExp,
  nextLevelExp,
  level,
  showLabel = true,
  showLevel = true,
  size = 'md',
  className,
}: ExpBarProps) {
  const percentage = nextLevelExp > 0
    ? Math.min(Math.round((currentExp / nextLevelExp) * 100), 100)
    : 100

  return (
    <div className={cn('w-full', className)}>
      {/* 標題列 */}
      {(showLabel || showLevel) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">
                經驗值
              </span>
            </div>
          )}

          {showLevel && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Lv.{level}</span>
              <span className="text-xs text-gray-400">→</span>
              <span className="text-xs font-medium text-primary-600">Lv.{level + 1}</span>
            </div>
          )}
        </div>
      )}

      {/* 進度條 */}
      <ProgressBar
        percentage={percentage}
        height={heightStyles[size]}
        color="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        className="mb-1"
      />

      {/* 數值顯示 */}
      <div className="flex items-center justify-between text-xs text-gray-600">
        <span>{currentExp.toLocaleString()} EXP</span>
        <span className="font-medium">
          {percentage}%
        </span>
        <span>{nextLevelExp.toLocaleString()} EXP</span>
      </div>
    </div>
  )
}
