/**
 * Leaderboard API
 *
 * 排行榜相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import { GetLeaderboardApiResponse as GetLeaderboardResponse, GetUserRankResponse } from '@/types/api'
import {
  LeaderboardType,
  LeaderboardTimeRange,
  LeaderboardSortBy,
} from '@/types/leaderboard'
import { getLeaderboard as getLeaderboardMock, getUserRank as getUserRankMock, searchLeaderboard as searchLeaderboardMock } from '@/lib/mock/leaderboard'

/**
 * 獲取排行榜
 */
export async function fetchLeaderboard(
  type: LeaderboardType = LeaderboardType.GLOBAL,
  timeRange: LeaderboardTimeRange = LeaderboardTimeRange.ALL_TIME,
  sortBy: LeaderboardSortBy = LeaderboardSortBy.EXP,
  search?: string,
  limit: number = 50
): Promise<GetLeaderboardResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  let entriesResult

  if (search) {
    entriesResult = searchLeaderboardMock(search)
  } else {
    entriesResult = getLeaderboardMock(type, timeRange, sortBy)
  }

  // Extract entries array from the response
  const entries = Array.isArray(entriesResult) ? entriesResult : entriesResult.entries

  // 限制返回數量
  const limitedEntries = entries.slice(0, limit)

  return {
    success: true,
    data: {
      entries: limitedEntries,
      totalEntries: limitedEntries.length,
      type,
      timeRange,
      sortBy,
      updatedAt: Date.now(),
    },
    timestamp: Date.now(),
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetLeaderboardResponse>('/leaderboard', {
  //   type,
  //   timeRange,
  //   sortBy,
  //   search,
  //   limit,
  // })
}

/**
 * 獲取用戶排名資訊
 */
export async function fetchUserRank(
  userId: string,
  type: LeaderboardType = LeaderboardType.GLOBAL
): Promise<GetUserRankResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  const userRank = getUserRankMock(parseInt(userId))

  if (!userRank) {
    return {
      success: false,
      error: {
        code: 'USER_RANK_NOT_FOUND',
        message: '找不到用戶排名資訊',
        statusCode: 404,
      },
      timestamp: Date.now(),
    }
  }

  return {
    success: true,
    data: userRank,
    timestamp: Date.now(),
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetUserRankResponse>(`/leaderboard/users/${userId}/rank`, {
  //   type,
  // })
}

/**
 * 獲取前 N 名用戶
 */
export async function fetchTopRankers(
  count: number = 3,
  type: LeaderboardType = LeaderboardType.GLOBAL
): Promise<GetLeaderboardResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  const result = getLeaderboardMock(type, LeaderboardTimeRange.ALL_TIME, LeaderboardSortBy.EXP)
  const entries = Array.isArray(result) ? result : result.entries
  const topEntries = entries.slice(0, count)

  return {
    success: true,
    data: {
      entries: topEntries,
      totalEntries: topEntries.length,
      type,
      timeRange: LeaderboardTimeRange.ALL_TIME,
      sortBy: LeaderboardSortBy.EXP,
      updatedAt: Date.now(),
    },
    timestamp: Date.now(),
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetLeaderboardResponse>(`/leaderboard/top/${count}`, {
  //   type,
  // })
}

// Export aliases for backward compatibility with existing code
export { fetchLeaderboard as getLeaderboard }
export { fetchUserRank as getUserRank }
export { searchLeaderboardMock as searchLeaderboard }
