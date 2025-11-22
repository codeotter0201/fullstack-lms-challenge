/**
 * TopRankers 前三名展示元件
 *
 * 用於顯示排行榜前三名，特殊的領獎台樣式
 */

import { cn } from '@/lib/utils'
import { Avatar, Badge } from '@/components/ui'
import { LeaderboardEntry } from '@/types/leaderboard'
import { Trophy, Crown, Award } from 'lucide-react'

interface TopRankersProps {
  topThree: LeaderboardEntry[]
  className?: string
}

const podiumHeights = {
  1: 'h-32',
  2: 'h-24',
  3: 'h-20',
}

const podiumColors = {
  1: 'from-yellow-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-orange-400 to-orange-600',
}

const medalIcons = {
  1: Crown,
  2: Trophy,
  3: Award,
}

export default function TopRankers({ topThree, className }: TopRankersProps) {
  // 確保有三個位置，即使沒有足夠的資料
  const rankers = [
    topThree.find(e => e.rank === 2),
    topThree.find(e => e.rank === 1),
    topThree.find(e => e.rank === 3),
  ]

  return (
    <div className={cn('w-full', className)}>
      {/* 前三名卡片 - 桌面版領獎台 */}
      <div className="hidden md:block">
        <div className="flex items-end justify-center gap-6 mb-8">
          {rankers.map((ranker, index) => {
            if (!ranker) return <div key={index} className="w-48" />

            const actualRank = ranker.rank as 1 | 2 | 3
            const MedalIcon = medalIcons[actualRank]

            return (
              <div key={ranker.userId} className="flex flex-col items-center">
                {/* 用戶頭像和資訊 */}
                <div className="mb-4 text-center">
                  <div className="relative inline-block mb-3">
                    <Avatar
                      src={ranker.pictureUrl}
                      alt={ranker.username}
                      size="2xl"
                      className="ring-4 ring-white shadow-xl"
                    />
                    {/* 獎牌標記 */}
                    <div className={cn(
                      'absolute -top-2 -right-2',
                      'w-12 h-12 rounded-full',
                      'flex items-center justify-center',
                      'shadow-lg',
                      `bg-gradient-to-br ${podiumColors[actualRank]}`
                    )}>
                      <MedalIcon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {ranker.nickname || ranker.username}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{ranker.occupation}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="primary">Lv.{ranker.level}</Badge>
                    {ranker.isPremium && (
                      <Badge variant="warning" size="sm">Premium</Badge>
                    )}
                  </div>
                </div>

                {/* 領獎台 */}
                <div className={cn(
                  'w-48 rounded-t-2xl',
                  'flex flex-col items-center justify-end',
                  'transition-all duration-300 hover:scale-105',
                  podiumHeights[actualRank],
                  `bg-gradient-to-br ${podiumColors[actualRank]}`
                )}>
                  <div className="p-4 text-center text-white">
                    <div className="text-3xl font-bold mb-1">#{actualRank}</div>
                    <div className="text-sm opacity-90">
                      {ranker.exp.toLocaleString()} EXP
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 行動版卡片列表 */}
      <div className="md:hidden space-y-4">
        {topThree.map((ranker) => {
          const actualRank = ranker.rank as 1 | 2 | 3
          const MedalIcon = medalIcons[actualRank]

          return (
            <div
              key={ranker.userId}
              className={cn(
                'p-4 rounded-xl border-2',
                'bg-gradient-to-r',
                actualRank === 1 && 'from-yellow-50 to-yellow-100 border-yellow-400',
                actualRank === 2 && 'from-gray-50 to-gray-100 border-gray-400',
                actualRank === 3 && 'from-orange-50 to-orange-100 border-orange-400'
              )}
            >
              <div className="flex items-center gap-3">
                {/* 排名標記 */}
                <div className={cn(
                  'flex-shrink-0 w-14 h-14 rounded-full',
                  'flex items-center justify-center',
                  'shadow-lg',
                  `bg-gradient-to-br ${podiumColors[actualRank]}`
                )}>
                  <MedalIcon className="w-7 h-7 text-white" />
                </div>

                {/* 頭像 */}
                <Avatar
                  src={ranker.pictureUrl}
                  alt={ranker.username}
                  size="lg"
                  className="ring-2 ring-white"
                />

                {/* 用戶資訊 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">
                    {ranker.nickname || ranker.username}
                  </h4>
                  <p className="text-sm text-gray-600">{ranker.occupation}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="primary" size="sm">Lv.{ranker.level}</Badge>
                    <span className="text-xs text-gray-600">
                      {ranker.exp.toLocaleString()} EXP
                    </span>
                  </div>
                </div>
              </div>

              {/* 統計 */}
              <div className="flex items-center justify-around mt-3 pt-3 border-t border-gray-300">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{ranker.lessonsCompleted}</p>
                  <p className="text-xs text-gray-600">單元</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{ranker.gymsPassed}</p>
                  <p className="text-xs text-gray-600">道館</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{ranker.badges}</p>
                  <p className="text-xs text-gray-600">徽章</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
