/**
 * Dropdown 下拉選單元件
 *
 * 支援多種觸發方式、位置
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { DropdownProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function Dropdown({
  items,
  placement = 'bottom-start',
  trigger = 'click',
  className,
  children,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 點擊外部關閉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleTriggerClick = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen)
    }
  }

  const handleTriggerHover = () => {
    if (trigger === 'hover') {
      setIsOpen(true)
    }
  }

  const handleTriggerLeave = () => {
    if (trigger === 'hover') {
      setIsOpen(false)
    }
  }

  const handleItemClick = (item: typeof items[0]) => {
    if (!item.disabled) {
      item.onClick?.()
      setIsOpen(false)
    }
  }

  const placementStyles = {
    'bottom-start': 'top-full left-0 mt-2',
    'bottom': 'top-full left-1/2 -translate-x-1/2 mt-2',
    'bottom-end': 'top-full right-0 mt-2',
    'top-start': 'bottom-full left-0 mb-2',
    'top': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    'top-end': 'bottom-full right-0 mb-2',
  }

  return (
    <div
      ref={dropdownRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={handleTriggerHover}
      onMouseLeave={handleTriggerLeave}
    >
      {/* 觸發元素 */}
      <div onClick={handleTriggerClick}>
        {children}
      </div>

      {/* 下拉選單 */}
      {isOpen && (
        <div
          className={cn(
            'absolute z-50',
            'min-w-[160px]',
            'bg-white rounded-lg shadow-lg',
            'border border-gray-200',
            'py-1',
            'animate-in fade-in slide-in-from-top-2 duration-200',
            placementStyles[placement]
          )}
        >
          {items.map((item, index) => (
            <div key={item.key}>
              {item.divider ? (
                <div className="my-1 border-t border-gray-200" />
              ) : (
                <button
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  data-testid={item.testId}
                  className={cn(
                    'w-full px-4 py-2',
                    'flex items-center gap-3',
                    'text-left text-sm',
                    'transition-colors duration-200',
                    item.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  {item.icon && <span className="text-gray-400">{item.icon}</span>}
                  {item.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
