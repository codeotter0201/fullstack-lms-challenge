/**
 * API Client 基礎架構
 *
 * 提供統一的 HTTP 請求封裝
 * R1: 返回 Mock 資料
 * R2: 整合真實後端 API
 */

import { ApiResponse, ApiError } from '@/types/api'

/**
 * API 基礎 URL
 * R1: 未使用（Mock 資料）
 * R2: 從環境變數讀取
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api'

/**
 * HTTP 方法
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

/**
 * 請求配置
 */
interface RequestConfig {
  method: HttpMethod
  headers?: Record<string, string>
  body?: any
  params?: Record<string, string | number | boolean>
}

/**
 * API 錯誤類
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public error?: ApiError
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

/**
 * 建立完整的 URL（含查詢參數）
 */
function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  // 確保 BASE_URL 和 path 正確拼接
  // BASE_URL: http://localhost:8080/api
  // path: /auth/login
  // 結果: http://localhost:8080/api/auth/login
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  const fullUrl = `${baseUrl}${cleanPath}`

  const url = new URL(fullUrl)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })
  }

  return url.toString()
}

/**
 * 獲取認證 Token
 */
function getAuthToken(): string | null {
  // R1: 從 localStorage 讀取
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken')
  }
  return null
}

/**
 * 建立請求標頭
 */
function buildHeaders(customHeaders?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  // 加入認證 Token
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
}

/**
 * 處理 API 回應
 */
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type')
  const isJson = contentType?.includes('application/json')

  // 解析回應
  const data = isJson ? await response.json() : await response.text()

  // 成功回應
  if (response.ok) {
    // 後端直接返回資料，包裝成 ApiResponse 格式
    return {
      success: true,
      data: data as T,
      timestamp: Date.now(),
    }
  }

  // 錯誤回應
  const error: ApiError = isJson
    ? {
        code: data.error || `HTTP_${response.status}`,
        message: data.message || response.statusText,
        statusCode: response.status,
      }
    : {
        code: `HTTP_${response.status}`,
        message: data || response.statusText,
        statusCode: response.status,
      }

  throw new ApiClientError(
    error.message || 'API request failed',
    response.status,
    error
  )
}

/**
 * 核心請求函數
 */
async function request<T>(
  path: string,
  config: RequestConfig
): Promise<ApiResponse<T>> {
  try {
    const url = buildUrl(path, config.params)
    const headers = buildHeaders(config.headers)

    const fetchConfig: RequestInit = {
      method: config.method,
      headers,
    }

    // 加入 body（GET 和 DELETE 不需要）
    if (config.body && config.method !== 'GET' && config.method !== 'DELETE') {
      fetchConfig.body = JSON.stringify(config.body)
    }

    // R2: 發送真實請求
    const response = await fetch(url, fetchConfig)
    return handleResponse<T>(response)
  } catch (error) {
    // 網路錯誤或其他異常
    if (error instanceof ApiClientError) {
      throw error
    }

    throw new ApiClientError(
      error instanceof Error ? error.message : 'Unknown error occurred'
    )
  }
}

/**
 * API Client 物件
 */
export const apiClient = {
  /**
   * GET 請求
   */
  get<T>(path: string, params?: Record<string, string | number | boolean>) {
    return request<T>(path, { method: 'GET', params })
  },

  /**
   * POST 請求
   */
  post<T>(path: string, body?: any) {
    return request<T>(path, { method: 'POST', body })
  },

  /**
   * PUT 請求
   */
  put<T>(path: string, body?: any) {
    return request<T>(path, { method: 'PUT', body })
  },

  /**
   * PATCH 請求
   */
  patch<T>(path: string, body?: any) {
    return request<T>(path, { method: 'PATCH', body })
  },

  /**
   * DELETE 請求
   */
  delete<T>(path: string) {
    return request<T>(path, { method: 'DELETE' })
  },
}
