/**
 * MainLayout 主佈局元件
 *
 * 深色主題佈局：VerticalSidebar + 主內容 + Footer
 * 符合目標網站設計：無獨立頂部 Navbar
 */

'use client'

import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useAuth, useJourney } from '@/contexts'
import VerticalSidebar from './VerticalSidebar'
import Header from './Header'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export default function MainLayout({
  children,
  className,
}: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { currentJourney, ownedJourneys } = useJourney()

  const handleChallengeMapClick = () => {
    if (currentJourney) {
      router.push(`/journeys/${currentJourney.slug}/roadmap`)
    } else {
      router.push('/challenges')
    }
  }

  const handleProfileClick = () => {
    router.push('/users/me/profile')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* 背景遮罩（行動版，當 Sidebar 開啟時） */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* 左側垂直 Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 z-[70]',
          'transition-transform duration-300 ease-in-out',
          // 手機版：預設隱藏在左側外，開啟時滑入
          // 桌面版：永遠顯示
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <VerticalSidebar />
      </div>

      {/* 主內容區域（向右偏移以容納 Sidebar，235px） */}
      <div className="flex-1 flex flex-col lg:ml-[235px]">
        {/* Top Header - Matches target website */}
        <Header onMobileMenuClick={() => setIsMobileMenuOpen(true)} />

        {/* 主要內容 */}
        <main className={cn('flex-1', className)}>
          {children}
        </main>
      </div>
    </div>
  )
}
