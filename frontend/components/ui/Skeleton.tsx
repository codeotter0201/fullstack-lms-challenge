/**
 * Skeleton 骨架屏元件
 *
 * 用於內容載入時的佔位顯示
 */

import { SkeletonProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function Skeleton({
  loading,
  rows = 3,
  avatar = false,
  title = true,
  active = true,
  className,
  children,
}: SkeletonProps) {
  if (!loading && children) {
    return <>{children}</>
  }

  if (!loading) {
    return null
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* 頭像 + 標題 */}
      {(avatar || title) && (
        <div className="flex items-center gap-3">
          {/* 頭像 */}
          {avatar && (
            <div
              className={cn(
                'w-12 h-12 rounded-full bg-gray-200',
                active && 'animate-pulse'
              )}
            />
          )}

          {/* 標題 */}
          {title && (
            <div className="flex-1 space-y-2">
              <div
                className={cn(
                  'h-4 bg-gray-200 rounded w-1/3',
                  active && 'animate-pulse'
                )}
              />
            </div>
          )}
        </div>
      )}

      {/* 內容行 */}
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            key={index}
            className={cn(
              'h-3 bg-gray-200 rounded',
              active && 'animate-pulse',
              // 最後一行寬度較短
              index === rows - 1 ? 'w-2/3' : 'w-full'
            )}
          />
        ))}
      </div>
    </div>
  )
}
