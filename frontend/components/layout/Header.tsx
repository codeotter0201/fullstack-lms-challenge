/**
 * Header Component
 * Top header bar with course selector, challenge map button, notifications, and user menu
 * Matches https://world.waterballsa.tw/ design
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, Bell, Map, LogIn, Menu } from 'lucide-react'
import { useAuth, useJourney } from '@/contexts'
import { cn } from '@/lib/utils'

// Mock notifications - replace with actual data
const mockNotifications = [
  { id: 1, text: 'Nice - that\'s all for now.', emoji: '👏🏽', read: false },
]

interface HeaderProps {
  onMobileMenuClick?: () => void
}

export default function Header({ onMobileMenuClick }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()
  const { journeys, selectedJourney, setSelectedJourney } = useJourney()
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const courseDropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    if (!showCourseDropdown && !showNotifications && !showUserMenu) {
      return
    }

    function handleClickOutside(event: MouseEvent) {
      if (courseDropdownRef.current && !courseDropdownRef.current.contains(event.target as Node)) {
        setShowCourseDropdown(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showCourseDropdown, showNotifications, showUserMenu])

  const unreadNotifications = mockNotifications.filter(n => !n.read)

  return (
    <header className="sticky top-0 z-50 bg-[#2D3142] border-b border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Hamburger Menu (Mobile) + Course Selector */}
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button (Mobile Only) */}
          {onMobileMenuClick && (
            <button
              onClick={onMobileMenuClick}
              data-testid="navbar-mobile-menu-button"
              className="lg:hidden p-2 rounded-md text-white hover:bg-[#1A1D2E] transition-colors"
              aria-label="開啟選單"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {/* Course Selector (always visible) */}
          <div className="relative" ref={courseDropdownRef}>
              <button
                onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                data-testid="navbar-course-dropdown"
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1D2E]/50 border border-gray-600 rounded-lg hover:bg-[#1A1D2E] transition-colors min-w-[280px]"
              >
                <span className="text-white text-sm truncate">
                  {selectedJourney?.name || journeys[0]?.name || '選擇課程'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {/* Course Dropdown */}
              {showCourseDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full bg-[#1A1D2E] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                  {journeys.map((journey) => (
                    <button
                      key={journey.id}
                      data-testid={`navbar-course-option-${journey.id}`}
                      onClick={() => {
                        setSelectedJourney(journey)
                        setShowCourseDropdown(false)
                        // Navigate to course detail when on a lesson page
                        const isOnLessonPage = pathname.includes('/chapters/') && pathname.includes('/missions/')
                        if (isOnLessonPage) {
                          router.push(`/journeys/${journey.slug || journey.id}`)
                        }
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm hover:bg-[#2D3142] transition-colors',
                        journey.id === selectedJourney?.id
                          ? 'bg-[#2D3142] text-white font-medium'
                          : 'text-gray-300'
                      )}
                    >
                      {journey.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
        </div>

        {/* Right: Challenge Map Button, Notifications, User Menu / Login Button */}
        <div className="flex items-center gap-3">
          {/* Show challenge map, notifications and user menu only when authenticated */}
          {isAuthenticated ? (
            <>
              {/* Challenge Map Button */}
              <Link
                href={`/journeys/${selectedJourney?.id || journeys[0]?.id || 1}/roadmap`}
                className="hidden md:flex items-center gap-2 px-4 py-2 border-2 border-primary rounded-lg text-primary font-medium hover:bg-primary/10 transition-colors"
              >
                <Map className="w-4 h-4" />
                <span className="text-sm">前往挑戰</span>
              </Link>

              {/* Notification Bell */}
              <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-lg bg-[#1A1D2E]/50 hover:bg-[#1A1D2E] transition-colors"
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-[#1A1D2E] border border-gray-700 rounded-lg shadow-xl">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-white font-medium">Notifications</h3>
                </div>
                <div className="p-4">
                  <h4 className="text-gray-400 text-sm font-medium mb-3">Unread</h4>
                  {unreadNotifications.length > 0 ? (
                    <div className="space-y-2">
                      {unreadNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-3 p-3 rounded-lg bg-[#2D3142]/50"
                        >
                          <span className="text-2xl">{notification.emoji}</span>
                          <p className="text-sm text-gray-300">{notification.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">No new notifications</p>
                  )}
                </div>
              </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#1A1D2E]/50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center overflow-hidden">
                {user?.pictureUrl ? (
                  <Image
                    src={user.pictureUrl}
                    alt={user.name}
                    width={36}
                    height={36}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-[#1A1D2E] border border-gray-700 rounded-lg shadow-xl overflow-hidden">
                {/* User Info Header */}
                <div className="p-4 border-b border-gray-700">
                  <div className="text-white font-medium text-sm mb-1">
                    {user?.nickname || user?.name} #{user?.id}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400">Lv. {user?.level || 1}</span>
                    <span className="text-gray-500">({user?.exp || 0}/200)</span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${((user?.exp || 0) / 200) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/users/me/profile"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2D3142] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    個人檔案
                  </Link>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2D3142] transition-colors"
                    onClick={() => {
                      // Toggle theme
                      setShowUserMenu(false)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    切換主題
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2D3142] transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    邀請好友
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-700 py-2">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    onClick={() => {
                      logout()
                      setShowUserMenu(false)
                    }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    登出
                  </button>
                </div>
              </div>
              )}
            </div>
          </>
          ) : (
            /* Login Button for logged-out users */
            <Link
              href="/sign-in"
              className="flex items-center gap-2 px-4 py-2 bg-[#FFD700] text-[#1A1D2E] font-medium rounded-lg hover:bg-[#FFC700] transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm">登入</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
