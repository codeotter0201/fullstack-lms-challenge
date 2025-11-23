/**
 * API 回應型別定義
 *
 * 定義所有 API 端點的請求與回應型別
 */

import { User, AuthResponse } from './user'
import { Journey, Chapter, Lesson, Skill, Mission } from './journey'
import { LessonProgress, DeliverLessonResponse } from './lesson'
import { Gym, GymChallengeRecord, GymSubmission, UserGymProgress } from './gym'
import { LeaderboardResponse, UserRankInfo } from './leaderboard'

/**
 * API 基礎回應
 */
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: ApiError
  message?: string
  timestamp: number
}

/**
 * API 錯誤
 */
export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
  statusCode: number
}

/**
 * 分頁回應
 */
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 分頁請求參數
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ==================== 認證相關 ====================

/**
 * 登入請求
 */
export interface LoginRequest {
  email: string
  password: string
}

/**
 * 登入回應
 */
export type LoginResponse = ApiResponse<AuthResponse>

/**
 * OAuth 登入請求
 */
export interface OAuthLoginRequest {
  provider: 'google' | 'facebook'
  token: string
}

/**
 * 註冊請求
 */
export interface RegisterRequest {
  email: string
  password: string
  name: string
  occupation: string
}

/**
 * 註冊回應
 */
export type RegisterResponse = ApiResponse<AuthResponse>

/**
 * 登出回應
 */
export type LogoutResponse = ApiResponse<void>

/**
 * 刷新 Token 回應
 */
export interface RefreshTokenResponse {
  token: string
  expiresAt: number
}

// ==================== 用戶相關 ====================

/**
 * 獲取用戶資料回應
 */
export type GetUserResponse = ApiResponse<User>

/**
 * 更新用戶資料請求
 */
export interface UpdateUserRequest {
  name?: string
  nickname?: string
  birthday?: string
  gender?: string
  region?: string
  githubLink?: string
  occupation?: string
}

/**
 * 更新用戶資料回應
 */
export type UpdateUserResponse = ApiResponse<User>

/**
 * 用戶統計資料
 */
export interface UserStats {
  totalExp: number
  level: number
  lessonsCompleted: number
  gymsPassed: number
  badgesEarned: number
  journeysEnrolled: number
  studyDays: number           // 學習天數
  totalStudyTime: number      // 總學習時間 (分鐘)
}

/**
 * 獲取用戶統計回應
 */
export type GetUserStatsResponse = ApiResponse<UserStats>

/**
 * 帳號綁定請求
 */
export interface BindAccountRequest {
  provider: 'discord' | 'github'
  code: string
}

/**
 * 帳號綁定回應
 */
export type BindAccountResponse = ApiResponse<{ bound: boolean }>

// ==================== 課程相關 ====================

/**
 * 獲取課程列表回應
 */
export type GetJourneysResponse = ApiResponse<{
  journeys: Journey[]
  total: number
}>

/**
 * 獲取單一課程回應
 */
export type GetJourneyResponse = ApiResponse<{
  journey: Journey
}>

/**
 * 獲取課程技能回應
 */
export type GetJourneySkillsResponse = ApiResponse<Skill[]>

/**
 * 獲取課程章節回應
 */
export type GetChaptersResponse = ApiResponse<Chapter[]>

/**
 * 解鎖章節請求
 */
export interface UnlockChapterRequest {
  chapterId: number
  password: string
}

/**
 * 解鎖章節回應
 */
export type UnlockChapterResponse = ApiResponse<{ unlocked: boolean }>

// ==================== 單元相關 ====================

/**
 * 獲取單元詳情回應
 */
export type GetLessonResponse = ApiResponse<Lesson>

/**
 * 獲取單元進度回應
 */
export type GetLessonProgressResponse = ApiResponse<LessonProgress>

/**
 * 更新單元進度請求
 */
export interface UpdateLessonProgressRequest {
  lessonId: number
  userId: number
  currentTime: number
  duration: number
  percentage: number
}

/**
 * 更新單元進度回應
 */
export type UpdateLessonProgressResponse = ApiResponse<LessonProgress>

/**
 * 交付單元請求
 */
export interface DeliverLessonRequest {
  lessonId: number
  userId: number
}

/**
 * 交付單元回應
 */
export type DeliverLessonApiResponse = ApiResponse<DeliverLessonResponse>

/**
 * 批量獲取進度請求
 */
export interface BatchGetProgressRequest {
  userId: number
  lessonIds: number[]
}

/**
 * 批量獲取進度回應
 */
export type BatchGetProgressResponse = ApiResponse<LessonProgress[]>

// ==================== 道館相關 (R3) ====================

/**
 * 獲取道館列表回應
 */
export type GetGymsResponse = ApiResponse<Gym[]>

/**
 * 獲取單一道館回應
 */
export type GetGymResponse = ApiResponse<Gym>

/**
 * 獲取道館挑戰記錄回應
 */
export type GetGymChallengeResponse = ApiResponse<GymChallengeRecord>

/**
 * 開始道館挑戰請求
 */
export interface StartGymChallengeRequest {
  gymId: number
  userId: number
}

/**
 * 開始道館挑戰回應
 */
export type StartGymChallengeResponse = ApiResponse<GymChallengeRecord>

/**
 * 提交道館作業請求
 */
export interface SubmitGymRequest {
  gymId: number
  userId: number
  content: string
}

/**
 * 提交道館作業回應
 */
export type SubmitGymResponse = ApiResponse<GymSubmission>

/**
 * 獲取用戶道館進度回應
 */
export type GetUserGymProgressResponse = ApiResponse<UserGymProgress>

// ==================== 排行榜相關 ====================

/**
 * 獲取排行榜請求
 */
export interface GetLeaderboardRequest {
  type?: string
  timeRange?: string
  sortBy?: string
  journeyId?: number
  limit?: number
  offset?: number
}

/**
 * 獲取排行榜回應
 */
export type GetLeaderboardApiResponse = ApiResponse<LeaderboardResponse>

/**
 * 獲取用戶排名回應
 */
export type GetUserRankResponse = ApiResponse<UserRankInfo>

// ==================== 任務相關 (R2) ====================

/**
 * 獲取課程任務回應
 */
export type GetMissionsResponse = ApiResponse<Mission[]>

/**
 * 完成任務請求
 */
export interface CompleteMissionRequest {
  missionId: number
  userId: number
}

/**
 * 完成任務回應
 */
export interface CompleteMissionResponse {
  success: boolean
  expGained: number
  newLevel?: number
  message: string
}

/**
 * 完成任務 API 回應
 */
export type CompleteMissionApiResponse = ApiResponse<CompleteMissionResponse>

// ==================== 上傳相關 ====================

/**
 * 上傳檔案請求
 */
export interface UploadFileRequest {
  file: File
  type: 'avatar' | 'submission' | 'other'
}

/**
 * 上傳檔案回應
 */
export interface UploadFileResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

/**
 * 上傳檔案 API 回應
 */
export type UploadFileApiResponse = ApiResponse<UploadFileResponse>

// ==================== 通知相關 (R2) ====================

/**
 * 通知類型
 */
export enum NotificationType {
  LEVEL_UP = 'LEVEL_UP',
  LESSON_COMPLETED = 'LESSON_COMPLETED',
  GYM_PASSED = 'GYM_PASSED',
  BADGE_EARNED = 'BADGE_EARNED',
  MISSION_COMPLETED = 'MISSION_COMPLETED',
  RANK_CHANGED = 'RANK_CHANGED',
}

/**
 * 通知
 */
export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: number
  data?: Record<string, unknown>
}

/**
 * 獲取通知列表回應
 */
export type GetNotificationsResponse = ApiResponse<PaginatedResponse<Notification>>

/**
 * 標記通知已讀請求
 */
export interface MarkNotificationReadRequest {
  notificationId: number
}

/**
 * 標記通知已讀回應
 */
export type MarkNotificationReadResponse = ApiResponse<void>

// ==================== 健康檢查 ====================

/**
 * 健康檢查回應
 */
export interface HealthCheckResponse {
  status: 'ok' | 'degraded' | 'down'
  version: string
  timestamp: number
  services?: {
    database: 'ok' | 'down'
    cache: 'ok' | 'down'
  }
}

/**
 * 健康檢查 API 回應
 */
export type HealthCheckApiResponse = ApiResponse<HealthCheckResponse>

// ==================== API 請求配置 ====================

/**
 * API 請求配置
 */
export interface ApiRequestConfig {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  withCredentials?: boolean
}

/**
 * API 客戶端選項
 */
export interface ApiClientOptions extends ApiRequestConfig {
  onUnauthorized?: () => void
  onError?: (error: ApiError) => void
  retryAttempts?: number
  retryDelay?: number
}
