/**
 * Select 下拉選擇元件
 *
 * 支援搜尋、多選、清除
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { SelectProps } from '@/types/ui'
import { cn } from '@/lib/utils'
import { ChevronDown, X, Search } from 'lucide-react'

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
}

export default function Select({
  options,
  value,
  defaultValue,
  placeholder = '請選擇...',
  disabled = false,
  error,
  size = 'md',
  searchable = false,
  clearable = false,
  multiple = false,
  onChange,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedValue, setSelectedValue] = useState<string | number | (string | number)[] | undefined>(value ?? defaultValue)
  const selectRef = useRef<HTMLDivElement>(null)

  const currentValue = value ?? selectedValue

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 過濾選項
  const filteredOptions = searchable && searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options

  // 選中的選項
  const selectedOptions = multiple
    ? options.filter(opt => Array.isArray(currentValue) && currentValue.includes(opt.value))
    : options.find(opt => opt.value === currentValue)

  const displayText = multiple && Array.isArray(selectedOptions)
    ? selectedOptions.map(opt => opt.label).join(', ') || placeholder
    : selectedOptions && !Array.isArray(selectedOptions)
    ? selectedOptions.label
    : placeholder

  const handleSelect = (optionValue: string | number) => {
    if (multiple) {
      const currentArray = Array.isArray(currentValue) ? currentValue as (string | number)[] : []
      const newValue = currentArray.includes(optionValue)
        ? currentArray.filter(v => v !== optionValue)
        : [...currentArray, optionValue]

      setSelectedValue(newValue)
      onChange?.(newValue)
    } else {
      setSelectedValue(optionValue)
      onChange?.(optionValue)
      setIsOpen(false)
    }
    setSearchQuery('')
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedValue(multiple ? [] : undefined)
    onChange?.(multiple ? [] : '')
  }

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      {/* 選擇器 */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full rounded-lg border bg-white',
          'flex items-center justify-between gap-2',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2',
          sizeStyles[size],
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',
          disabled && 'bg-gray-100 cursor-not-allowed opacity-60'
        )}
      >
        <span
          className={cn(
            'truncate',
            !currentValue || (Array.isArray(currentValue) && currentValue.length === 0)
              ? 'text-gray-400'
              : 'text-gray-900'
          )}
        >
          {displayText}
        </span>

        <div className="flex items-center gap-1">
          {clearable && currentValue && (
            <X
              className="w-4 h-4 text-gray-400 hover:text-gray-600"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            className={cn(
              'w-4 h-4 text-gray-400 transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </div>
      </button>

      {/* 下拉選單 */}
      {isOpen && !disabled && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2',
            'bg-white rounded-lg shadow-lg',
            'border border-gray-200',
            'max-h-60 overflow-auto',
            'animate-in fade-in slide-in-from-top-2 duration-200'
          )}
        >
          {/* 搜尋框 */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜尋..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
              </div>
            </div>
          )}

          {/* 選項列表 */}
          <div className="py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500 text-center">
                無符合選項
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = multiple
                  ? Array.isArray(currentValue) && currentValue.includes(option.value)
                  : currentValue === option.value

                return (
                  <button
                    key={option.value}
                    type="button"
                    disabled={option.disabled}
                    onClick={() => handleSelect(option.value)}
                    className={cn(
                      'w-full px-4 py-2',
                      'flex items-center gap-3',
                      'text-left text-sm',
                      'transition-colors duration-200',
                      isSelected
                        ? 'bg-primary-50 text-primary-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50',
                      option.disabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {option.icon && <span>{option.icon}</span>}
                    <span className="flex-1">{option.label}</span>
                    {isSelected && multiple && (
                      <X className="w-4 h-4 text-primary-600" />
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* 錯誤訊息 */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}
