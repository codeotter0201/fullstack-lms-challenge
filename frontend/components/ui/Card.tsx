/**
 * Card 卡片元件
 *
 * 支援多種變體、可點擊、hover 效果
 */

import { CardProps } from '@/types/ui'
import { cn } from '@/lib/utils'

const variantStyles = {
  default: 'bg-card border border-card-border',
  elevated: 'bg-card shadow-md',
  outline: 'bg-card border-2 border-card-border',
  flat: 'bg-card-dark',
  light: 'bg-white border border-gray-200',
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

export default function Card({
  variant = 'default',
  hoverable = false,
  clickable = false,
  padding = 'md',
  className,
  onClick,
  children,
}: CardProps) {
  const Component = clickable || onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={cn(
        // 基礎樣式
        'rounded-lg',
        'transition-all duration-200',

        // 變體樣式
        variantStyles[variant],

        // 內距樣式
        paddingStyles[padding],

        // Hover 效果
        hoverable && 'hover:shadow-lg hover:-translate-y-1',

        // 可點擊樣式
        (clickable || onClick) && [
          'cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'active:scale-[0.98]',
          'touch-manipulation',
          'select-none',
        ],

        // 自訂樣式
        className
      )}
    >
      {children}
    </Component>
  )
}
