/**
 * VerticalSidebar 左側垂直側邊欄
 *
 * 符合目標網站設計：
 * - 寬度：230px
 * - 背景：#171923（與 body 相同）
 * - 分組導航（主導航、排行榜、旅程相關）
 * - 金色高亮選中項目
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  House,              // 首頁（替換 Home）
  LayoutDashboard,    // 課程（替換 BookOpen）
  UserRoundPen,       // 個人檔案（替換 User）
  Trophy,             // 排行榜
  Gift,               // 獎勵任務（替換 Award）
  SquareChartGantt,   // 挑戰歷程（替換 TrendingUp）
  Album,              // 所有單元（替換 List）
  Map,                // 挑戰地圖
  BookText,           // SOP 寶典
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useJourney } from '@/contexts/JourneyContext'

export default function VerticalSidebar() {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const { selectedJourney, journeys } = useJourney()

  // 使用 selectedJourney 或預設課程的 ID
  const currentJourneyId = selectedJourney?.id || journeys[0]?.id || 1

  // 導航項目分組 - 根據登入狀態動態顯示
  const navGroups = [
    {
      title: '核心功能',
      items: [
        {
          label: '首頁',
          href: '/',
          icon: House,
        },
        {
          label: '課程',
          href: '/courses',
          icon: LayoutDashboard,
        },
        // 只有登入才顯示個人檔案
        ...(isAuthenticated ? [{
          label: '個人檔案',
          href: '/users/me/profile',
          icon: UserRoundPen,
        }] : []),
      ],
    },
    {
      title: '社群功能',
      items: [
        {
          label: '排行榜',
          href: '/leaderboard',
          icon: Trophy,
        },
        // 只有登入才顯示獎勵任務和挑戰歷程
        ...(isAuthenticated ? [
          {
            label: '獎勵任務',
            href: `/journeys/${currentJourneyId}/missions`,
            icon: Gift,
          },
          {
            label: '挑戰歷程',
            href: '/users/me/portfolio',
            icon: SquareChartGantt,
          },
        ] : []),
      ],
    },
    {
      title: '課程相關',
      items: [
        {
          label: '所有單元',
          href: `/journeys/${currentJourneyId}`,
          icon: Album,
        },
        {
          label: '挑戰地圖',
          href: `/journeys/${currentJourneyId}/roadmap`,
          icon: Map,
        },
        {
          label: 'SOP 寶典',
          href: `/journeys/${currentJourneyId}/sop`,
          icon: BookText,
        },
      ],
    },
  ]

  return (
    <aside className="w-[235px] h-full bg-[#1A1D2E] flex flex-col p-4">
      {/* Logo 區域 */}
      <div className="h-16 flex items-center mb-6">
        <Link href="/">
          <Image
            src="/world/logo.png"
            alt="水球軟體學院"
            width={235}
            height={64}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* 主導航區域 - 分組顯示 */}
      <nav className="flex-1 space-y-0 overflow-y-auto scrollbar-thin">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* 分組項目 */}
            <div className="space-y-1 py-3">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-2.5 py-3 rounded-[20px]',
                      'text-sm transition-colors duration-200',
                      isActive
                        ? 'bg-[#FFD700] text-[rgb(23,25,35)] font-medium'
                        : 'text-[rgb(244,244,245)] hover:bg-[#FFD700] hover:text-[rgb(23,25,35)]'
                    )}
                  >
                    <Icon className="w-6 h-6 flex-shrink-0" strokeWidth={2} />
                    {item.label}
                  </Link>
                )
              })}
            </div>

            {/* 分隔線 - 不在最後一組顯示 */}
            {groupIndex < navGroups.length - 1 && (
              <hr className="border-t border-gray-700/30 my-0" />
            )}
          </div>
        ))}
      </nav>

    </aside>
  )
}
