/**
 * 課程單元相關型別定義
 *
 * 定義單元進度、影片播放等相關型別
 */

import { LessonType } from './journey'

/**
 * 課程單元進度
 */
export interface LessonProgress {
  userId: number
  lessonId: number
  currentTime: number      // 當前播放秒數
  duration: number         // 影片總長度
  percentage: number       // 完成百分比 (0-100)
  completed: boolean       // 是否完成 (100%)
  delivered: boolean       // 是否已交付 (獲得經驗值)
  lastUpdated: number      // 最後更新時間戳
}

/**
 * 影片播放進度
 */
export interface VideoProgress {
  currentTime: number
  duration: number
  percentage: number
}

/**
 * 影片播放器狀態
 */
export interface VideoPlayerState {
  isPlaying: boolean
  isLoading: boolean
  volume: number           // 音量 (0-1)
  playbackRate: number     // 播放速度 (0.5, 1, 1.5, 2)
  isFullscreen: boolean
  isMuted: boolean
}

/**
 * 單元完成狀態
 */
export enum LessonStatus {
  NOT_STARTED = 'NOT_STARTED',     // 未開始
  IN_PROGRESS = 'IN_PROGRESS',     // 進行中
  COMPLETED = 'COMPLETED',         // 已完成 (100%)
  DELIVERED = 'DELIVERED',         // 已交付
}

/**
 * 單元完成判定
 */
export function getLessonStatus(progress?: LessonProgress): LessonStatus {
  if (!progress) return LessonStatus.NOT_STARTED
  if (progress.delivered) return LessonStatus.DELIVERED
  if (progress.completed || progress.percentage >= 100) return LessonStatus.COMPLETED
  if (progress.percentage > 0) return LessonStatus.IN_PROGRESS
  return LessonStatus.NOT_STARTED
}

/**
 * 單元完成配置
 */
export interface LessonCompletionConfig {
  threshold: number  // 完成門檻百分比 (預設 100, 可設定 95-100)
  autoSaveInterval: number  // 自動儲存間隔 (毫秒, 預設 10000)
}

/**
 * 預設完成配置
 */
export const DEFAULT_COMPLETION_CONFIG: LessonCompletionConfig = {
  threshold: 95,  // 95% 即視為完成 (避免片尾黑畫面問題)
  autoSaveInterval: 10000,  // 10 秒
}

/**
 * 單元交付請求
 */
export interface DeliverLessonRequest {
  lessonId: number
  userId: number
}

/**
 * 單元交付回應
 */
export interface DeliverLessonResponse {
  success: boolean
  expGained: number
  newLevel?: number   // 如果升級了，返回新等級
  message: string
}

/**
 * 批量進度資料
 */
export interface BatchProgressData {
  userId: number
  progresses: LessonProgress[]
}
