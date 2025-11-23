/**
 * 排行榜頁面
 *
 * 顯示學習排行榜和本週成長榜
 */

'use client'

import { useState, useEffect } from 'react'
import { MainLayout, Container, Section } from '@/components/layout'
import {
  LeaderboardTabs,
  LeaderboardTable,
  CurrentUserRankCard,
} from '@/components/leaderboard'
import { Spinner } from '@/components/ui'
import { useAuth } from '@/contexts'
import { LeaderboardEntry } from '@/types/leaderboard'
import { getLeaderboard, getUserRank } from '@/lib/mock/leaderboard'
import { LeaderboardType, LeaderboardTimeRange, LeaderboardSortBy } from '@/types/leaderboard'

type LeaderboardTab = 'learning' | 'weekly'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('learning')
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [currentUserEntry, setCurrentUserEntry] = useState<LeaderboardEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.id])

  const loadLeaderboard = async () => {
    setIsLoading(true)

    // 模擬 API 延遲
    await new Promise(resolve => setTimeout(resolve, 300))

    // 根據 Tab 決定載入哪種排行榜
    const type = activeTab === 'weekly'
      ? LeaderboardType.WEEKLY
      : LeaderboardType.GLOBAL

    const timeRange = activeTab === 'weekly'
      ? LeaderboardTimeRange.THIS_WEEK
      : LeaderboardTimeRange.ALL_TIME

    const data = getLeaderboard(
      type,
      timeRange,
      LeaderboardSortBy.EXP,
      undefined,
      30 // 顯示前 30 名
    )

    setEntries(data.entries)

    // 找到當前用戶的排名（如果已登入且不在前 30 名）
    if (user) {
      const userRank = getUserRank(user.id)
      if (userRank && userRank.globalRank > 30) {
        // 從完整列表中找到用戶條目
        const fullData = getLeaderboard(type, timeRange, LeaderboardSortBy.EXP, undefined, 1000)
        const userEntry = fullData.entries.find(e => e.userId === user.id)
        if (userEntry) {
          setCurrentUserEntry(userEntry)
        }
      } else {
        setCurrentUserEntry(null)
      }
    }

    setIsLoading(false)
  }

  return (
    <MainLayout>
      <Section className="py-8 md:py-12 bg-gray-900 min-h-screen">
        <Container className="max-w-5xl">
          {/* 頂部提示橫幅 */}
          <div className="mb-6 p-4 bg-gray-800 border border-yellow-400/30 rounded-lg">
            <p className="text-sm text-gray-300">
              <span className="text-yellow-400 font-medium">💡 提示：</span>
              將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！
              <button className="ml-2 px-3 py-1 bg-yellow-400 text-gray-900 rounded text-xs font-medium hover:bg-yellow-500 transition-colors">
                前往
              </button>
            </p>
          </div>

          {/* Tab 切換 */}
          <div className="mb-6">
            <LeaderboardTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
              {/* 排行榜列表 */}
              <LeaderboardTable entries={entries} />

              {/* 當前用戶排名 (如果不在前 30 名) */}
              {currentUserEntry && (
                <div className="p-4 bg-gray-900">
                  <CurrentUserRankCard entry={currentUserEntry} />
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </MainLayout>
  )
}
