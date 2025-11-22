/**
 * Navbar 導航列元件
 *
 * 包含 Logo、導航連結、用戶選單
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Menu, X, Bell, Settings } from 'lucide-react'
import Logo from './Logo'
import { Avatar, Badge, Dropdown } from '@/components/ui'
import { currentUser } from '@/lib/mock/users'
import { DropdownItem } from '@/types/ui'

const navLinks = [
  { href: '/', label: '首頁' },
  { href: '/journeys', label: '課程' },
  { href: '/leaderboard', label: '排行榜' },
  { href: '/about', label: '關於' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // 用戶下拉選單項目
  const userMenuItems: DropdownItem[] = [
    {
      key: 'profile',
      label: '個人檔案',
      onClick: () => console.log('Profile'),
    },
    {
      key: 'settings',
      label: '設定',
      onClick: () => console.log('Settings'),
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
      onClick: () => console.log('Logout'),
    },
  ]

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 左側: Logo + 導航連結 (桌面版) */}
          <div className="flex items-center gap-8">
            <Logo />

            {/* 桌面版導航連結 */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-4 py-2 rounded-lg',
                      'font-medium text-sm',
                      'transition-colors duration-200',
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* 右側: 通知 + 用戶選單 (桌面版) */}
          <div className="hidden md:flex items-center gap-4">
            {/* 通知鈴鐺 */}
            <button
              className={cn(
                'relative p-2 rounded-lg',
                'text-gray-600 hover:bg-gray-100',
                'transition-colors duration-200'
              )}
            >
              <Bell className="w-5 h-5" />
              {/* 未讀通知徽章 */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* 設定 */}
            <Link
              href="/settings"
              className={cn(
                'p-2 rounded-lg',
                'text-gray-600 hover:bg-gray-100',
                'transition-colors duration-200'
              )}
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* 用戶選單 */}
            <Dropdown items={userMenuItems} placement="bottom-end">
              <button className="flex items-center gap-3 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Avatar
                  src={currentUser.pictureUrl}
                  alt={currentUser.name}
                  size="sm"
                  badge={<span className="text-[10px]">{currentUser.level}</span>}
                />
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser.nickname || currentUser.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Lv.{currentUser.level}
                  </p>
                </div>
              </button>
            </Dropdown>
          </div>

          {/* 行動版選單按鈕 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* 行動版選單 */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-2">
            {/* 用戶資訊 */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
              <Avatar
                src={currentUser.pictureUrl}
                alt={currentUser.name}
                size="md"
                badge={<span className="text-xs">{currentUser.level}</span>}
              />
              <div>
                <p className="font-medium text-gray-900">
                  {currentUser.nickname || currentUser.name}
                </p>
                <p className="text-sm text-gray-500">
                  Lv.{currentUser.level} • {currentUser.exp} EXP
                </p>
              </div>
            </div>

            {/* 導航連結 */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-4 py-3 rounded-lg',
                    'font-medium',
                    'transition-colors duration-200',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* 其他選項 */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <Link
                href="/notifications"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Bell className="w-5 h-5" />
                <span>通知</span>
                <Badge variant="danger" size="sm" className="ml-auto">
                  3
                </Badge>
              </Link>

              <Link
                href="/settings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
                <span>設定</span>
              </Link>

              <button
                onClick={() => console.log('Logout')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50"
              >
                <span>登出</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
