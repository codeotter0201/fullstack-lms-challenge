/**
 * TopBar 頂部工具列
 *
 * Sticky 定位的頂部工具列，包含課程選擇器、通知、用戶選單
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Settings, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, Badge, Dropdown } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { DropdownItem } from '@/types/ui'
import { useRouter } from 'next/navigation'

export default function TopBar() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [notificationCount] = useState(3)

  // 用戶下拉選單項目
  const userMenuItems: DropdownItem[] = [
    {
      key: 'profile',
      label: '個人檔案',
      onClick: () => router.push('/users/me/profile'),
    },
    {
      key: 'settings',
      label: '設定',
      onClick: () => router.push('/settings'),
    },
    {
      key: 'divider-1',
      label: '',
      divider: true,
    },
    {
      key: 'logout',
      label: '登出',
      danger: true,
      onClick: () => {
        logout()
        router.push('/sign-in')
      },
    },
  ]

  return (
    <header className="sticky top-0 h-16 bg-background-tertiary border-b border-border z-sticky">
      <div className="h-full flex items-center justify-between px-6">
        {/* 左側：課程選擇器（預留） */}
        <div className="flex items-center gap-3">
          <button
            className={cn(
              'px-4 py-2 rounded-lg',
              'bg-background-hover border border-border',
              'text-sm font-medium text-text-secondary',
              'hover:border-border-hover hover:text-text-primary',
              'transition-colors duration-200',
              'flex items-center gap-2'
            )}
          >
            <span>選擇課程</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* 右側：通知 + 用戶選單 */}
        <div className="flex items-center gap-4">
          {/* 通知鈴鐺 */}
          <Link
            href="/notifications"
            className={cn(
              'relative p-2 rounded-lg',
              'text-text-secondary hover:bg-background-hover hover:text-text-primary',
              'transition-colors duration-200'
            )}
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold"
              >
                {notificationCount}
              </Badge>
            )}
          </Link>

          {/* 設定 */}
          <Link
            href="/settings"
            className={cn(
              'p-2 rounded-lg',
              'text-text-secondary hover:bg-background-hover hover:text-text-primary',
              'transition-colors duration-200'
            )}
          >
            <Settings className="w-5 h-5" />
          </Link>

          {/* 用戶選單 */}
          {user && (
            <Dropdown items={userMenuItems} placement="bottom-end">
              <button className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-background-hover transition-colors">
                <Avatar
                  src={user.pictureUrl}
                  alt={user.name}
                  size="sm"
                  badge={<span className="text-[10px] font-semibold">{user.level}</span>}
                />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-text-primary">
                    {user.nickname || user.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Lv.{user.level}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary hidden lg:block" />
              </button>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  )
}
