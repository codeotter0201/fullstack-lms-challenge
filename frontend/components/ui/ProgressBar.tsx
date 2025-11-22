/**
 * ProgressBar 進度條元件
 *
 * 用於顯示完成進度、經驗值等
 */

import { ProgressBarProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function ProgressBar({
  percentage,
  showLabel = false,
  color,
  height = 8,
  animated = false,
  striped = false,
  className,
}: ProgressBarProps) {
  // 確保百分比在 0-100 之間
  const clampedPercentage = Math.max(0, Math.min(100, percentage))

  return (
    <div className={cn('w-full', className)}>
      <div
        className="bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            color || 'bg-primary-500',
            animated && 'animate-pulse',
            striped && 'bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:40px_100%]'
          )}
          style={{
            width: `${clampedPercentage}%`,
            ...(striped && {
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)',
            }),
          }}
        />
      </div>

      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {clampedPercentage.toFixed(0)}%
        </div>
      )}
    </div>
  )
}
