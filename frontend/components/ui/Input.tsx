/**
 * Input 輸入框元件
 *
 * 支援多種類型、尺寸、圖示、錯誤狀態
 */

import { InputProps } from '@/types/ui'
import { cn } from '@/lib/utils'

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
}

export default function Input({
  type = 'text',
  size = 'md',
  placeholder,
  value,
  defaultValue,
  disabled = false,
  error,
  helperText,
  icon,
  suffix,
  fullWidth = false,
  onChange,
  onBlur,
  onFocus,
  className,
}: InputProps) {
  const hasError = !!error

  return (
    <div className={cn('flex flex-col gap-1', fullWidth && 'w-full')}>
      <div className="relative">
        {/* 前置圖示 */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        {/* 輸入框 */}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          onFocus={onFocus}
          className={cn(
            // 基礎樣式
            'w-full rounded-lg border bg-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2',

            // 尺寸樣式
            sizeStyles[size],

            // 圖示間距
            icon ? 'pl-10' : '',
            suffix ? 'pr-10' : '',

            // 正常狀態
            !hasError && 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',

            // 錯誤狀態
            hasError && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',

            // 禁用狀態
            disabled && 'bg-gray-100 cursor-not-allowed opacity-60',

            // 自訂樣式
            className
          )}
        />

        {/* 後置元素 */}
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {suffix}
          </div>
        )}
      </div>

      {/* 錯誤訊息 */}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* 輔助文字 */}
      {!error && helperText && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
