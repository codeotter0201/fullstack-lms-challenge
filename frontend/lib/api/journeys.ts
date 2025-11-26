/**
 * Journeys API
 *
 * 課程相關 API
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import {
  GetJourneysResponse,
  GetJourneyResponse,
  ApiResponse,
} from '@/types/api'
import { Journey, Chapter } from '@/types/journey'
import type { CourseDTO, LessonDTO } from '@/types/backend'

// Journey progress response type
type GetJourneyProgressResponse = ApiResponse<{
  journeyId: number
  progress: Record<string, { completed: boolean; progress: number; submitted: boolean }>
  completedLessons: number
  totalLessons: number
}>
import { transformCourseToJourney, transformLessons } from './transformers/course'

/**
 * 獲取所有課程
 */
export async function getJourneys(): Promise<GetJourneysResponse> {
  try {
    // Call backend API: GET /api/courses
    const response = await apiClient.get<CourseDTO[]>('/courses')

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || {
          code: 'FETCH_FAILED',
          message: '無法獲取課程列表',
          statusCode: 500,
        },
        timestamp: Date.now(),
      }
    }

    // Transform backend DTOs to frontend types
    const journeys = response.data.map((course) => transformCourseToJourney(course))

    return {
      success: true,
      data: {
        journeys,
        total: journeys.length,
      },
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '網路錯誤',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 獲取單一課程（包含課程詳情和單元列表）
 */
export async function getJourney(journeyId: number): Promise<GetJourneyResponse> {
  try {
    // Call backend API: GET /api/courses/{courseId}
    const courseResponse = await apiClient.get<CourseDTO>(`/courses/${journeyId}`)

    if (!courseResponse.success || !courseResponse.data) {
      return {
        success: false,
        error: courseResponse.error || {
          code: 'JOURNEY_NOT_FOUND',
          message: '找不到指定的課程',
          statusCode: 404,
        },
        timestamp: Date.now(),
      }
    }

    // Fetch lessons for this course: GET /api/courses/{courseId}/lessons
    const lessonsResponse = await apiClient.get<LessonDTO[]>(
      `/courses/${journeyId}/lessons`
    )

    // Transform course DTO to journey, passing lessons to generate chapters
    const journey = transformCourseToJourney(
      courseResponse.data,
      lessonsResponse.success ? lessonsResponse.data : undefined
    )

    return {
      success: true,
      data: { journey },
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '網路錯誤',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 獲取課程進度
 * Note: Progress is included in LessonDTO when fetching lessons
 * This function provides a summary view
 */
export async function getJourneyProgress(
  journeyId: number,
  userId: string
): Promise<GetJourneyProgressResponse> {
  try {
    // Fetch lessons with progress: GET /api/courses/{courseId}/lessons
    const response = await apiClient.get<LessonDTO[]>(`/courses/${journeyId}/lessons`)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: response.error || {
          code: 'FETCH_FAILED',
          message: '無法獲取課程進度',
          statusCode: 500,
        },
        timestamp: Date.now(),
      }
    }

    // Build progress map from lessons
    const progress: Record<string, { completed: boolean; progress: number; submitted: boolean }> = {}
    let completedCount = 0

    response.data.forEach((lesson) => {
      progress[lesson.id.toString()] = {
        completed: lesson.isCompleted,
        progress: lesson.progressPercentage,
        submitted: lesson.isSubmitted,
      }
      if (lesson.isCompleted) {
        completedCount++
      }
    })

    return {
      success: true,
      data: {
        journeyId,
        progress,
        completedLessons: completedCount,
        totalLessons: response.data.length,
      },
      timestamp: Date.now(),
    }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : '網路錯誤',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 解鎖章節
 * Note: Chapter unlocking is not yet implemented in backend
 * This is a placeholder for future implementation
 */
export async function unlockChapter(
  chapterId: number,
  password: string
): Promise<{ success: boolean; message?: string }> {
  // TODO: Implement when backend supports chapter unlocking
  // For now, chapters don't exist as separate entities in backend
  console.warn('Chapter unlocking not yet implemented in backend')

  return {
    success: true,
    message: '章節已解鎖 (功能開發中)',
  }

  // Future implementation:
  // return apiClient.post<{ success: boolean; message?: string }>(
  //   `/chapters/${chapterId}/unlock`,
  //   { password }
  // )
}
