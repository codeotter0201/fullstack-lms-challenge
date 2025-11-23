/**
 * Users API
 *
 * 用戶相關 API
 * 整合真實後端 API
 */

import { apiClient } from './client'
import { GetUserResponse, UpdateUserRequest, UpdateUserResponse } from '@/types/api'
import { UserDTO } from '@/types/backend'

/**
 * 獲取當前用戶資訊
 * GET /api/auth/me
 */
export async function getCurrentUser(): Promise<GetUserResponse> {
  try {
    const response = await apiClient.get<UserDTO>('/auth/me')
    // Cast to any to bypass type checking - backend returns UserDTO which needs transformation
    // The AuthContext will handle the transformation from UserDTO to User
    return response as any
  } catch (error) {
    console.error('Failed to get current user:', error)
    return {
      success: false,
      error: {
        code: 'USER_FETCH_FAILED',
        message: error instanceof Error ? error.message : '獲取用戶資料失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 獲取指定用戶資訊
 * GET /api/users/{userId}
 * Note: 目前後端只支持 /users/me，此函數暫時返回當前用戶
 */
export async function getUser(userId: string): Promise<GetUserResponse> {
  // 暫時使用 getCurrentUser，因為後端只有 /users/me
  return getCurrentUser()
}

/**
 * 更新用戶資訊
 * PATCH /api/auth/me
 */
export async function updateUser(
  userId: string,
  updates: UpdateUserRequest
): Promise<UpdateUserResponse> {
  try {
    const response = await apiClient.patch<UserDTO>('/auth/me', updates)
    // Cast to any to bypass type checking - backend returns UserDTO which needs transformation
    return response as any
  } catch (error) {
    console.error('Failed to update user:', error)
    return {
      success: false,
      error: {
        code: 'USER_UPDATE_FAILED',
        message: error instanceof Error ? error.message : '更新用戶資料失敗',
        statusCode: 500,
      },
      timestamp: Date.now(),
    }
  }
}

/**
 * 獲取用戶統計資訊
 * Note: 後端未實現，返回基礎統計數據
 */
export async function getUserStats(userId: string): Promise<{
  success: boolean
  data?: {
    totalExp: number
    level: number
    lessonsCompleted: number
    lessonsInProgress: number
    gymsPassed: number
    gymsAttempted: number
    badges: number
    studyStreak: number
    totalStudyTime: number
    avgLessonScore: number
    lastActive: number
  }
}> {
  // 後端未實現統計 API，返回空數據
  // TODO: 等待後端實現 GET /api/users/{userId}/stats
  return {
    success: true,
    data: {
      totalExp: 0,
      level: 1,
      lessonsCompleted: 0,
      lessonsInProgress: 0,
      gymsPassed: 0,
      gymsAttempted: 0,
      badges: 0,
      studyStreak: 0,
      totalStudyTime: 0,
      avgLessonScore: 0,
      lastActive: Date.now(),
    },
  }
}
