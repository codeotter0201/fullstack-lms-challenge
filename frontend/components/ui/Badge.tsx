/**
 * Badge 徽章元件
 *
 * 用於顯示狀態、標籤等
 */

import { BadgeProps } from '@/types/ui'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-gray-100 text-gray-800',
  primary: 'bg-primary-100 text-primary-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
}

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

export default function Badge({
  variant = 'default',
  size = 'md',
  rounded = false,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        // 基礎樣式
        'inline-flex items-center justify-center',
        'font-medium',
        'transition-colors duration-200',

        // 變體樣式
        variantStyles[variant],

        // 尺寸樣式
        sizeStyles[size],

        // 圓角樣式
        rounded ? 'rounded-full' : 'rounded-md',

        // 自訂樣式
        className
      )}
    >
      {children}
    </span>
  )
}
