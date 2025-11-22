/**
 * FormField 表單欄位容器元件
 *
 * 包裝表單元件，提供標籤、錯誤訊息、輔助文字
 */

import { FormFieldProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function FormField({
  label,
  required = false,
  error,
  helperText,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* 標籤 */}
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* 表單元件 */}
      {children}

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
