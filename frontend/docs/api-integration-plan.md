# API 整合計畫

本文件說明系統的 API 架構，包含當前 Mock 資料實作與未來真實 API 整合指南。

---

## 目錄

1. [當前 Mock 資料架構](#當前-mock-資料架構)
2. [API Client 基礎](#api-client-基礎)
3. [認證 API](#認證-api)
4. [課程 API](#課程-api)
5. [進度追蹤 API](#進度追蹤-api)
6. [用戶 API](#用戶-api)
7. [排行榜 API](#排行榜-api)
8. [未來 API 整合指南](#未來-api-整合指南)

---

## 當前 Mock 資料架構

### 系統架構

```
Component → Hook → Mock Data
```

所有資料透過 Context Provider 從 `lib/mock/*.ts` 取得。

### 環境設定

**檔案**: `.env.example`

```bash
# API 設定
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=true

# YouTube API (預留)
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here
```

---

## API Client 基礎

### 基礎設定

**檔案**: `lib/api/client.ts`

```typescript
export class ApiClient {
  private baseURL: string
  private useMock: boolean

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
    this.useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    if (this.useMock) {
      return this.getMockData<T>(endpoint)
    }

    const token = this.getToken()
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new ApiError(response.status, await response.text())
    }

    return response.json()
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('token')
  }

  private getMockData<T>(endpoint: string): T {
    return mockDataMap[endpoint] as T
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string
  ) {
    super(message)
  }
}

export const apiClient = new ApiClient()
```

---

## 認證 API

### 登入

**檔案**: `lib/api/auth.ts`

```typescript
import { apiClient } from './client'
import type { User, LoginCredentials, AuthResponse } from '@/types/user'

export const authApi = {
  /**
   * 用戶登入
   * @endpoint POST /api/world/enter
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const mockUser = mockUsers.find(u => u.email === credentials.email)
    if (!mockUser) {
      throw new Error('Invalid credentials')
    }
    return {
      user: mockUser,
      token: 'mock-jwt-token',
    }
  },

  /**
   * OAuth 登入
   * @endpoint GET /api/world/enter?provider={google|facebook}
   */
  async loginWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
    console.log(`OAuth login not implemented: ${provider}`)
  },

  /**
   * 更新 Token
   * @endpoint POST /api/world:renew-token
   */
  async renewToken(): Promise<string> {
    return 'mock-jwt-token'
  },

  /**
   * 登出
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
    }
  },
}
```

---

## 課程 API

### 課程列表

**檔案**: `lib/api/journeys.ts`

```typescript
import { apiClient } from './client'
import type { Journey } from '@/types/journey'

export const journeysApi = {
  /**
   * 獲取所有課程
   * @endpoint GET /api/journeys/latest?page=0&items=100
   */
  async getAll(): Promise<Journey[]> {
    return mockJourneys
  },

  /**
   * 獲取課程 Slug 映射表
   * @endpoint GET /api/journey-slug-mapping
   */
  async getSlugMapping(): Promise<Record<string, string>> {
    return {
      'software-design-pattern': '0',
      'ai-bdd': '4',
    }
  },

  /**
   * 根據 ID 獲取課程
   * @endpoint GET /api/journeys/{journeyId}
   */
  async getById(id: number): Promise<Journey> {
    const journey = mockJourneys.find(j => j.id === id)
    if (!journey) throw new Error('Journey not found')
    return journey
  },

  /**
   * 根據 Slug 獲取課程
   */
  async getBySlug(slug: string): Promise<Journey> {
    const mapping = await this.getSlugMapping()
    const id = parseInt(mapping[slug])
    return this.getById(id)
  },

  /**
   * 獲取道館徽章
   * @endpoint GET /api/journeys/{journeyId}/gym-badges
   */
  async getGymBadges(journeyId: number): Promise<GymBadge[]> {
    return []
  },
}
```

---

## 進度追蹤 API

### 課程進度

**檔案**: `lib/api/progress.ts`

```typescript
import { apiClient } from './client'
import type { LessonProgress, VideoProgress } from '@/types/lesson'

export const progressApi = {
  /**
   * 獲取用戶所有課程進度
   * @endpoint GET /api/users/me/journeys/lessons/progresses
   */
  async getAllProgress(userId: number): Promise<LessonProgress[]> {
    return mockProgressData.filter(p => p.userId === userId)
  },

  /**
   * 獲取特定單元進度
   */
  async getLessonProgress(lessonId: number): Promise<LessonProgress | null> {
    const allProgress = await this.getAllProgress(currentUserId)
    return allProgress.find(p => p.lessonId === lessonId) || null
  },

  /**
   * 更新影片觀看進度
   * @endpoint POST /api/missions/{id}/progress
   */
  async updateProgress(
    lessonId: number,
    progress: VideoProgress
  ): Promise<void> {
    console.log(`Progress update (mock): lesson ${lessonId}`, progress)
  },

  /**
   * 交付單元 (獲得經驗值)
   * @endpoint POST /api/missions/{id}/deliver
   */
  async deliverLesson(lessonId: number): Promise<{ exp: number }> {
    const lesson = await lessonsApi.getById(lessonId)
    return { exp: lesson.reward.exp }
  },
}
```

### 自動儲存 Hook

**檔案**: `hooks/useProgress.ts`

```typescript
import { useEffect, useRef } from 'react'
import { progressApi } from '@/lib/api/progress'

/**
 * 自動儲存影片觀看進度
 */
export function useProgress(lessonId: number, enabled: boolean = true) {
  const progressRef = useRef({ currentTime: 0, duration: 0, percentage: 0 })
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!enabled) return

    intervalRef.current = setInterval(() => {
      console.log('Auto-save progress (mock)', progressRef.current)
    }, 10000) // 每 10 秒

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [lessonId, enabled])

  const updateProgress = (currentTime: number, duration: number) => {
    progressRef.current = {
      currentTime,
      duration,
      percentage: (currentTime / duration) * 100,
    }
  }

  return { updateProgress }
}
```

---

## 用戶 API

### 用戶資料

**檔案**: `lib/api/users.ts`

```typescript
import { apiClient } from './client'
import type { User } from '@/types/user'

export const usersApi = {
  /**
   * 獲取當前用戶資訊
   * @endpoint GET /api/users/me
   */
  async getMe(): Promise<User> {
    const token = localStorage.getItem('token')
    if (!token) throw new Error('Not authenticated')
    return mockCurrentUser
  },

  /**
   * 獲取用戶課程擁有狀態
   * @endpoint GET /api/users/me/journey-status
   */
  async getJourneyStatus(): Promise<{ orders: any[] }> {
    return { orders: [] }
  },

  /**
   * 獲取通知列表
   * @endpoint GET /api/users/me/notifications
   */
  async getNotifications(): Promise<any[]> {
    return []
  },

  /**
   * 獲取帳號綁定狀態
   * @endpoint GET /api/users/me/accounts/{discord|github}
   */
  async getAccountBindings(): Promise<{
    discord: boolean
    github: boolean
  }> {
    return {
      discord: false,
      github: false,
    }
  },

  /**
   * 更新用戶資料
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    throw new Error('Not implemented')
  },
}
```

---

## 排行榜 API

### 排行榜資料

**檔案**: `lib/api/leaderboard.ts`

```typescript
import { apiClient } from './client'
import type { LeaderboardEntry } from '@/types/leaderboard'

export const leaderboardApi = {
  /**
   * 獲取排行榜
   * @endpoint GET /api/users/leaderboard?page=0&items=30
   */
  async getLeaderboard(params: {
    page?: number
    items?: number
  } = {}): Promise<LeaderboardEntry[]> {
    const { page = 0, items = 30 } = params
    return mockLeaderboardData.slice(page * items, (page + 1) * items)
  },

  /**
   * 獲取當前用戶排名
   * @endpoint GET /api/users/leaderboard/me
   */
  async getMyRank(): Promise<{ rank: number; entry: LeaderboardEntry }> {
    return {
      rank: 2878,
      entry: mockCurrentUserLeaderboardEntry,
    }
  },
}
```

---

## 未來 API 整合指南

### 整合架構

未來整合真實後端 API 時，系統架構將調整為：

```
Component → Hook → Context → API Client → Backend API
```

### 整合策略

**保持介面不變**: Hook 的 API 保持一致，只替換內部實作。

**環境變數控制**: 透過 `NEXT_PUBLIC_USE_MOCK=false` 切換至真實 API。

**漸進式替換**: 逐個 API 端點替換，不影響其他功能。

### 認證整合

```typescript
// 登入 API 整合範例
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/api/world/enter', credentials)
}

// OAuth 重定向
async loginWithOAuth(provider: 'google' | 'facebook'): Promise<void> {
  window.location.href = `${API_BASE_URL}/api/world/enter?provider=${provider}`
}

// Token 續期
async renewToken(): Promise<string> {
  const response = await apiClient.post<{ token: string }>('/api/world:renew-token')
  return response.token
}
```

### 課程資料整合

```typescript
// 課程列表
async getAll(): Promise<Journey[]> {
  return apiClient.get<Journey[]>('/api/journeys/latest?page=0&items=100')
}

// 課程詳情
async getById(id: number): Promise<Journey> {
  return apiClient.get<Journey>(`/api/journeys/${id}`)
}

// Slug 查詢
async getBySlug(slug: string): Promise<Journey> {
  return apiClient.get<Journey>(`/api/journeys/slug/${slug}`)
}
```

### 進度追蹤整合

```typescript
// 獲取進度
async getAllProgress(userId: number): Promise<LessonProgress[]> {
  return apiClient.get<LessonProgress[]>('/api/users/me/journeys/lessons/progresses')
}

// 更新進度 (每 10 秒自動儲存)
async updateProgress(lessonId: number, progress: VideoProgress): Promise<void> {
  await apiClient.post(`/api/missions/${lessonId}/progress`, {
    currentTime: progress.currentTime,
    duration: progress.duration,
    percentage: progress.percentage,
  })
}

// 交付單元
async deliverLesson(lessonId: number): Promise<{ exp: number }> {
  return apiClient.post<{ exp: number }>(`/api/missions/${lessonId}/deliver`)
}
```

### 錯誤處理

```typescript
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}

export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    public status: number,
    public message: string,
    public details?: any
  ) {
    super(message)
  }
}
```

**錯誤處理策略**:

1. **401 Unauthorized**: 清除 token，重定向到登入頁
2. **403 Forbidden**: 顯示權限不足訊息，提示升級會員
3. **404 Not Found**: 顯示「資源不存在」，提供返回按鈕
4. **500 Server Error**: 顯示「伺服器錯誤」，提供重試按鈕
5. **Network Error**: 顯示「網路連線失敗」，自動重試 (最多 3 次)

### 效能優化

**資料快取**:

```typescript
import useSWR from 'swr'

export function useJourneys() {
  const { data, error, isLoading } = useSWR(
    '/api/journeys/latest',
    journeysApi.getAll,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000, // 1 分鐘內不重複請求
    }
  )

  return {
    journeys: data,
    isLoading,
    error,
  }
}
```

**請求去重**:

```typescript
const requestCache = new Map<string, Promise<any>>()

export async function dedupedRequest<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (requestCache.has(key)) {
    return requestCache.get(key)!
  }

  const promise = fn().finally(() => {
    requestCache.delete(key)
  })

  requestCache.set(key, promise)
  return promise
}
```

### 安全性考量

**Token 安全**:

建議使用 HttpOnly Cookie 存放 Token，防止 XSS 攻擊。目前使用 localStorage 僅供開發測試。

**CSRF 防護**:

```typescript
const csrfToken = document
  .querySelector('meta[name="csrf-token"]')
  ?.getAttribute('content')

fetch(url, {
  headers: {
    'X-CSRF-Token': csrfToken,
  },
})
```

**API Rate Limiting**:

```typescript
const rateLimiter = {
  requests: new Map<string, number[]>(),

  canMakeRequest(key: string, maxRequests: number, timeWindow: number): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []

    const validRequests = requests.filter(time => now - time < timeWindow)

    if (validRequests.length >= maxRequests) {
      return false
    }

    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }
}
```
