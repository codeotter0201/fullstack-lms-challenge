/**
 * Progress API
 *
 * 學習進度相關 API
 * R2: 真實後端 API 整合
 */

import { apiClient } from './client'
import type { ApiResponse } from '@/types/api'

/**
 * 進度更新請求
 */
export interface UpdateProgressRequest {
  lessonId: number
  position: number // 當前播放位置（秒）
  duration: number // 影片總長度（秒）
}

/**
 * 進度更新回應
 */
export interface UpdateProgressResponse {
  lessonId: number
  progressPercentage: number
  lastPosition: number
  isCompleted: boolean
  isSubmitted: boolean
}

/**
 * 單元提交請求
 */
export interface SubmitLessonRequest {
  lessonId: number
}

/**
 * 單元提交回應
 */
export interface SubmitLessonResponse {
  lessonId: number
  isSubmitted: boolean
  experienceGained: number
  user: {
    id: number
    email: string
    displayName: string
    level: number
    experience: number
    avatarUrl?: string
  }
}

/**
 * 更新學習進度
 * 每 10 秒自動調用一次，保存影片觀看進度
 */
export async function updateLessonProgress(
  lessonId: number,
  position: number,
  duration: number
): Promise<ApiResponse<UpdateProgressResponse>> {
  try {
    const response = await apiClient.post<UpdateProgressResponse>('/progress/update', {
      lessonId,
      position,
      duration,
    })

    return response
  } catch (error) {
    console.error('Failed to update progress:', error)
    return {
      success: false,
      error: {
        code: 'PROGRESS_UPDATE_FAILED',
        message: error instanceof Error ? error.message : '進度更新失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 提交單元完成
 * 必須先完成影片觀看（isCompleted = true）才能提交
 * 提交後獲得經驗值並更新使用者等級
 */
export async function submitLessonCompletion(
  lessonId: number
): Promise<ApiResponse<SubmitLessonResponse>> {
  try {
    const response = await apiClient.post<SubmitLessonResponse>('/progress/submit', {
      lessonId,
    })

    return response
  } catch (error) {
    console.error('Failed to submit lesson:', error)
    return {
      success: false,
      error: {
        code: 'LESSON_SUBMIT_FAILED',
        message: error instanceof Error ? error.message : '單元提交失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}
