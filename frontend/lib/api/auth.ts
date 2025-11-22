/**
 * Auth API
 *
 * 認證相關 API
 * R1: 返回 Mock 資料
 * R2: 整合真實 LINE Login API
 */

import { apiClient } from './client'
import { LoginRequest, LoginResponse, LogoutResponse } from '@/types/api'
import { currentUser } from '@/lib/mock/users'

/**
 * 登入
 * R1: 使用 Mock 資料
 * R2: 呼叫 LINE Login API
 */
export async function login(lineToken: string): Promise<LoginResponse> {
  // R1: Mock 登入
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    success: true,
    data: {
      user: currentUser,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresIn: 3600,
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<LoginResponse>('/auth/line', { token: lineToken })
}

/**
 * 登出
 */
export async function logout(): Promise<LogoutResponse> {
  // R1: Mock 登出
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    success: true,
    data: {
      message: '登出成功',
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<LogoutResponse>('/auth/logout')
}

/**
 * 重新整理 Token
 * R2: 使用 refresh token 獲取新的 access token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  // R1: Mock
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    success: true,
    data: {
      user: currentUser,
      accessToken: 'mock-new-access-token-' + Date.now(),
      refreshToken: 'mock-new-refresh-token-' + Date.now(),
      expiresIn: 3600,
    },
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.post<LoginResponse>('/auth/refresh', { refreshToken })
}

/**
 * 驗證 Token
 * R2: 驗證當前 token 是否有效
 */
export async function verifyToken(): Promise<{ valid: boolean }> {
  // R1: Mock
  await new Promise(resolve => setTimeout(resolve, 200))

  return { valid: true }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<{ valid: boolean }>('/auth/verify')
}
