/**
 * Button 按鈕元件
 *
 * 符合目標網站設計：
 * - 圓角：6px（rounded-md）
 * - 字重：500（font-medium）
 * - 金色主題：#FFD700
 */

import { ButtonProps } from '@/types/ui'
import { cn } from '@/lib/utils'

const variantStyles = {
  primary: 'bg-primary hover:bg-primary-hover text-[rgb(23,25,35)] shadow-sm hover:shadow-md',
  secondary: 'bg-background-secondary hover:bg-background-hover text-text-primary border border-border',
  outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-[rgb(23,25,35)]',
  ghost: 'text-text-primary hover:bg-background-secondary',
  danger: 'bg-status-error hover:bg-red-600 text-white shadow-sm hover:shadow-md',
  success: 'bg-status-success hover:bg-green-600 text-white shadow-sm hover:shadow-md',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        // 基礎樣式
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-md',  // 字重 500，圓角 6px
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',

        // 觸控優化
        'active:scale-95',
        'touch-manipulation',
        'select-none',

        // 變體樣式
        variantStyles[variant],

        // 尺寸樣式
        sizeStyles[size],

        // 全寬
        fullWidth && 'w-full',

        // 禁用狀態
        isDisabled && 'opacity-50 cursor-not-allowed',

        // 自訂樣式
        className
      )}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {!loading && icon && iconPosition === 'left' && icon}

      {children}

      {!loading && icon && iconPosition === 'right' && icon}
    </button>
  )
}
