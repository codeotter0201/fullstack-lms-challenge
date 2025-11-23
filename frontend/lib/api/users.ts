/**
 * Users API
 *
 * 用戶相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { apiClient } from './client'
import { GetUserResponse, UpdateUserRequest, UpdateUserResponse } from '@/types/api'
import { User } from '@/types/user'
import { currentUser, getUserById } from '@/lib/mock/users'

/**
 * 獲取當前用戶資訊
 */
export async function getCurrentUser(): Promise<GetUserResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  return {
    success: true,
    data: { user: currentUser },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetUserResponse>('/users/me')
}

/**
 * 獲取指定用戶資訊
 */
export async function getUser(userId: string): Promise<GetUserResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: '找不到指定的用戶',
      },
    }
  }

  return {
    success: true,
    data: { user },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<GetUserResponse>(`/users/${userId}`)
}

/**
 * 更新用戶資訊
 */
export async function updateUser(
  userId: string,
  updates: UpdateUserRequest
): Promise<UpdateUserResponse> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  const user = getUserById(userId)

  if (!user) {
    return {
      success: false,
      error: {
        code: 'USER_NOT_FOUND',
        message: '找不到指定的用戶',
      },
    }
  }

  // 合併更新
  const updatedUser: User = {
    ...user,
    ...updates,
  }

  return {
    success: true,
    data: { user: updatedUser },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.patch<UpdateUserResponse>(`/users/${userId}`, updates)
}

/**
 * 獲取用戶統計資訊
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
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 200))

  return {
    success: true,
    data: {
      totalExp: 5000,
      level: 12,
      lessonsCompleted: 45,
      lessonsInProgress: 3,
      gymsPassed: 8,
      gymsAttempted: 10,
      badges: 15,
      studyStreak: 7,
      totalStudyTime: 1250,
      avgLessonScore: 85,
      lastActive: Date.now(),
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get(`/users/${userId}/stats`)
}
