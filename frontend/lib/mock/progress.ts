/**
 * Mock 進度資料
 *
 * 提供測試用的單元進度、道館進度資料
 */

import { LessonProgress, LessonStatus } from '@/types/lesson'
import { GymChallengeRecord, GymChallengeStatus, UserGymProgress } from '@/types/gym'

/**
 * Mock 單元進度資料
 */
export const mockLessonProgress: Record<number, Record<number, LessonProgress>> = {
  // 用戶 1 的進度
  1: {
    1: {
      userId: 1,
      lessonId: 1,
      currentTime: 0,
      duration: 765, // 12:45
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    2: {
      userId: 1,
      lessonId: 2,
      currentTime: 450,
      duration: 930, // 15:30
      percentage: 48,
      completed: false,
      delivered: false,
      lastUpdated: Date.now() - 1 * 60 * 60 * 1000,
    },
    8: {
      userId: 1,
      lessonId: 8,
      currentTime: 630,
      duration: 630, // 10:30
      percentage: 100,
      completed: true,
      delivered: false,
      lastUpdated: Date.now() - 5 * 60 * 60 * 1000,
    },
  },

  // 用戶 2 的進度 (付費學員，進度更多)
  2: {
    1: {
      userId: 2,
      lessonId: 1,
      currentTime: 765,
      duration: 765,
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    2: {
      userId: 2,
      lessonId: 2,
      currentTime: 930,
      duration: 930,
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 29 * 24 * 60 * 60 * 1000,
    },
    3: {
      userId: 2,
      lessonId: 3,
      currentTime: 1100,
      duration: 1100, // 18:20
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 28 * 24 * 60 * 60 * 1000,
    },
    4: {
      userId: 2,
      lessonId: 4,
      currentTime: 975,
      duration: 975, // 16:15
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 27 * 24 * 60 * 60 * 1000,
    },
    5: {
      userId: 2,
      lessonId: 5,
      currentTime: 500,
      duration: 880, // 14:40
      percentage: 57,
      completed: false,
      delivered: false,
      lastUpdated: Date.now() - 2 * 60 * 60 * 1000,
    },
  },

  // 用戶 3 (老師) 的進度
  3: {
    1: {
      userId: 3,
      lessonId: 1,
      currentTime: 765,
      duration: 765,
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 80 * 24 * 60 * 60 * 1000,
    },
    2: {
      userId: 3,
      lessonId: 2,
      currentTime: 930,
      duration: 930,
      percentage: 100,
      completed: true,
      delivered: true,
      lastUpdated: Date.now() - 79 * 24 * 60 * 60 * 1000,
    },
  },
}

/**
 * 獲取用戶的單元進度
 */
export function getLessonProgress(userId: number, lessonId: number): LessonProgress | undefined {
  return mockLessonProgress[userId]?.[lessonId]
}

/**
 * 獲取用戶的所有進度
 */
export function getAllUserProgress(userId: number): LessonProgress[] {
  const userProgress = mockLessonProgress[userId]
  if (!userProgress) return []

  return Object.values(userProgress)
}

/**
 * 更新單元進度
 */
export function updateLessonProgress(
  userId: number,
  lessonId: number,
  update: Partial<LessonProgress>
): LessonProgress {
  if (!mockLessonProgress[userId]) {
    mockLessonProgress[userId] = {}
  }

  const existing = mockLessonProgress[userId][lessonId]

  const updated: LessonProgress = {
    userId,
    lessonId,
    currentTime: update.currentTime ?? existing?.currentTime ?? 0,
    duration: update.duration ?? existing?.duration ?? 0,
    percentage: update.percentage ?? existing?.percentage ?? 0,
    completed: update.completed ?? existing?.completed ?? false,
    delivered: update.delivered ?? existing?.delivered ?? false,
    lastUpdated: Date.now(),
  }

  mockLessonProgress[userId][lessonId] = updated
  return updated
}

/**
 * 交付單元 (獲得經驗值)
 */
export function deliverLesson(userId: number, lessonId: number): {
  success: boolean
  expGained: number
  message: string
} {
  const progress = getLessonProgress(userId, lessonId)

  if (!progress) {
    return {
      success: false,
      expGained: 0,
      message: '找不到單元進度',
    }
  }

  if (!progress.completed) {
    return {
      success: false,
      expGained: 0,
      message: '單元尚未完成',
    }
  }

  if (progress.delivered) {
    return {
      success: false,
      expGained: 0,
      message: '已經交付過此單元',
    }
  }

  // 模擬經驗值 (實際應從 lesson.reward.exp 取得)
  const expGained = 100

  // 更新交付狀態
  updateLessonProgress(userId, lessonId, { delivered: true })

  return {
    success: true,
    expGained,
    message: `成功交付單元，獲得 ${expGained} 經驗值`,
  }
}

/**
 * Mock 道館挑戰記錄
 */
export const mockGymChallengeRecords: Record<number, Record<number, GymChallengeRecord>> = {
  // 用戶 1
  1: {
    1: {
      id: 1,
      userId: 1,
      gymId: 1,
      status: GymChallengeStatus.AVAILABLE,
      attempts: 0,
      lastUpdated: Date.now(),
    },
    2: {
      id: 2,
      userId: 1,
      gymId: 2,
      status: GymChallengeStatus.LOCKED,
      attempts: 0,
      lastUpdated: Date.now(),
    },
  },

  // 用戶 2 (付費學員)
  2: {
    1: {
      id: 3,
      userId: 2,
      gymId: 1,
      status: GymChallengeStatus.PASSED,
      score: 85,
      attempts: 2,
      passedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      lastAttemptAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      lastUpdated: Date.now() - 25 * 24 * 60 * 60 * 1000,
    },
    2: {
      id: 4,
      userId: 2,
      gymId: 2,
      status: GymChallengeStatus.IN_PROGRESS,
      attempts: 1,
      lastAttemptAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
      lastUpdated: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
  },
}

/**
 * 獲取道館挑戰記錄
 */
export function getGymChallengeRecord(userId: number, gymId: number): GymChallengeRecord | undefined {
  return mockGymChallengeRecords[userId]?.[gymId]
}

/**
 * 獲取用戶的所有道館記錄
 */
export function getAllUserGymRecords(userId: number): GymChallengeRecord[] {
  const records = mockGymChallengeRecords[userId]
  if (!records) return []

  return Object.values(records)
}

/**
 * Mock 用戶道館進度
 */
export const mockUserGymProgress: Record<number, UserGymProgress> = {
  1: {
    userId: 1,
    journeyId: 1,
    totalGyms: 2,
    passedGyms: 0,
    whitePassedGyms: 0,
    blackPassedGyms: 0,
    badges: [],
  },
  2: {
    userId: 2,
    journeyId: 1,
    totalGyms: 2,
    passedGyms: 1,
    whitePassedGyms: 1,
    blackPassedGyms: 0,
    badges: [
      {
        id: 1,
        name: '創建型模式大師',
        gymId: 1,
        imageUrl: 'https://cdn.waterballsa.tw/badges/creational-master.png',
        journeyId: 1,
        chapterId: 1,
        earnedAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      },
    ],
  },
}

/**
 * 獲取用戶道館進度
 */
export function getUserGymProgress(userId: number, journeyId: number): UserGymProgress | undefined {
  const progress = mockUserGymProgress[userId]
  if (!progress || progress.journeyId !== journeyId) return undefined
  return progress
}

/**
 * 計算課程完成度
 */
export function calculateJourneyCompletion(userId: number, journeyId: number): {
  completedLessons: number
  totalLessons: number
  percentage: number
} {
  const userProgress = mockLessonProgress[userId] || {}
  const allProgress = Object.values(userProgress)

  // 這裡應該根據 journeyId 過濾，但為了簡化，暫時統計所有
  const completedLessons = allProgress.filter(p => p.completed).length
  const totalLessons = allProgress.length || 1

  return {
    completedLessons,
    totalLessons,
    percentage: Math.round((completedLessons / totalLessons) * 100),
  }
}

/**
 * 檢查單元是否可訪問 (根據順序和前置條件)
 */
export function isLessonAccessible(
  userId: number,
  lessonId: number,
  lessonOrder: number,
  chapterLessons: number[]
): boolean {
  // 第一個單元總是可訪問
  if (lessonOrder === 1) return true

  // 檢查前一個單元是否完成
  const previousLessonId = chapterLessons[lessonOrder - 2]
  if (!previousLessonId) return true

  const previousProgress = getLessonProgress(userId, previousLessonId)
  return previousProgress?.completed ?? false
}

/**
 * Export alias for compatibility with JourneyContext
 */
export const userLessonProgress = mockLessonProgress
