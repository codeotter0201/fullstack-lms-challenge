/**
 * Lessons API
 *
 * 課程單元相關 API
 * 整合真實後端 API
 */

import { apiClient } from './client'
import { GetLessonResponse } from '@/types/api'
import { LessonDTO } from '@/types/backend'
import { convertLessonDTOToLesson } from '@/lib/utils/lessonConverter'

/**
 * 獲取單元詳情
 * GET /api/courses/lessons/{lessonId}
 */
export async function getLesson(lessonId: number): Promise<GetLessonResponse> {
  try {
    const response = await apiClient.get<LessonDTO>(`/courses/lessons/${lessonId}`)

    if (!response.success || !response.data) {
      return {
        success: false,
        error: {
          code: 'LESSON_NOT_FOUND',
          message: '找不到指定的單元',
          statusCode: 404,
        },
        timestamp: Date.now(),
      }
    }

    // Transform backend LessonDTO to frontend Lesson type
    const lesson = convertLessonDTOToLesson(response.data)

    return {
      success: true,
      data: lesson,
      timestamp: Date.now(),
    }
  } catch (error) {
    console.error('Failed to fetch lesson:', error)
    return {
      success: false,
      error: {
        code: 'LESSON_FETCH_FAILED',
        message: error instanceof Error ? error.message : '獲取單元失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

// Note: updateProgress, submitLesson, completeLesson functions are in lib/api/progress.ts
