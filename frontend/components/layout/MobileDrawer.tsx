/**
 * MobileDrawer 行動版抽屜選單
 *
 * 從左側滑入的抽屜式導航選單，用於行動裝置
 */

'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, BookOpen, Trophy, User, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import Logo from './Logo'
import { Avatar } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  {
    label: '首頁',
    href: '/',
    icon: Home,
  },
  {
    label: '課程',
    href: '/courses',
    icon: BookOpen,
  },
  {
    label: '排行榜',
    href: '/leaderboard',
    icon: Trophy,
  },
  {
    label: '個人檔案',
    href: '/users/me/profile',
    icon: User,
  },
]

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // 路由變更時關閉抽屜
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // 防止背景滾動
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleLogout = () => {
    logout()
    onClose()
    router.push('/sign-in')
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-modal-backdrop transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* 抽屜主體 */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 w-72 bg-background-tertiary',
          'border-r border-border',
          'flex flex-col z-modal',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 頂部：Logo + 關閉按鈕 */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Logo />
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:bg-background-hover hover:text-text-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 用戶資訊 */}
        {user && (
          <div className="px-4 py-4 border-b border-border">
            <Link
              href="/users/me/profile"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-background-hover transition-colors"
            >
              <Avatar
                src={user.pictureUrl}
                alt={user.name}
                size="md"
                badge={<span className="text-xs font-semibold">{user.level}</span>}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user.nickname || user.name}
                </p>
                <p className="text-xs text-text-secondary">
                  Lv.{user.level} • {user.exp} EXP
                </p>
              </div>
            </Link>

            {/* 經驗值條 */}
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">經驗值</span>
                <span className="text-text-secondary font-medium">
                  {user.exp} / {(user.level + 1) * 1000}
                </span>
              </div>
              <div className="h-2 bg-background-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-dark to-primary rounded-full transition-all duration-300"
                  style={{
                    width: `${(user.exp / ((user.level + 1) * 1000)) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* 導航選單 */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg',
                  'text-sm font-medium transition-all duration-200',
                  'relative',
                  isActive
                    ? 'bg-background-hover text-primary before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r'
                    : 'text-text-secondary hover:bg-background-hover hover:text-text-primary'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* 底部：登出按鈕 */}
        <div className="border-t border-border p-4">
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'text-sm font-medium text-text-secondary',
              'hover:bg-background-hover hover:text-status-error',
              'transition-colors duration-200'
            )}
          >
            <LogOut className="w-4 h-4" />
            <span>登出</span>
          </button>
        </div>
      </aside>
    </>
  )
}
