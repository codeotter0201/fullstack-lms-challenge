# API Client 架構文檔

本文件說明 API Client 的架構、使用方式，以及 R1/R2 階段的差異。

## 📋 目錄

1. [架構概覽](#架構概覽)
2. [API 模組](#api-模組)
3. [使用方式](#使用方式)
4. [R1/R2 差異](#r1r2-差異)
5. [錯誤處理](#錯誤處理)
6. [開發指南](#開發指南)

---

## 架構概覽

### 檔案結構

```
lib/api/
├── client.ts          # 核心 HTTP 客戶端
├── auth.ts            # 認證 API
├── journeys.ts        # 課程 API
├── lessons.ts         # 單元 API
├── users.ts           # 用戶 API
├── leaderboard.ts     # 排行榜 API
├── index.ts           # 統一導出
└── README.md          # 本文件
```

### 核心設計原則

1. **統一的請求封裝**：所有 HTTP 請求通過 `apiClient` 進行
2. **R1/R2 架構**：R1 返回 Mock 資料，R2 整合真實 API
3. **TypeScript 型別安全**：所有 API 都有完整的型別定義
4. **錯誤處理**：統一的錯誤處理機制
5. **認證整合**：自動加入 Bearer Token

---

## API 模組

### 1. Auth API (`auth.ts`)

認證相關功能。

```typescript
import { login, logout, refreshToken, verifyToken } from '@/lib/api'

// 登入
const result = await login('line-token-123')

// 登出
await logout()

// 重新整理 Token
await refreshToken('refresh-token-123')

// 驗證 Token
const { valid } = await verifyToken()
```

### 2. Journeys API (`journeys.ts`)

課程相關功能。

```typescript
import { getJourneys, getJourney, getJourneyProgress, unlockChapter } from '@/lib/api'

// 獲取所有課程
const { data } = await getJourneys()

// 獲取單一課程
const { data } = await getJourney(1)

// 獲取課程進度
const { data } = await getJourneyProgress(1, userId)

// 解鎖章節
await unlockChapter(chapterId, 'password123')
```

### 3. Lessons API (`lessons.ts`)

課程單元相關功能。

```typescript
import { getLesson, updateProgress, submitLesson, completeLesson } from '@/lib/api'

// 獲取單元詳情
const { data } = await getLesson(lessonId)

// 更新進度
await updateProgress(lessonId, userId, {
  watchedSeconds: 120,
  progress: 50,
})

// 繳交單元
const { data } = await submitLesson(lessonId, userId)

// 標記為完成
await completeLesson(lessonId)
```

### 4. Users API (`users.ts`)

用戶相關功能。

```typescript
import { getCurrentUser, getUser, updateUser, getUserStats } from '@/lib/api'

// 獲取當前用戶
const { data } = await getCurrentUser()

// 獲取指定用戶
const { data } = await getUser(userId)

// 更新用戶資訊
await updateUser(userId, {
  nickname: '新暱稱',
  bio: '自我介紹',
})

// 獲取統計資訊
const { data } = await getUserStats(userId)
```

### 5. Leaderboard API (`leaderboard.ts`)

排行榜相關功能。

```typescript
import { fetchLeaderboard, fetchUserRank, fetchTopRankers } from '@/lib/api'

// 獲取排行榜
const { data } = await fetchLeaderboard(
  LeaderboardType.GLOBAL,
  LeaderboardTimeRange.ALL_TIME,
  LeaderboardSortBy.EXP
)

// 獲取用戶排名
const { data } = await fetchUserRank(userId, LeaderboardType.GLOBAL)

// 獲取前 N 名
const { data } = await fetchTopRankers(3)
```

---

## 使用方式

### 基本用法

```typescript
import { apiClient } from '@/lib/api'

// GET 請求
const response = await apiClient.get('/endpoint', { param1: 'value1' })

// POST 請求
const response = await apiClient.post('/endpoint', { key: 'value' })

// PUT 請求
const response = await apiClient.put('/endpoint', { key: 'value' })

// PATCH 請求
const response = await apiClient.patch('/endpoint', { key: 'value' })

// DELETE 請求
const response = await apiClient.delete('/endpoint')
```

### 在 Context 中使用

```typescript
// contexts/AuthContext.tsx
import { login as apiLogin, logout as apiLogout } from '@/lib/api'

const login = async (lineToken: string) => {
  try {
    const response = await apiLogin(lineToken)
    setUser(response.data.user)
    localStorage.setItem('accessToken', response.data.accessToken)
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}
```

### 在元件中使用

```typescript
// 通常不直接在元件中呼叫 API
// 應該透過 Context 或 Custom Hook

import { useAuth } from '@/contexts'

function LoginPage() {
  const { login, isLoading } = useAuth()

  const handleLogin = async () => {
    await login('line-token')
  }

  return <Button onClick={handleLogin} loading={isLoading}>登入</Button>
}
```

---

## R1/R2 差異

### R1 階段（當前）

- **目的**：快速開發 UI，使用 Mock 資料
- **特點**：
  - 所有 API 函數返回 Mock 資料
  - 模擬網路延遲（200-500ms）
  - 不發送真實 HTTP 請求
  - 資料來自 `lib/mock/` 目錄

```typescript
// R1: 返回 Mock 資料
export async function getJourneys(): Promise<GetJourneysResponse> {
  await new Promise(resolve => setTimeout(resolve, 300)) // 模擬延遲

  return {
    success: true,
    data: {
      journeys, // 來自 Mock 資料
      total: journeys.length,
    },
  }
}
```

### R2 階段（未來）

- **目的**：整合真實後端 API
- **特點**：
  - 發送真實 HTTP 請求
  - 使用 `apiClient` 進行請求
  - 需要配置 `NEXT_PUBLIC_API_BASE_URL`
  - 處理真實的錯誤回應

```typescript
// R2: 真實 API 呼叫
export async function getJourneys(): Promise<GetJourneysResponse> {
  return apiClient.get<GetJourneysResponse>('/journeys')
}
```

### 切換到 R2

1. 移除 Mock 資料返回邏輯
2. 取消註解真實 API 呼叫代碼
3. 配置環境變數 `NEXT_PUBLIC_API_BASE_URL`
4. 測試所有 API 端點
5. 更新錯誤處理邏輯

---

## 錯誤處理

### API 錯誤類型

```typescript
interface ApiError {
  code: string
  message: string
  details?: any
}

class ApiClientError extends Error {
  statusCode?: number
  error?: ApiError
}
```

### 捕獲錯誤

```typescript
try {
  const response = await getJourneys()
  console.log(response.data)
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message)
    console.error('Status Code:', error.statusCode)
    console.error('Error Details:', error.error)
  } else {
    console.error('Unknown Error:', error)
  }
}
```

### 常見錯誤碼

- `AUTH_REQUIRED`: 需要認證
- `INVALID_TOKEN`: Token 無效或過期
- `NOT_FOUND`: 資源不存在
- `PERMISSION_DENIED`: 權限不足
- `VALIDATION_ERROR`: 驗證失敗
- `SERVER_ERROR`: 伺服器錯誤

---

## 開發指南

### 新增 API 端點

1. 在對應的 API 模組中新增函數
2. 定義 TypeScript 型別（`types/api.ts`）
3. R1 階段返回 Mock 資料
4. R2 階段預留真實 API 呼叫代碼

```typescript
/**
 * 新增功能說明
 */
export async function newFunction(param: string): Promise<ResponseType> {
  // R1: Mock 資料
  await new Promise(resolve => setTimeout(resolve, 300))

  return {
    success: true,
    data: mockData,
  }

  // R2 TODO: 真實 API 呼叫
  // return apiClient.get<ResponseType>('/endpoint', { param })
}
```

### 測試建議

1. 測試 R1 Mock 資料是否正確
2. 測試錯誤處理邏輯
3. 測試認證 Token 整合
4. 測試請求參數序列化
5. 準備 R2 真實 API 測試案例

### 最佳實踐

1. **不要在元件中直接呼叫 API**：使用 Context 或 Custom Hook
2. **統一錯誤處理**：在 Context 層級處理錯誤
3. **載入狀態管理**：使用 `isLoading` 狀態
4. **快取策略**：考慮使用 SWR 或 React Query（R2）
5. **類型安全**：所有 API 呼叫都有型別定義

---

## 環境變數

### R1 階段

```env
# .env.local
# R1 不需要配置（使用 Mock 資料）
```

### R2 階段

```env
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# 生產環境
# NEXT_PUBLIC_API_BASE_URL=https://api.example.com
```

---

## 疑難排解

### Q1: API 呼叫沒有返回資料？

**A**: R1 階段確認 Mock 資料是否正確，R2 階段檢查網路請求和後端狀態。

### Q2: 認證 Token 沒有自動加入？

**A**: 確認 `localStorage` 中有 `accessToken`，且 `apiClient` 的 `buildHeaders` 函數正常運作。

### Q3: 如何處理 Token 過期？

**A**: 使用 `refreshToken` 函數重新獲取 Token，或導向登入頁面。

### Q4: Mock 資料與真實 API 格式不一致？

**A**: 更新 Mock 資料以符合真實 API 格式，或更新型別定義。

---

## 相關文件

- [TypeScript 型別定義](../../types/api.ts)
- [Mock 資料文檔](../mock/)
- [Context Providers 文檔](../../contexts/)
- [Release 1 計畫](../../../../docs/release-1-mvp.md)
