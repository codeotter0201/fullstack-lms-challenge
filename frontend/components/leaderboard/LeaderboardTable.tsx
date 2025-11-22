/**
 * LeaderboardTable 排行榜表格元件
 *
 * 用於顯示排行榜列表，支援前三名獎牌、當前用戶高亮
 */

import { cn } from '@/lib/utils'
import { Avatar, Badge } from '@/components/ui'
import { LeaderboardEntry } from '@/types/leaderboard'
import { Trophy, TrendingUp, TrendingDown, Award, Video, Target } from 'lucide-react'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  showStats?: boolean
  highlightCurrentUser?: boolean
  className?: string
}

const medalColors = {
  1: 'text-yellow-500',
  2: 'text-gray-400',
  3: 'text-orange-600',
}

const medalBgColors = {
  1: 'bg-yellow-50',
  2: 'bg-gray-50',
  3: 'bg-orange-50',
}

function getRankDisplay(rank: number) {
  if (rank <= 3) {
    return (
      <div className={cn('flex items-center justify-center w-10 h-10 rounded-full', medalBgColors[rank as keyof typeof medalBgColors])}>
        <Trophy className={cn('w-6 h-6', medalColors[rank as keyof typeof medalColors])} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
      <span className="text-lg font-bold text-gray-700">#{rank}</span>
    </div>
  )
}

export default function LeaderboardTable({
  entries,
  showStats = true,
  highlightCurrentUser = true,
  className,
}: LeaderboardTableProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      {/* 桌面版表格 */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                排名
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                用戶
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                等級
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                經驗值
              </th>
              {showStats && (
                <>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    完成單元
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    通過道館
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.map((entry) => (
              <tr
                key={entry.userId}
                className={cn(
                  'transition-colors duration-200',
                  entry.isCurrentUser && highlightCurrentUser
                    ? 'bg-primary-50 hover:bg-primary-100'
                    : 'hover:bg-gray-50'
                )}
              >
                {/* 排名 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRankDisplay(entry.rank)}
                </td>

                {/* 用戶資訊 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={entry.pictureUrl}
                      alt={entry.username}
                      size="md"
                      badge={entry.isPremium ? <Award className="w-3 h-3" /> : undefined}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.nickname || entry.username}
                        </p>
                        {entry.isCurrentUser && (
                          <Badge variant="primary" size="sm">你</Badge>
                        )}
                        {entry.isPremium && (
                          <Badge variant="warning" size="sm">Premium</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{entry.occupation}</p>
                    </div>
                  </div>
                </td>

                {/* 等級 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm">
                      {entry.level}
                    </div>
                    <span className="text-sm text-gray-700">Lv.{entry.level}</span>
                  </div>
                </td>

                {/* 經驗值 */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-900">
                      {entry.exp.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">EXP</span>
                  </div>
                </td>

                {showStats && (
                  <>
                    {/* 完成單元 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-700">
                          {entry.lessonsCompleted}
                        </span>
                      </div>
                    </td>

                    {/* 通過道館 */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-700">
                          {entry.gymsPassed}
                        </span>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 行動版列表 */}
      <div className="md:hidden space-y-3">
        {entries.map((entry) => (
          <div
            key={entry.userId}
            className={cn(
              'p-4 rounded-lg border transition-colors duration-200',
              entry.isCurrentUser && highlightCurrentUser
                ? 'bg-primary-50 border-primary-200'
                : 'bg-white border-gray-200'
            )}
          >
            {/* 排名和用戶 */}
            <div className="flex items-center gap-3 mb-3">
              {getRankDisplay(entry.rank)}
              <Avatar
                src={entry.pictureUrl}
                alt={entry.username}
                size="md"
                badge={entry.isPremium ? <Award className="w-3 h-3" /> : undefined}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {entry.nickname || entry.username}
                  </p>
                  {entry.isCurrentUser && (
                    <Badge variant="primary" size="sm">你</Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500">{entry.occupation}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-primary-600">Lv.{entry.level}</div>
                <p className="text-xs text-gray-500">{entry.exp.toLocaleString()} EXP</p>
              </div>
            </div>

            {/* 統計資訊 */}
            {showStats && (
              <div className="flex items-center gap-4 text-sm text-gray-600 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-1">
                  <Video className="w-4 h-4 text-blue-500" />
                  <span>{entry.lessonsCompleted} 單元</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="w-4 h-4 text-orange-500" />
                  <span>{entry.gymsPassed} 道館</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  <span>{entry.badges} 徽章</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
