/**
 * Lessons API
 *
 * 課程單元相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import {
  GetLessonResponse,
  UpdateLessonProgressRequest,
  UpdateLessonProgressResponse,
  SubmitLessonRequest,
  SubmitLessonResponse,
} from '@/types/api'
import { getLessonById } from '@/lib/mock/journeys'
import { updateLessonProgress, deliverLesson } from '@/lib/mock/progress'

/**
 * 獲取單元詳情
 */
export async function getLesson(lessonId: number): Promise<GetLessonResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  const lesson = getLessonById(lessonId)

  if (!lesson) {
    return {
      success: false,
      error: {
        code: 'LESSON_NOT_FOUND',
        message: '找不到指定的單元',
      },
    }
  }

  return {
    success: true,
    data: { lesson },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetLessonResponse>(`/lessons/${lessonId}`)
}

/**
 * 更新單元進度
 */
export async function updateProgress(
  lessonId: number,
  userId: string,
  progressData: Partial<UpdateLessonProgressRequest>
): Promise<UpdateLessonProgressResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  const progress = updateLessonProgress(userId, lessonId, progressData)

  return {
    success: true,
    data: { progress },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.patch<UpdateLessonProgressResponse>(
  //   `/lessons/${lessonId}/progress`,
  //   progressData
  // )
}

/**
 * 繳交單元
 */
export async function submitLesson(
  lessonId: number,
  userId: string,
  submissionData?: SubmitLessonRequest
): Promise<SubmitLessonResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 500))

  const progress = deliverLesson(userId, lessonId)

  return {
    success: true,
    data: {
      progress,
      expGained: progress.expGained || 0,
      message: '單元繳交成功！',
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<SubmitLessonResponse>(
  //   `/lessons/${lessonId}/submit`,
  //   submissionData
  // )
}

/**
 * 標記單元為已完成
 */
export async function completeLesson(
  lessonId: number
): Promise<{ success: boolean; message: string }> {
  // R1: Mock
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    success: true,
    message: '單元已標記為完成',
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<{ success: boolean; message: string }>(
  //   `/lessons/${lessonId}/complete`
  // )
}
