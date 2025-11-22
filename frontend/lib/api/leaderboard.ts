/**
 * Leaderboard API
 *
 * 排行榜相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import { GetLeaderboardResponse, GetUserRankResponse } from '@/types/api'
import {
  LeaderboardType,
  LeaderboardTimeRange,
  LeaderboardSortBy,
} from '@/types/leaderboard'
import { getLeaderboard, getUserRank, searchLeaderboard } from '@/lib/mock/leaderboard'

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

  let entries

  if (search) {
    entries = searchLeaderboard(search)
  } else {
    entries = getLeaderboard(type, timeRange, sortBy)
  }

  // 限制返回數量
  entries = entries.slice(0, limit)

  return {
    success: true,
    data: {
      entries,
      total: entries.length,
      type,
      timeRange,
      sortBy,
    },
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

  const userRank = getUserRank(userId, type)

  if (!userRank) {
    return {
      success: false,
      error: {
        code: 'USER_RANK_NOT_FOUND',
        message: '找不到用戶排名資訊',
      },
    }
  }

  return {
    success: true,
    data: { userRank },
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

  const entries = getLeaderboard(type, LeaderboardTimeRange.ALL_TIME, LeaderboardSortBy.EXP)
  const topEntries = entries.slice(0, count)

  return {
    success: true,
    data: {
      entries: topEntries,
      total: topEntries.length,
      type,
      timeRange: LeaderboardTimeRange.ALL_TIME,
      sortBy: LeaderboardSortBy.EXP,
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetLeaderboardResponse>(`/leaderboard/top/${count}`, {
  //   type,
  // })
}
