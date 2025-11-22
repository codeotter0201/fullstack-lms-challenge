/**
 * ProfileTabs Component
 *
 * 個人檔案標籤頁導航
 * - 4 個標籤頁：基本資料、道館徽章、技能評級、證書
 * - 選中項黃色背景高亮
 */

'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface ProfileTab {
  key: string
  label: string
}

export interface ProfileTabsProps {
  activeKey?: string
  onChange?: (key: string) => void
  children?: React.ReactNode
}

const defaultTabs: ProfileTab[] = [
  { key: 'basic', label: '基本資料' },
  { key: 'badges', label: '道館徽章' },
  { key: 'skills', label: '技能評級' },
  { key: 'certificates', label: '證書' },
]

export function ProfileTabs({ activeKey: controlledActiveKey, onChange, children }: ProfileTabsProps) {
  const [internalActiveKey, setInternalActiveKey] = useState('basic')
  const activeKey = controlledActiveKey !== undefined ? controlledActiveKey : internalActiveKey

  const handleTabClick = (key: string) => {
    if (controlledActiveKey === undefined) {
      setInternalActiveKey(key)
    }
    onChange?.(key)
  }

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8">
        {defaultTabs.map((tab) => {
          const isActive = activeKey === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.key)}
              className={cn(
                'px-6 py-3 rounded-lg font-medium transition-colors',
                isActive
                  ? 'bg-[#FFD700] text-gray-900'
                  : 'bg-transparent text-white hover:bg-gray-800'
              )}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>{children}</div>
    </div>
  )
}
