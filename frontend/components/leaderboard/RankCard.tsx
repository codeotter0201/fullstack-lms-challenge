/**
 * RankCard 排名卡片元件
 *
 * 用於顯示單一用戶的排名資訊
 */

import { cn } from '@/lib/utils'
import { Card, Badge, Avatar } from '@/components/ui'
import { LeaderboardEntry } from '@/types/leaderboard'
import { Trophy, TrendingUp, TrendingDown, Minus, Award } from 'lucide-react'

interface RankCardProps {
  entry: LeaderboardEntry
  showRankChange?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

const medalColors = {
  1: 'from-yellow-400 to-yellow-600',
  2: 'from-gray-300 to-gray-500',
  3: 'from-orange-400 to-orange-600',
}

function getRankChangeIcon(change?: number) {
  if (!change) return <Minus className="w-4 h-4 text-gray-400" />
  if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
  return <TrendingDown className="w-4 h-4 text-red-500" />
}

function getRankChangeText(change?: number) {
  if (!change) return '持平'
  if (change > 0) return `↑ ${change}`
  return `↓ ${Math.abs(change)}`
}

export default function RankCard({
  entry,
  showRankChange = false,
  variant = 'default',
  className,
}: RankCardProps) {
  const isTopThree = entry.rank <= 3

  if (variant === 'compact') {
    return (
      <Card
        padding="md"
        className={cn(
          'flex items-center gap-3',
          isTopThree && 'border-2 border-yellow-400',
          className
        )}
      >
        {/* 排名 */}
        <div className={cn(
          'flex-shrink-0 w-12 h-12 rounded-full',
          'flex items-center justify-center font-bold text-lg',
          isTopThree
            ? `bg-gradient-to-br ${medalColors[entry.rank as keyof typeof medalColors]} text-white`
            : 'bg-gray-100 text-gray-700'
        )}>
          {isTopThree ? <Trophy className="w-6 h-6" /> : `#${entry.rank}`}
        </div>

        {/* 用戶資訊 */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">
            {entry.nickname || entry.username}
          </p>
          <p className="text-sm text-gray-500">
            Lv.{entry.level} • {entry.exp.toLocaleString()} EXP
          </p>
        </div>

        {/* Premium 標記 */}
        {entry.isPremium && (
          <Badge variant="warning" size="sm">
            <Award className="w-3 h-3" />
          </Badge>
        )}
      </Card>
    )
  }

  if (variant === 'detailed') {
    return (
      <Card
        padding="lg"
        className={cn(
          isTopThree && 'border-2 border-yellow-400 shadow-lg',
          className
        )}
      >
        {/* 排名標記 */}
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-16 h-16 rounded-2xl',
            'flex items-center justify-center',
            isTopThree
              ? `bg-gradient-to-br ${medalColors[entry.rank as keyof typeof medalColors]}`
              : 'bg-gray-100'
          )}>
            {isTopThree ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <span className="text-2xl font-bold text-gray-700">#{entry.rank}</span>
            )}
          </div>

          {showRankChange && entry.expGained !== undefined && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-sm">
                {getRankChangeIcon(entry.levelsGained)}
                <span className={cn(
                  'font-medium',
                  !entry.levelsGained ? 'text-gray-500' :
                  entry.levelsGained > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {getRankChangeText(entry.levelsGained)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                +{entry.expGained.toLocaleString()} EXP
              </p>
            </div>
          )}
        </div>

        {/* 用戶資訊 */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar
            src={entry.pictureUrl}
            alt={entry.username}
            size="lg"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg text-gray-900">
                {entry.nickname || entry.username}
              </h3>
              {entry.isPremium && (
                <Badge variant="warning" size="sm">Premium</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{entry.occupation}</p>
          </div>
        </div>

        {/* 等級和經驗值 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-primary-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">等級</p>
            <p className="text-2xl font-bold text-primary-600">Lv.{entry.level}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">經驗值</p>
            <p className="text-xl font-bold text-green-600">
              {entry.exp.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 統計資訊 */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{entry.lessonsCompleted}</p>
            <p className="text-xs text-gray-600">完成單元</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{entry.gymsPassed}</p>
            <p className="text-xs text-gray-600">通過道館</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{entry.badges}</p>
            <p className="text-xs text-gray-600">獲得徽章</p>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      padding="md"
      className={cn(
        isTopThree && 'border-2 border-yellow-400',
        className
      )}
    >
      <div className="flex items-center gap-4">
        {/* 排名 */}
        <div className={cn(
          'flex-shrink-0 w-14 h-14 rounded-xl',
          'flex items-center justify-center',
          isTopThree
            ? `bg-gradient-to-br ${medalColors[entry.rank as keyof typeof medalColors]}`
            : 'bg-gray-100'
        )}>
          {isTopThree ? (
            <Trophy className="w-7 h-7 text-white" />
          ) : (
            <span className="text-xl font-bold text-gray-700">#{entry.rank}</span>
          )}
        </div>

        {/* 用戶資訊 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Avatar
              src={entry.pictureUrl}
              alt={entry.username}
              size="sm"
            />
            <h4 className="font-medium text-gray-900 truncate">
              {entry.nickname || entry.username}
            </h4>
            {entry.isPremium && (
              <Award className="w-4 h-4 text-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>Lv.{entry.level}</span>
            <span>•</span>
            <span>{entry.exp.toLocaleString()} EXP</span>
          </div>
        </div>

        {/* 排名變化 */}
        {showRankChange && entry.levelsGained !== undefined && (
          <div className="text-right">
            <div className="flex items-center gap-1">
              {getRankChangeIcon(entry.levelsGained)}
              <span className={cn(
                'text-sm font-medium',
                !entry.levelsGained ? 'text-gray-500' :
                entry.levelsGained > 0 ? 'text-green-600' : 'text-red-600'
              )}>
                {getRankChangeText(entry.levelsGained)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
