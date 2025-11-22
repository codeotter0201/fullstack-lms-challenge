/**
 * EmptyState 空狀態元件
 *
 * 用於顯示空數據、404 等狀態
 */

import { EmptyStateProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        'py-12 px-4',
        'text-center',
        className
      )}
    >
      {/* 圖示 */}
      {icon && (
        <div className="mb-4 text-gray-400">
          {icon}
        </div>
      )}

      {/* 標題 */}
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>

      {/* 描述 */}
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>
      )}

      {/* 操作按鈕 */}
      {action && (
        <div>
          {action}
        </div>
      )}
    </div>
  )
}
