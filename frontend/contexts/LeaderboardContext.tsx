/**
 * LeaderboardContext 排行榜上下文
 *
 * 管理排行榜資料、搜尋、篩選
 * R1: 使用 Mock 資料
 * R2: 整合真實 API
 */

'use client'

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import {
  LeaderboardEntry,
  LeaderboardType,
  LeaderboardTimeRange,
  LeaderboardSortBy,
  UserRankInfo,
} from '@/types/leaderboard'
import {
  getLeaderboard,
  getUserRank,
  searchLeaderboard,
} from '@/lib/mock/leaderboard'
import { useAuth } from './AuthContext'

interface LeaderboardContextType {
  // 資料
  entries: LeaderboardEntry[]
  userRank: UserRankInfo | null
  topThree: LeaderboardEntry[]

  // 篩選狀態
  type: LeaderboardType
  timeRange: LeaderboardTimeRange
  sortBy: LeaderboardSortBy
  searchQuery: string

  // 載入狀態
  isLoading: boolean

  // 方法
  loadLeaderboard: () => Promise<void>
  setType: (type: LeaderboardType) => void
  setTimeRange: (range: LeaderboardTimeRange) => void
  setSortBy: (sortBy: LeaderboardSortBy) => void
  setSearchQuery: (query: string) => void
  refresh: () => Promise<void>
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined)

export function LeaderboardProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  // 資料狀態
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState<UserRankInfo | null>(null)
  const [topThree, setTopThree] = useState<LeaderboardEntry[]>([])

  // 篩選狀態
  const [type, setType] = useState<LeaderboardType>(LeaderboardType.GLOBAL)
  const [timeRange, setTimeRange] = useState<LeaderboardTimeRange>(
    LeaderboardTimeRange.ALL_TIME
  )
  const [sortBy, setSortBy] = useState<LeaderboardSortBy>(LeaderboardSortBy.EXP)
  const [searchQuery, setSearchQuery] = useState('')

  // 載入狀態
  const [isLoading, setIsLoading] = useState(false)

  /**
   * 載入排行榜資料
   */
  const loadLeaderboard = useCallback(async () => {
    setIsLoading(true)
    try {
      // R1: 使用 Mock 資料
      await new Promise(resolve => setTimeout(resolve, 300))

      let result: LeaderboardEntry[]

      // 如果有搜尋條件
      if (searchQuery.trim()) {
        result = searchLeaderboard(searchQuery, type)
      } else {
        const response = getLeaderboard(type, timeRange, sortBy)
        result = response.entries
      }

      setEntries(result)
      setTopThree(result.slice(0, 3))

      // 載入用戶排名
      if (user) {
        const rank = getUserRank(user.id)
        setUserRank(rank || null)
      }

      // R2 TODO: 從 API 載入
      // const params = new URLSearchParams({
      //   type,
      //   timeRange,
      //   sortBy,
      //   search: searchQuery,
      // })
      // const response = await fetch(`/api/leaderboard?${params}`)
      // const data = await response.json()
      // setEntries(data.entries)
      // setTopThree(data.topThree)
      // setUserRank(data.userRank)
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setIsLoading(false)
    }
  }, [type, timeRange, sortBy, searchQuery, user])

  /**
   * 重新載入資料
   */
  const refresh = useCallback(async () => {
    await loadLeaderboard()
  }, [loadLeaderboard])

  // 當篩選條件改變時重新載入
  useEffect(() => {
    loadLeaderboard()
  }, [loadLeaderboard])

  const value: LeaderboardContextType = {
    entries,
    userRank,
    topThree,
    type,
    timeRange,
    sortBy,
    searchQuery,
    isLoading,
    loadLeaderboard,
    setType,
    setTimeRange,
    setSortBy,
    setSearchQuery,
    refresh,
  }

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  )
}

/**
 * useLeaderboard Hook
 * 用於在元件中存取排行榜資料
 */
export function useLeaderboard() {
  const context = useContext(LeaderboardContext)
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within LeaderboardProvider')
  }
  return context
}
