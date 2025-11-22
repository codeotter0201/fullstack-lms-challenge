/**
 * 道館相關型別定義 (R3 實作)
 *
 * 定義道館挑戰、徽章、戰績等相關型別
 */

import { Reward } from './journey'

/**
 * 道館類型
 */
export enum GymType {
  WHITE = 'white',  // 白段 (一般難度)
  BLACK = 'black',  // 黑段 (高難度)
}

/**
 * 道館難度
 */
export type GymDifficulty = 1 | 2 | 3 | 4 | 5  // 1-5 星

/**
 * 道館
 */
export interface Gym {
  id: number
  name: string
  description?: string
  difficulty: GymDifficulty
  chapterId: number
  journeyId: number
  type: GymType
  reward: Reward
  order: number

  // 額外資訊
  estimatedTime?: string        // 預估完成時間 (e.g., "2 hours")
  requiredLevel?: number        // 建議等級
  prerequisiteGymIds?: number[] // 前置道館 ID
}

/**
 * 道館徽章
 */
export interface GymBadge {
  id: number
  name: string
  gymId: number
  imageUrl: string
  journeyId: number
  chapterId: number
  description?: string
  earnedAt?: number  // 獲得時間戳 (如果用戶已獲得)
}

/**
 * 道館挑戰狀態
 */
export enum GymChallengeStatus {
  LOCKED = 'LOCKED',           // 未解鎖
  AVAILABLE = 'AVAILABLE',     // 可挑戰
  IN_PROGRESS = 'IN_PROGRESS', // 挑戰中
  PASSED = 'PASSED',           // 已通過
  FAILED = 'FAILED',           // 失敗
}

/**
 * 道館挑戰記錄
 */
export interface GymChallengeRecord {
  id: number
  userId: number
  gymId: number
  status: GymChallengeStatus
  score?: number              // 分數 (0-100)
  attempts: number            // 嘗試次數
  passedAt?: number          // 通過時間戳
  lastAttemptAt?: number     // 最後嘗試時間戳
}

/**
 * 道館挑戰提交
 */
export interface GymSubmission {
  id: number
  userId: number
  gymId: number
  submittedAt: number
  content: string            // 提交內容 (GitHub repo link, 答案等)
  feedback?: string          // 老師回饋
  score?: number            // 評分
  reviewedBy?: number       // 評分老師 ID
  reviewedAt?: number       // 評分時間
}

/**
 * 道館統計資訊
 */
export interface GymStats {
  gymId: number
  totalAttempts: number      // 總挑戰次數
  passRate: number          // 通過率 (0-100)
  averageScore: number      // 平均分數
  averageAttempts: number   // 平均嘗試次數
}

/**
 * 用戶道館進度
 */
export interface UserGymProgress {
  userId: number
  journeyId: number
  totalGyms: number
  passedGyms: number
  whitePassedGyms: number   // 白段通過數
  blackPassedGyms: number   // 黑段通過數
  badges: GymBadge[]        // 已獲得徽章
}

/**
 * 判斷道館是否已通過
 */
export function isGymPassed(record?: GymChallengeRecord): boolean {
  return record?.status === GymChallengeStatus.PASSED
}

/**
 * 判斷道館是否可挑戰
 */
export function isGymAvailable(record?: GymChallengeRecord): boolean {
  if (!record) return false
  return record.status === GymChallengeStatus.AVAILABLE ||
         record.status === GymChallengeStatus.IN_PROGRESS ||
         record.status === GymChallengeStatus.FAILED
}

/**
 * 道館難度對應星星顯示
 */
export const GYM_DIFFICULTY_STARS: Record<GymDifficulty, string> = {
  1: '⭐',
  2: '⭐⭐',
  3: '⭐⭐⭐',
  4: '⭐⭐⭐⭐',
  5: '⭐⭐⭐⭐⭐',
}

/**
 * 道館類型中文名稱
 */
export const GYM_TYPE_NAMES: Record<GymType, string> = {
  [GymType.WHITE]: '白段',
  [GymType.BLACK]: '黑段',
}
