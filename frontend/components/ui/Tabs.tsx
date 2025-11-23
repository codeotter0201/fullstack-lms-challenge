/**
 * Tabs 分頁元件
 *
 * 支援 line 和 card 兩種樣式
 */

'use client'

import { useState } from 'react'
import { TabsProps } from '@/types/ui'
import { cn } from '@/lib/utils'

export default function Tabs({
  items,
  defaultActiveKey,
  activeKey: controlledActiveKey,
  onChange,
  type = 'line',
  centered = false,
  className,
}: TabsProps) {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || items[0]?.key)

  const currentKey = controlledActiveKey || activeKey
  const currentItem = items.find(item => item.key === currentKey)

  const handleTabClick = (key: string) => {
    if (!controlledActiveKey) {
      setActiveKey(key)
    }
    onChange?.(key)
  }

  return (
    <div className={cn('w-full', className)}>
      {/* 標籤列 */}
      <div
        className={cn(
          'flex',
          type === 'line' && 'border-b border-card-border',
          centered && 'justify-center',
          type === 'card' && 'gap-2'
        )}
      >
        {items.map((item) => {
          const isActive = item.key === currentKey
          const isDisabled = item.disabled

          return (
            <button
              key={item.key}
              disabled={isDisabled}
              onClick={() => handleTabClick(item.key)}
              className={cn(
                'flex items-center gap-2',
                'px-4 py-2',
                'font-medium',
                'transition-all duration-200',
                'focus:outline-none',

                // Line 樣式
                type === 'line' && [
                  'border-b-2',
                  'hover:text-primary',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-secondary',
                ],

                // Card 樣式
                type === 'card' && [
                  'rounded-lg',
                  isActive
                    ? 'bg-primary text-background'
                    : 'bg-card-dark text-text-secondary hover:bg-background-hover',
                ],

                // 禁用狀態
                isDisabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {item.icon}
              {item.label}
            </button>
          )
        })}
      </div>

      {/* 內容區 */}
      <div className="mt-4 min-h-[280px] transition-all duration-300 ease-in-out">
        {currentItem?.content}
      </div>
    </div>
  )
}
