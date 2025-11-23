/**
 * Auth API
 *
 * 認證相關 API
 * R2: 串接真實後端 API
 */

import { apiClient } from './client'
import { LoginRequest, LogoutResponse, RegisterRequest } from '@/types/api'
import { AuthResponse } from '@/types/backend'
import { ApiResponse } from '@/types/api'

/**
 * 登入
 * 使用 email + password 登入
 */
export async function login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<AuthResponse>('/auth/login', {
    email,
    password,
  })

  return response
}

/**
 * 註冊
 * 建立新帳號
 */
export async function register(
  email: string,
  password: string,
  displayName: string
): Promise<ApiResponse<AuthResponse>> {
  const response = await apiClient.post<AuthResponse>('/auth/register', {
    email,
    password,
    displayName,
  })

  return response
}

/**
 * 登出
 */
export async function logout(): Promise<LogoutResponse> {
  // R2: 真實 API 呼叫（如果後端有登出端點）
  // 目前後端沒有登出 API，前端只需清除 token
  return {
    success: true,
    data: undefined,
    timestamp: Date.now(),
  }
}

/**
 * 取得當前用戶資訊
 * @deprecated Use getCurrentUser from users.ts instead
 */
// export async function getCurrentUser() {
//   const response = await apiClient.get('/auth/me')
//   return response
// }
