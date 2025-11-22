/**
 * Journeys API
 *
 * 課程相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import {
  GetJourneysResponse,
  GetJourneyResponse,
  GetJourneyProgressResponse,
} from '@/types/api'
import { Journey, Chapter } from '@/types/journey'
import { journeys, getJourneyById } from '@/lib/mock/journeys'
import { userLessonProgress } from '@/lib/mock/progress'

/**
 * 獲取所有課程
 */
export async function getJourneys(): Promise<GetJourneysResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    success: true,
    data: {
      journeys,
      total: journeys.length,
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetJourneysResponse>('/journeys')
}

/**
 * 獲取單一課程
 */
export async function getJourney(journeyId: number): Promise<GetJourneyResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  const journey = getJourneyById(journeyId)

  if (!journey) {
    return {
      success: false,
      error: {
        code: 'JOURNEY_NOT_FOUND',
        message: '找不到指定的課程',
      },
    }
  }

  return {
    success: true,
    data: { journey },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetJourneyResponse>(`/journeys/${journeyId}`)
}

/**
 * 獲取課程進度
 */
export async function getJourneyProgress(
  journeyId: number,
  userId: string
): Promise<GetJourneyProgressResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  const progress = userLessonProgress[userId] || {}

  return {
    success: true,
    data: {
      journeyId,
      progress,
      completedLessons: Object.values(progress).filter(p => p.completed).length,
      totalLessons: 0, // 計算總數
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetJourneyProgressResponse>(
  //   `/journeys/${journeyId}/progress`
  // )
}

/**
 * 解鎖章節
 */
export async function unlockChapter(
  chapterId: number,
  password: string
): Promise<{ success: boolean; message?: string }> {
  // R1: Mock
  await new Promise(resolve => setTimeout(resolve, 300))

  // 簡單的密碼驗證邏輯
  return {
    success: true,
    message: '章節已解鎖',
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<{ success: boolean; message?: string }>(
  //   `/chapters/${chapterId}/unlock`,
  //   { password }
  // )
}
