/**
 * LeaderboardFilter 排行榜篩選器元件
 *
 * 用於切換排行榜類型、時間範圍、排序方式
 */

'use client'

import { Tabs, Select } from '@/components/ui'
import { TabItem, SelectOption } from '@/types/ui'
import {
  LeaderboardType,
  LeaderboardTimeRange,
  LeaderboardSortBy,
  LEADERBOARD_TYPE_NAMES,
  TIME_RANGE_NAMES,
  SORT_BY_NAMES,
} from '@/types/leaderboard'
import { Trophy, TrendingUp, Calendar } from 'lucide-react'

interface LeaderboardFilterProps {
  type: LeaderboardType
  timeRange: LeaderboardTimeRange
  sortBy: LeaderboardSortBy
  onTypeChange: (type: LeaderboardType) => void
  onTimeRangeChange: (range: LeaderboardTimeRange) => void
  onSortByChange: (sortBy: LeaderboardSortBy) => void
  className?: string
}

export default function LeaderboardFilter({
  type,
  timeRange,
  sortBy,
  onTypeChange,
  onTimeRangeChange,
  onSortByChange,
  className,
}: LeaderboardFilterProps) {
  // 排行榜類型標籤
  const typeOptions: TabItem[] = [
    {
      key: LeaderboardType.GLOBAL,
      label: LEADERBOARD_TYPE_NAMES[LeaderboardType.GLOBAL],
      icon: <Trophy className="w-4 h-4" />,
      content: <></>,
    },
    {
      key: LeaderboardType.WEEKLY,
      label: LEADERBOARD_TYPE_NAMES[LeaderboardType.WEEKLY],
      icon: <TrendingUp className="w-4 h-4" />,
      content: <></>,
    },
    {
      key: LeaderboardType.MONTHLY,
      label: LEADERBOARD_TYPE_NAMES[LeaderboardType.MONTHLY],
      icon: <Calendar className="w-4 h-4" />,
      content: <></>,
    },
  ]

  // 時間範圍選項
  const timeRangeOptions: SelectOption[] = [
    {
      value: LeaderboardTimeRange.THIS_WEEK,
      label: TIME_RANGE_NAMES[LeaderboardTimeRange.THIS_WEEK],
    },
    {
      value: LeaderboardTimeRange.THIS_MONTH,
      label: TIME_RANGE_NAMES[LeaderboardTimeRange.THIS_MONTH],
    },
    {
      value: LeaderboardTimeRange.ALL_TIME,
      label: TIME_RANGE_NAMES[LeaderboardTimeRange.ALL_TIME],
    },
  ]

  // 排序方式選項
  const sortByOptions: SelectOption[] = [
    {
      value: LeaderboardSortBy.EXP,
      label: SORT_BY_NAMES[LeaderboardSortBy.EXP],
    },
    {
      value: LeaderboardSortBy.LEVEL,
      label: SORT_BY_NAMES[LeaderboardSortBy.LEVEL],
    },
    {
      value: LeaderboardSortBy.LESSONS_COMPLETED,
      label: SORT_BY_NAMES[LeaderboardSortBy.LESSONS_COMPLETED],
    },
    {
      value: LeaderboardSortBy.GYMS_PASSED,
      label: SORT_BY_NAMES[LeaderboardSortBy.GYMS_PASSED],
    },
  ]

  return (
    <div className={className}>
      {/* 排行榜類型切換 */}
      <div className="mb-4">
        <Tabs
          items={typeOptions}
          activeKey={type}
          onChange={(key) => onTypeChange(key as LeaderboardType)}
          type="line"
          centered
        />
      </div>

      {/* 篩選器 */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* 時間範圍 */}
        <div className="flex-1">
          <Select
            options={timeRangeOptions}
            value={timeRange}
            onChange={(value) => onTimeRangeChange(value as LeaderboardTimeRange)}
            placeholder="選擇時間範圍"
          />
        </div>

        {/* 排序方式 */}
        <div className="flex-1">
          <Select
            options={sortByOptions}
            value={sortBy}
            onChange={(value) => onSortByChange(value as LeaderboardSortBy)}
            placeholder="選擇排序方式"
          />
        </div>
      </div>
    </div>
  )
}
