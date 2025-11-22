/**
 * 排行榜相關型別定義
 *
 * 定義排行榜、排名、統計等相關型別
 */

import { Occupation } from './user'

/**
 * 排行榜類型
 */
export enum LeaderboardType {
  GLOBAL = 'GLOBAL',           // 全球排行
  JOURNEY = 'JOURNEY',         // 單一課程排行
  WEEKLY = 'WEEKLY',           // 週排行
  MONTHLY = 'MONTHLY',         // 月排行
  ALL_TIME = 'ALL_TIME',       // 歷史總排行
}

/**
 * 排行榜時間範圍
 */
export enum LeaderboardTimeRange {
  THIS_WEEK = 'THIS_WEEK',
  THIS_MONTH = 'THIS_MONTH',
  ALL_TIME = 'ALL_TIME',
}

/**
 * 排行榜排序方式
 */
export enum LeaderboardSortBy {
  EXP = 'EXP',                 // 經驗值
  LEVEL = 'LEVEL',             // 等級
  LESSONS_COMPLETED = 'LESSONS_COMPLETED',  // 完成單元數
  GYMS_PASSED = 'GYMS_PASSED', // 通過道館數
}

/**
 * 排行榜條目
 */
export interface LeaderboardEntry {
  rank: number                 // 排名
  userId: number
  username: string
  nickname?: string
  pictureUrl: string
  occupation: Occupation
  level: number
  exp: number

  // 統計數據
  lessonsCompleted: number     // 完成單元數
  gymsPassed: number          // 通過道館數
  badges: number              // 獲得徽章數

  // 時間範圍內的數據 (用於週/月排行)
  expGained?: number          // 獲得經驗值
  levelsGained?: number       // 升級數

  // 徽章標記
  isCurrentUser?: boolean     // 是否為當前用戶
  isPremium?: boolean         // 是否為付費會員
}

/**
 * 排行榜回應
 */
export interface LeaderboardResponse {
  type: LeaderboardType
  timeRange: LeaderboardTimeRange
  sortBy: LeaderboardSortBy
  entries: LeaderboardEntry[]
  totalEntries: number
  currentUserEntry?: LeaderboardEntry  // 當前用戶的排名 (如果不在前列)
  updatedAt: number                    // 更新時間戳
}

/**
 * 排行榜查詢參數
 */
export interface LeaderboardQuery {
  type?: LeaderboardType
  timeRange?: LeaderboardTimeRange
  sortBy?: LeaderboardSortBy
  journeyId?: number          // 課程 ID (用於課程排行)
  limit?: number              // 返回數量 (預設 100)
  offset?: number             // 分頁偏移
}

/**
 * 用戶排名資訊
 */
export interface UserRankInfo {
  userId: number
  globalRank: number          // 全球排名
  weeklyRank?: number         // 週排名
  monthlyRank?: number        // 月排名
  journeyRanks?: JourneyRank[] // 各課程排名
  percentile: number          // 百分位數 (0-100, 90 表示前 10%)
}

/**
 * 課程排名
 */
export interface JourneyRank {
  journeyId: number
  journeyName: string
  rank: number
  totalParticipants: number
}

/**
 * 排行榜統計資訊
 */
export interface LeaderboardStats {
  totalUsers: number
  averageLevel: number
  averageExp: number
  topLevel: number
  topExp: number
  activeUsersThisWeek: number
  activeUsersThisMonth: number
}

/**
 * 排名變化
 */
export interface RankChange {
  userId: number
  previousRank: number
  currentRank: number
  change: number              // 正數表示上升，負數表示下降
  type: LeaderboardTimeRange
}

/**
 * 獲取排名變化描述
 */
export function getRankChangeText(change: number): string {
  if (change > 0) return `↑ ${change}`
  if (change < 0) return `↓ ${Math.abs(change)}`
  return '→ 0'
}

/**
 * 獲取排名獎章顏色
 */
export function getRankMedalColor(rank: number): string | null {
  switch (rank) {
    case 1: return 'gold'
    case 2: return 'silver'
    case 3: return 'bronze'
    default: return null
  }
}

/**
 * 判斷是否為前三名
 */
export function isTopThree(rank: number): boolean {
  return rank >= 1 && rank <= 3
}

/**
 * 排行榜類型中文名稱
 */
export const LEADERBOARD_TYPE_NAMES: Record<LeaderboardType, string> = {
  [LeaderboardType.GLOBAL]: '全球排行',
  [LeaderboardType.JOURNEY]: '課程排行',
  [LeaderboardType.WEEKLY]: '週排行',
  [LeaderboardType.MONTHLY]: '月排行',
  [LeaderboardType.ALL_TIME]: '歷史總排行',
}

/**
 * 時間範圍中文名稱
 */
export const TIME_RANGE_NAMES: Record<LeaderboardTimeRange, string> = {
  [LeaderboardTimeRange.THIS_WEEK]: '本週',
  [LeaderboardTimeRange.THIS_MONTH]: '本月',
  [LeaderboardTimeRange.ALL_TIME]: '歷史',
}

/**
 * 排序方式中文名稱
 */
export const SORT_BY_NAMES: Record<LeaderboardSortBy, string> = {
  [LeaderboardSortBy.EXP]: '經驗值',
  [LeaderboardSortBy.LEVEL]: '等級',
  [LeaderboardSortBy.LESSONS_COMPLETED]: '完成單元',
  [LeaderboardSortBy.GYMS_PASSED]: '通過道館',
}
