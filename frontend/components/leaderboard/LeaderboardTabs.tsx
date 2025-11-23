/**
 * LeaderboardTabs 排行榜分頁元件
 *
 * 用於切換「學習排行榜」和「本週成長榜」
 */

import { cn } from '@/lib/utils'

export type LeaderboardTab = 'learning' | 'weekly'

interface LeaderboardTabsProps {
  activeTab: LeaderboardTab
  onTabChange: (tab: LeaderboardTab) => void
  className?: string
}

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
  className,
}: LeaderboardTabsProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      <button
        onClick={() => onTabChange('learning')}
        className={cn(
          'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
          'text-sm md:text-base',
          activeTab === 'learning'
            ? 'bg-yellow-400 text-gray-900 shadow-md'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        )}
      >
        學習排行榜
      </button>
      <button
        onClick={() => onTabChange('weekly')}
        className={cn(
          'px-6 py-2.5 rounded-lg font-medium transition-all duration-200',
          'text-sm md:text-base',
          activeTab === 'weekly'
            ? 'bg-yellow-400 text-gray-900 shadow-md'
            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
        )}
      >
        本週成長榜
      </button>
    </div>
  )
}
