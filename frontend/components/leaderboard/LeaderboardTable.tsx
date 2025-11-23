/**
 * LeaderboardTable 排行榜列表元件
 *
 * 簡潔的列表樣式，匹配目標網站設計
 */

import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import { LeaderboardEntry } from '@/types/leaderboard'

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  className?: string
}

export default function LeaderboardTable({
  entries,
  className,
}: LeaderboardTableProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {entries.map((entry, index) => (
        <div
          key={entry.userId}
          className={cn(
            'flex items-center justify-between px-6 py-4',
            'border-b border-gray-700/50',
            'hover:bg-gray-700/30 transition-colors duration-150',
            index === 0 && 'border-t border-gray-700/50'
          )}
        >
          {/* 左側：排名 + 用戶資訊 */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* 排名數字 */}
            <div className="flex-shrink-0 w-8 text-center">
              <span className="text-lg font-bold text-white">
                {entry.rank}
              </span>
            </div>

            {/* 頭像 */}
            <Avatar
              src={entry.pictureUrl}
              alt={entry.username}
              size="md"
              className="flex-shrink-0"
            />

            {/* 用戶名稱和職稱 */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">
                {entry.nickname || entry.username}
              </div>
              <div className="text-xs text-gray-400 truncate">
                {entry.occupation}
              </div>
            </div>
          </div>

          {/* 右側：等級和經驗值 */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* 等級標籤 */}
            <div className="px-3 py-1 rounded-md bg-white text-gray-900 font-medium text-sm">
              Lv.{entry.level}
            </div>

            {/* 經驗值 */}
            <div className="text-right min-w-[80px]">
              <div className="text-base font-bold text-white">
                {entry.exp.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
