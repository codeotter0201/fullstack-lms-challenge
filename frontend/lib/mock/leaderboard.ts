/**
 * Mock 排行榜資料
 *
 * 提供測試用的排行榜、排名資料
 */

import {
  LeaderboardEntry,
  LeaderboardResponse,
  LeaderboardType,
  LeaderboardTimeRange,
  LeaderboardSortBy,
  UserRankInfo,
  JourneyRank,
  LeaderboardStats,
} from '@/types/leaderboard'
import { Occupation } from '@/types/user'

/**
 * 生成 Mock 排行榜條目
 */
function generateLeaderboardEntry(
  rank: number,
  userId: number,
  username: string,
  nickname: string | undefined,
  pictureUrl: string,
  occupation: Occupation,
  level: number,
  exp: number,
  lessonsCompleted: number,
  gymsPassed: number,
  badges: number,
  isCurrentUser?: boolean,
  isPremium?: boolean
): LeaderboardEntry {
  return {
    rank,
    userId,
    username,
    nickname,
    pictureUrl,
    occupation,
    level,
    exp,
    lessonsCompleted,
    gymsPassed,
    badges,
    isCurrentUser,
    isPremium,
  }
}

/**
 * Mock 全球排行榜資料
 */
export const mockGlobalLeaderboard: LeaderboardEntry[] = [
  generateLeaderboardEntry(
    1,
    101,
    'ProCoder',
    '程式高手',
    'https://lh3.googleusercontent.com/a/user-101',
    Occupation.ARCHITECT,
    36,
    65000,
    250,
    25,
    50,
    false,
    true
  ),
  generateLeaderboardEntry(
    2,
    102,
    'DevMaster',
    '開發大師',
    'https://lh3.googleusercontent.com/a/user-102',
    Occupation.TECH_LEAD,
    35,
    63500,
    245,
    24,
    48,
    false,
    true
  ),
  generateLeaderboardEntry(
    3,
    103,
    'CodeNinja',
    '程式忍者',
    'https://lh3.googleusercontent.com/a/user-103',
    Occupation.SENIOR_PROGRAMMER,
    34,
    61000,
    240,
    23,
    46,
    false,
    true
  ),
  generateLeaderboardEntry(
    4,
    3,
    '水球潘',
    '水球',
    'https://lh3.googleusercontent.com/a/teacher-avatar',
    Occupation.ARCHITECT,
    36,
    65000,
    250,
    25,
    50,
    false,
    true
  ),
  generateLeaderboardEntry(
    5,
    104,
    'TechGuru',
    '技術達人',
    'https://lh3.googleusercontent.com/a/user-104',
    Occupation.SENIOR_PROGRAMMER,
    33,
    59000,
    235,
    22,
    44,
    false,
    true
  ),
  generateLeaderboardEntry(
    6,
    2,
    'Jane Smith',
    '小美',
    'https://lh3.googleusercontent.com/a/default-user-2',
    Occupation.SENIOR_PROGRAMMER,
    28,
    42000,
    180,
    15,
    32,
    false,
    true
  ),
  generateLeaderboardEntry(
    7,
    105,
    'FastLearner',
    '快速學習者',
    'https://lh3.googleusercontent.com/a/user-105',
    Occupation.PROGRAMMER,
    25,
    35000,
    150,
    12,
    28,
    false,
    false
  ),
  generateLeaderboardEntry(
    8,
    106,
    'StudyHard',
    '努力學習',
    'https://lh3.googleusercontent.com/a/user-106',
    Occupation.PROGRAMMER,
    23,
    31000,
    140,
    10,
    25,
    false,
    false
  ),
  generateLeaderboardEntry(
    9,
    107,
    'KeepCoding',
    '持續編碼',
    'https://lh3.googleusercontent.com/a/user-107',
    Occupation.PROGRAMMER,
    20,
    25000,
    120,
    8,
    20,
    false,
    false
  ),
  generateLeaderboardEntry(
    10,
    108,
    'NewbieDev',
    '新手開發',
    'https://lh3.googleusercontent.com/a/user-108',
    Occupation.JUNIOR_PROGRAMMER,
    18,
    21000,
    100,
    6,
    15,
    false,
    false
  ),
  // 用戶 1 (當前用戶) 排名較後
  generateLeaderboardEntry(
    47,
    1,
    'John Doe',
    '小明',
    'https://lh3.googleusercontent.com/a/default-user',
    Occupation.PROGRAMMER,
    12,
    6500,
    45,
    3,
    8,
    true,
    false
  ),
]

/**
 * Mock 週排行榜資料 (本週經驗值增長)
 */
export const mockWeeklyLeaderboard: LeaderboardEntry[] = [
  {
    ...mockGlobalLeaderboard[6],
    rank: 1,
    expGained: 1200,
    levelsGained: 2,
  },
  {
    ...mockGlobalLeaderboard[8],
    rank: 2,
    expGained: 1000,
    levelsGained: 1,
  },
  {
    ...mockGlobalLeaderboard[10],
    rank: 3,
    expGained: 800,
    levelsGained: 1,
  },
  {
    ...mockGlobalLeaderboard[5],
    rank: 4,
    expGained: 600,
    levelsGained: 0,
  },
  {
    ...mockGlobalLeaderboard[0],
    rank: 5,
    expGained: 500,
    levelsGained: 0,
  },
]

/**
 * Mock 課程排行榜 (軟體設計模式)
 */
export const mockJourneyLeaderboard: LeaderboardEntry[] = [
  {
    ...mockGlobalLeaderboard[0],
    rank: 1,
  },
  {
    ...mockGlobalLeaderboard[3],
    rank: 2,
  },
  {
    ...mockGlobalLeaderboard[5],
    rank: 3,
  },
  {
    ...mockGlobalLeaderboard[2],
    rank: 4,
  },
  {
    ...mockGlobalLeaderboard[10],
    rank: 12,
  },
]

/**
 * 獲取排行榜資料
 */
export function getLeaderboard(
  type: LeaderboardType = LeaderboardType.GLOBAL,
  timeRange: LeaderboardTimeRange = LeaderboardTimeRange.ALL_TIME,
  sortBy: LeaderboardSortBy = LeaderboardSortBy.EXP,
  journeyId?: number,
  limit: number = 100
): LeaderboardResponse {
  let entries: LeaderboardEntry[] = []

  // 根據類型選擇資料
  if (type === LeaderboardType.WEEKLY || timeRange === LeaderboardTimeRange.THIS_WEEK) {
    entries = mockWeeklyLeaderboard
  } else if (type === LeaderboardType.JOURNEY && journeyId) {
    entries = mockJourneyLeaderboard
  } else {
    entries = mockGlobalLeaderboard
  }

  // 限制返回數量
  const limitedEntries = entries.slice(0, limit)

  // 查找當前用戶排名 (如果不在前列)
  const currentUserEntry = entries.find(e => e.isCurrentUser)
  const currentUserInTopList = limitedEntries.find(e => e.isCurrentUser)

  return {
    type,
    timeRange,
    sortBy,
    entries: limitedEntries,
    totalEntries: entries.length,
    currentUserEntry: currentUserInTopList ? undefined : currentUserEntry,
    updatedAt: Date.now(),
  }
}

/**
 * Mock 用戶排名資訊
 */
export const mockUserRanks: Record<number, UserRankInfo> = {
  1: {
    userId: 1,
    globalRank: 47,
    weeklyRank: 35,
    monthlyRank: 40,
    journeyRanks: [
      {
        journeyId: 1,
        journeyName: '軟體設計模式',
        rank: 12,
        totalParticipants: 150,
      },
      {
        journeyId: 2,
        journeyName: 'Clean Code 實踐',
        rank: 8,
        totalParticipants: 200,
      },
    ],
    percentile: 65, // 前 35%
  },
  2: {
    userId: 2,
    globalRank: 6,
    weeklyRank: 4,
    monthlyRank: 5,
    journeyRanks: [
      {
        journeyId: 1,
        journeyName: '軟體設計模式',
        rank: 3,
        totalParticipants: 150,
      },
      {
        journeyId: 2,
        journeyName: 'Clean Code 實踐',
        rank: 2,
        totalParticipants: 200,
      },
    ],
    percentile: 95, // 前 5%
  },
  3: {
    userId: 3,
    globalRank: 4,
    weeklyRank: 5,
    monthlyRank: 3,
    journeyRanks: [
      {
        journeyId: 1,
        journeyName: '軟體設計模式',
        rank: 2,
        totalParticipants: 150,
      },
    ],
    percentile: 99, // 前 1%
  },
}

/**
 * 獲取用戶排名資訊
 */
export function getUserRank(userId: number): UserRankInfo | undefined {
  return mockUserRanks[userId]
}

/**
 * Mock 排行榜統計資訊
 */
export const mockLeaderboardStats: LeaderboardStats = {
  totalUsers: 1250,
  averageLevel: 15,
  averageExp: 12500,
  topLevel: 36,
  topExp: 65000,
  activeUsersThisWeek: 450,
  activeUsersThisMonth: 890,
}

/**
 * 獲取排行榜統計
 */
export function getLeaderboardStats(): LeaderboardStats {
  return mockLeaderboardStats
}

/**
 * 搜尋排行榜 (根據用戶名)
 */
export function searchLeaderboard(
  query: string,
  type: LeaderboardType = LeaderboardType.GLOBAL
): LeaderboardEntry[] {
  let entries: LeaderboardEntry[] = []

  if (type === LeaderboardType.WEEKLY) {
    entries = mockWeeklyLeaderboard
  } else if (type === LeaderboardType.JOURNEY) {
    entries = mockJourneyLeaderboard
  } else {
    entries = mockGlobalLeaderboard
  }

  const lowercaseQuery = query.toLowerCase()

  return entries.filter(
    entry =>
      entry.username.toLowerCase().includes(lowercaseQuery) ||
      entry.nickname?.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * 獲取用戶周圍的排名 (例如顯示 ±5 名)
 */
export function getNearbyRanks(userId: number, range: number = 5): LeaderboardEntry[] {
  const userEntry = mockGlobalLeaderboard.find(e => e.userId === userId)
  if (!userEntry) return []

  const userRank = userEntry.rank
  const startRank = Math.max(1, userRank - range)
  const endRank = userRank + range

  return mockGlobalLeaderboard.filter(e => e.rank >= startRank && e.rank <= endRank)
}
