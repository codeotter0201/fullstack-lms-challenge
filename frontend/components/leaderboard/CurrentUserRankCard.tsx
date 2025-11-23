/**
 * CurrentUserRankCard 當前用戶排名卡片
 *
 * 顯示在排行榜底部的藍色區塊
 */

import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui'
import { LeaderboardEntry } from '@/types/leaderboard'

interface CurrentUserRankCardProps {
  entry: LeaderboardEntry
  className?: string
}

export default function CurrentUserRankCard({
  entry,
  className,
}: CurrentUserRankCardProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-6 py-4',
        'bg-blue-800 rounded-lg',
        className
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
          <div className="text-xs text-blue-200 truncate">
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
  )
}
