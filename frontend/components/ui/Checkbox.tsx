/**
 * Checkbox 複選框元件
 *
 * 支援半選狀態、標籤
 */

'use client'

import { CheckboxProps } from '@/types/ui'
import { cn } from '@/lib/utils'
import { Check, Minus } from 'lucide-react'

export default function Checkbox({
  checked,
  defaultChecked,
  disabled = false,
  indeterminate = false,
  label,
  onChange,
  className,
}: CheckboxProps) {
  const isChecked = checked ?? defaultChecked ?? false

  const handleChange = () => {
    if (!disabled) {
      onChange?.(!isChecked)
    }
  }

  return (
    <label
      className={cn(
        'inline-flex items-center gap-2',
        'cursor-pointer',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />

        <div
          className={cn(
            'w-5 h-5 rounded',
            'border-2',
            'flex items-center justify-center',
            'transition-all duration-200',
            isChecked || indeterminate
              ? 'bg-primary-500 border-primary-500'
              : 'bg-white border-gray-300 hover:border-primary-500'
          )}
        >
          {indeterminate ? (
            <Minus className="w-3 h-3 text-white" strokeWidth={3} />
          ) : isChecked ? (
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          ) : null}
        </div>
      </div>

      {label && (
        <span className="text-sm text-gray-700 select-none">
          {label}
        </span>
      )}
    </label>
  )
}
