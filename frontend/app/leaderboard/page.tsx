/**
 * 排行榜頁面
 *
 * 顯示全球/週/月排行榜
 */

'use client'

import { useEffect } from 'react'
import { MainLayout, Container, Section, PageHeader } from '@/components/layout'
import {
  LeaderboardFilter,
  TopRankers,
  LeaderboardTable,
  RankCard,
} from '@/components/leaderboard'
import { Card, Spinner } from '@/components/ui'
import { useLeaderboard, useAuth } from '@/contexts'
import { Trophy } from 'lucide-react'

export default function LeaderboardPage() {
  const { user } = useAuth()
  const {
    entries,
    topThree,
    userRank,
    type,
    timeRange,
    sortBy,
    isLoading,
    loadLeaderboard,
    setType,
    setTimeRange,
    setSortBy,
  } = useLeaderboard()

  useEffect(() => {
    loadLeaderboard()
  }, [type, timeRange, sortBy])

  return (
    <MainLayout>
      <Section className="py-12">
        <Container>
          <PageHeader
            title="排行榜"
            subtitle="與全球學員一較高下，展現你的實力"
          />

          {/* 篩選器 */}
          <Card className="p-6 mb-8">
            <LeaderboardFilter
              type={type}
              timeRange={timeRange}
              sortBy={sortBy}
              onTypeChange={setType}
              onTimeRangeChange={setTimeRange}
              onSortByChange={setSortBy}
            />
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* 前三名 */}
              {topThree.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-center">
                    🏆 榮譽榜 🏆
                  </h2>
                  <TopRankers topThree={topThree} />
                </div>
              )}

              {/* 用戶排名（如果已登入且不在前三名） */}
              {user && userRank && userRank.globalRank > 3 && (
                <Card className="p-6 mb-8 bg-primary-50 border-primary-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">你的排名</div>
                    <div className="text-3xl font-bold text-primary-600 mb-2">
                      #{userRank.globalRank}
                    </div>
                    <div className="text-sm text-gray-600">
                      前 {userRank.percentile}% 的學員
                    </div>
                  </div>
                </Card>
              )}

              {/* 排行榜表格 */}
              <Card className="overflow-hidden">
                <LeaderboardTable
                  entries={entries}
                  showStats={true}
                  highlightCurrentUser={true}
                />
              </Card>
            </>
          )}
        </Container>
      </Section>
    </MainLayout>
  )
}
