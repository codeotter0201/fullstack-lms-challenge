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
import { useAuth, useLeaderboard } from '@/contexts'
import { LeaderboardEntry } from '@/types/leaderboard'
import { LeaderboardType, LeaderboardTimeRange, LeaderboardSortBy } from '@/types/leaderboard'

type LeaderboardTab = 'learning' | 'weekly'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const { entries, userRank, setType, setTimeRange, setSortBy, isLoading } = useLeaderboard()
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('learning')

  useEffect(() => {
    // 根據 Tab 決定載入哪種排行榜
    const type = activeTab === 'weekly'
      ? LeaderboardType.WEEKLY
      : LeaderboardType.GLOBAL

    const timeRange = activeTab === 'weekly'
      ? LeaderboardTimeRange.THIS_WEEK
      : LeaderboardTimeRange.ALL_TIME

    setType(type)
    setTimeRange(timeRange)
    setSortBy(LeaderboardSortBy.EXP)
  }, [activeTab, setType, setTimeRange, setSortBy])

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
              <LeaderboardTable entries={entries || []} />

              {/* 當前用戶排名 (如果有的話) */}
              {userRank && user && (
                <div className="p-4 bg-gray-900">
                  <CurrentUserRankCard entry={{
                    rank: userRank.globalRank,
                    userId: user.id,
                    username: user.name,
                    nickname: user.nickname,
                    pictureUrl: user.pictureUrl || '',
                    occupation: user.occupation || 'backend_developer',
                    level: user.level,
                    exp: user.exp,
                    lessonsCompleted: 0,
                    gymsPassed: 0,
                    badges: 0,
                    expGained: 0,
                    isCurrentUser: true,
                  }} />
                </div>
              )}
            </div>
          )}
        </Container>
      </Section>
    </MainLayout>
  )
}
