/**
 * Sidebar 側邊欄元件
 *
 * 用於顯示導航、章節列表等
 */

'use client'

import { useState, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface SidebarItem {
  id: string | number
  label: string
  icon?: ReactNode
  active?: boolean
  completed?: boolean
  locked?: boolean
  badge?: string | number
  children?: SidebarItem[]
  onClick?: () => void
}

interface SidebarProps {
  items: SidebarItem[]
  className?: string
}

function SidebarItemComponent({ item, level = 0 }: { item: SidebarItem; level?: number }) {
  const [isExpanded, setIsExpanded] = useState(item.active || false)
  const hasChildren = item.children && item.children.length > 0

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded)
    }
    item.onClick?.()
  }

  return (
    <div>
      {/* 項目本身 */}
      <button
        onClick={handleClick}
        disabled={item.locked}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3',
          'text-left text-sm font-medium',
          'transition-colors duration-200',
          'rounded-lg',

          // 縮排
          level > 0 && `ml-${level * 4}`,

          // 狀態樣式
          item.active && 'bg-primary-50 text-primary-600',
          !item.active && !item.locked && 'text-gray-700 hover:bg-gray-50',
          item.locked && 'text-gray-400 cursor-not-allowed opacity-60',
          item.completed && 'text-green-600'
        )}
      >
        {/* 展開/收合圖示 */}
        {hasChildren && (
          <span className="flex-shrink-0">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}

        {/* 圖示 */}
        {item.icon && (
          <span className="flex-shrink-0">{item.icon}</span>
        )}

        {/* 標籤 */}
        <span className="flex-1 truncate">{item.label}</span>

        {/* 徽章 */}
        {item.badge && (
          <span
            className={cn(
              'flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium',
              item.active
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700'
            )}
          >
            {item.badge}
          </span>
        )}

        {/* 完成標記 */}
        {item.completed && !hasChildren && (
          <span className="flex-shrink-0">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}

        {/* 鎖定標記 */}
        {item.locked && (
          <span className="flex-shrink-0">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </button>

      {/* 子項目 */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1 ml-4">
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ items, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200',
        'overflow-y-auto',
        className
      )}
    >
      <div className="p-4 space-y-1">
        {items.map((item) => (
          <SidebarItemComponent key={item.id} item={item} />
        ))}
      </div>
    </aside>
  )
}
