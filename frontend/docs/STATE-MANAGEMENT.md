# 狀態管理架構文檔

本文件詳細說明 Release 1 的狀態管理架構、Context 設計、資料流與整合測試。

---

## 📐 架構概覽

### Context 層級結構

```
AppProviders (app/layout.tsx)
├── ToastProvider          // 最外層 - 全域通知系統
│   └── AuthProvider       // 認證狀態管理
│       └── JourneyProvider    // 課程與進度管理
│           └── LeaderboardProvider  // 排行榜資料管理
│               └── children (頁面內容)
```

### 設計原則

1. **單向資料流**: 資料從 Context → Component，狀態更新透過 Context 提供的方法
2. **關注點分離**: 每個 Context 只負責特定領域的狀態
3. **Provider 嵌套順序**: 根據依賴關係排列，被依賴的在外層
4. **性能優化**: 使用 useMemo/useCallback 避免不必要的重渲染

---

## 🔐 AuthContext - 認證狀態管理

### 職責

- 用戶登入/登出
- 用戶資訊存儲
- 認證狀態檢查
- localStorage 持久化

### 狀態

```typescript
interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (lineToken?: string) => Promise<void>
  logout: () => Promise<void>
}
```

### 資料流

```
頁面載入
  ↓
檢查 localStorage (userId)
  ↓
載入用戶資料 (Mock: currentUser)
  ↓
設置 user 狀態
  ↓
isAuthenticated = true
```

### 使用範例

```typescript
// 在任何元件中
const { user, isAuthenticated, login, logout } = useAuth()

// 登入
await login('mock-line-token')

// 登出
await logout()

// 檢查認證狀態
if (!isAuthenticated) {
  router.push('/sign-in')
}
```

### 整合頁面

- ✅ `/sign-in` - 登入頁面
- ✅ `/` - 首頁 (顯示登入狀態)
- ✅ `/users/me/profile` - 個人檔案 (需要認證)
- ✅ `/journeys/[id]` - 課程詳情 (顯示權限提示)
- ✅ `/journeys/[id]/chapters/[id]/missions/[id]` - 單元頁面 (需要認證)
- ✅ `/leaderboard` - 排行榜 (顯示當前用戶)

### R1 特性

- Mock 登入 (測試帳號)
- localStorage 存儲 userId
- 自動載入用戶資料
- LINE Login UI (按鈕存在但未連接)

### R2 準備

```typescript
// R2 TODO: 實作真實 LINE Login
const login = async (lineToken: string) => {
  const response = await authAPI.login(lineToken)
  setUser(response.data.user)
  localStorage.setItem('accessToken', response.data.accessToken)
}
```

**檔案位置**: `frontend/contexts/AuthContext.tsx`

---

## 🎓 JourneyContext - 課程與進度管理

### 職責

- 課程列表載入
- 課程詳情載入
- 學習進度追蹤
- 單元繳交
- 章節解鎖

### 狀態

```typescript
interface JourneyContextValue {
  journeys: Journey[]
  currentJourney: Journey | null
  progressMap: Record<number, LessonProgress>
  isLoading: boolean
  loadJourneys: () => Promise<void>
  loadJourney: (journeyId: number) => Promise<void>
  updateProgress: (lessonId: number, progress: Partial<LessonProgress>) => Promise<void>
  submitLesson: (lessonId: number) => Promise<void>
  unlockChapter: (chapterId: number, password: string) => Promise<boolean>
  checkAccess: (journeyId: number) => boolean
}
```

### 資料流

```
loadJourneys()
  ↓
從 Mock 載入課程列表
  ↓
設置 journeys 狀態
  ↓
loadJourney(id)
  ↓
載入單一課程詳情
  ↓
設置 currentJourney
  ↓
載入該課程的進度
  ↓
設置 progressMap
```

### 進度追蹤流程

```
用戶觀看影片
  ↓
VideoPlayer onProgress 回調
  ↓
updateProgress(lessonId, { percentage, currentTime })
  ↓
更新 progressMap[lessonId]
  ↓
localStorage 持久化
  ↓
影片看完 → onComplete
  ↓
updateProgress(lessonId, { completed: true, percentage: 100 })
```

### 單元繳交流程

```
用戶點擊「繳交單元」
  ↓
submitLesson(lessonId)
  ↓
檢查 completed 狀態
  ↓
標記 delivered = true
  ↓
顯示獲得 EXP Toast
  ↓
自動跳轉下一個單元
```

### 使用範例

```typescript
// 載入課程列表
const { journeys, loadJourneys } = useJourney()
useEffect(() => { loadJourneys() }, [])

// 載入課程詳情
const { currentJourney, loadJourney, progressMap } = useJourney()
useEffect(() => { loadJourney(journeyId) }, [journeyId])

// 更新進度
await updateProgress(lessonId, {
  currentTime: 120,
  duration: 300,
  percentage: 40,
})

// 繳交單元
await submitLesson(lessonId)

// 解鎖章節
const unlocked = await unlockChapter(chapterId, password)
```

### 整合頁面

- ✅ `/` - 首頁 (顯示課程列表)
- ✅ `/courses` - 課程列表頁
- ✅ `/journeys/[id]` - 課程詳情頁
- ✅ `/journeys/[id]/chapters/[id]/missions/[id]` - 單元頁面

### 依賴關係

- **依賴 AuthContext**: 需要 user 資訊來載入進度
- **被 LeaderboardContext 依賴**: 排行榜需要課程完成資料

### R1 特性

- Mock 課程資料
- localStorage 存儲進度
- 自動進度追蹤
- 密碼解鎖章節

### R2 準備

```typescript
// R2 TODO: 實作真實 API
const loadJourneys = async () => {
  const response = await journeysAPI.getJourneys()
  setJourneys(response.data)
}

const updateProgress = async (lessonId: number, progress: Partial<LessonProgress>) => {
  await lessonsAPI.updateProgress(lessonId, progress)
  setProgressMap(prev => ({ ...prev, [lessonId]: { ...prev[lessonId], ...progress } }))
}
```

**檔案位置**: `frontend/contexts/JourneyContext.tsx`

---

## 🏆 LeaderboardContext - 排行榜資料管理

### 職責

- 排行榜資料載入
- 排行榜篩選 (全球/週/月)
- 排序方式切換
- 搜尋功能
- 當前用戶排名

### 狀態

```typescript
interface LeaderboardContextValue {
  entries: LeaderboardEntry[]
  topThree: LeaderboardEntry[]
  userRank: LeaderboardEntry | null
  type: LeaderboardType
  timeRange: TimeRange
  sortBy: SortBy
  search: string
  isLoading: boolean

  loadLeaderboard: () => Promise<void>
  setType: (type: LeaderboardType) => void
  setTimeRange: (range: TimeRange) => void
  setSortBy: (sortBy: SortBy) => void
  setSearch: (query: string) => void
}
```

### 資料流

```
loadLeaderboard()
  ↓
根據篩選條件從 Mock 載入
  ↓
設置 entries (所有排名)
  ↓
計算 topThree (前三名)
  ↓
計算 userRank (當前用戶排名)
```

### 篩選流程

```
setType(LeaderboardType.WEEKLY)
  ↓
觸發 useEffect
  ↓
loadLeaderboard()
  ↓
重新載入資料
```

### 使用範例

```typescript
// 載入排行榜
const { entries, topThree, userRank, loadLeaderboard } = useLeaderboard()
useEffect(() => { loadLeaderboard() }, [])

// 切換篩選
const { setType, setTimeRange, setSortBy } = useLeaderboard()
setType(LeaderboardType.WEEKLY)
setTimeRange(TimeRange.THIS_WEEK)
setSortBy(SortBy.TOTAL_EXP)

// 搜尋
const { setSearch } = useLeaderboard()
setSearch('水球')
```

### 整合頁面

- ✅ `/leaderboard` - 排行榜頁面

### 依賴關係

- **依賴 AuthContext**: 需要 user.id 來找出當前用戶排名
- **依賴 JourneyContext**: (未來) 排名計算可能需要課程完成資料

### R1 特性

- Mock 排行榜資料
- 客戶端篩選與搜尋
- 自動計算當前用戶排名

### R2 準備

```typescript
// R2 TODO: 實作真實 API
const loadLeaderboard = async () => {
  const response = await leaderboardAPI.getLeaderboard(type, timeRange, sortBy)
  setEntries(response.data.entries)
}
```

**檔案位置**: `frontend/contexts/LeaderboardContext.tsx`

---

## 🔔 ToastContext - 全域通知系統

### 職責

- 顯示成功/錯誤/警告/資訊通知
- 自動關閉通知
- 通知堆疊管理

### 狀態

```typescript
interface ToastContextValue {
  toasts: ToastMessage[]
  showToast: (type: ToastType, message: string, duration?: number) => void
  hideToast: (id: string) => void
  success: (message: string, duration?: number) => void
  error: (message: string, duration?: number) => void
  warning: (message: string, duration?: number) => void
  info: (message: string, duration?: number) => void
}
```

### 使用範例

```typescript
const { success, error } = useToast()

// 成功通知
success('登入成功！')

// 錯誤通知
error('登入失敗，請稍後再試')

// 自訂持續時間
success('繳交成功！', 5000)
```

### 整合範例

```typescript
// 在 AuthContext 中
const login = async (lineToken?: string) => {
  try {
    // ... 登入邏輯
    success('登入成功！')
  } catch (err) {
    error('登入失敗')
  }
}

// 在 JourneyContext 中
const submitLesson = async (lessonId: number) => {
  try {
    // ... 繳交邏輯
    success(`單元繳交成功！獲得 ${lesson.reward.exp} EXP`)
  } catch (err) {
    error('繳交失敗')
  }
}
```

### 特性

- 自動關閉 (預設 3 秒)
- 多個通知堆疊顯示
- 4 種通知類型 (success/error/warning/info)

**檔案位置**: `frontend/contexts/ToastContext.tsx`

---

## 🔄 Context 整合測試

### 測試場景 1: 用戶登入流程

```
1. 用戶訪問 /sign-in
   ✓ AuthContext.isAuthenticated = false

2. 用戶點擊「使用測試帳號登入」
   ✓ AuthContext.login() 被呼叫

3. 登入成功
   ✓ AuthContext.user 被設置
   ✓ AuthContext.isAuthenticated = true
   ✓ ToastContext.success('登入成功') 被呼叫
   ✓ 重導向到首頁

4. 首頁載入
   ✓ AuthContext.user 存在
   ✓ Navbar 顯示用戶頭像和名稱
```

### 測試場景 2: 課程學習流程

```
1. 用戶訪問課程列表 /courses
   ✓ JourneyContext.loadJourneys() 被呼叫
   ✓ JourneyContext.journeys 被設置
   ✓ 課程卡片正確渲染

2. 用戶點擊課程
   ✓ 重導向到 /journeys/[id]
   ✓ JourneyContext.loadJourney(id) 被呼叫
   ✓ JourneyContext.currentJourney 被設置
   ✓ JourneyContext.progressMap 被載入

3. 用戶點擊單元
   ✓ 重導向到單元頁面
   ✓ 影片播放器載入

4. 用戶觀看影片
   ✓ VideoPlayer.onProgress 定期回調
   ✓ JourneyContext.updateProgress() 被呼叫
   ✓ progressMap 被更新
   ✓ localStorage 被更新

5. 用戶看完影片
   ✓ VideoPlayer.onComplete 被呼叫
   ✓ JourneyContext.updateProgress({ completed: true })
   ✓ ToastContext.success('影片已看完')

6. 用戶點擊「繳交單元」
   ✓ JourneyContext.submitLesson() 被呼叫
   ✓ progressMap[lessonId].delivered = true
   ✓ ToastContext.success('單元繳交成功！獲得 X EXP')
   ✓ 自動跳轉下一個單元
```

### 測試場景 3: 排行榜查看流程

```
1. 用戶訪問 /leaderboard
   ✓ AuthContext.user 存在
   ✓ LeaderboardContext.loadLeaderboard() 被呼叫
   ✓ LeaderboardContext.entries 被設置

2. 計算當前用戶排名
   ✓ LeaderboardContext.userRank 被設置
   ✓ 當前用戶排名卡片顯示

3. 用戶切換篩選
   ✓ LeaderboardContext.setType(WEEKLY)
   ✓ loadLeaderboard() 被重新呼叫
   ✓ entries 被更新

4. 用戶搜尋
   ✓ LeaderboardContext.setSearch('水球')
   ✓ entries 被篩選
   ✓ 只顯示符合條件的用戶
```

### 測試場景 4: 錯誤處理流程

```
1. 網路錯誤
   ✓ API 呼叫失敗
   ✓ ToastContext.error('載入失敗') 被呼叫
   ✓ 錯誤訊息顯示給用戶

2. 未認證訪問保護頁面
   ✓ AuthContext.isAuthenticated = false
   ✓ 重導向到 /sign-in
   ✓ ToastContext.warning('請先登入') (可選)

3. 無權限訪問 Premium 課程
   ✓ JourneyContext.checkAccess() = false
   ✓ 顯示 Premium 提示卡片
   ✓ 「升級至 Premium」按鈕顯示
```

---

## 📊 狀態持久化

### localStorage 使用

```typescript
// AuthContext
localStorage.setItem('userId', user.id.toString())
localStorage.getItem('userId')
localStorage.removeItem('userId')

// JourneyContext
localStorage.setItem(`progress_${lessonId}`, JSON.stringify(progress))
localStorage.getItem(`progress_${lessonId}`)
```

### 資料格式

```typescript
// 用戶 ID
localStorage['userId'] = "1"

// 課程進度
localStorage['progress_101'] = JSON.stringify({
  userId: 1,
  lessonId: 101,
  currentTime: 120,
  duration: 300,
  percentage: 40,
  completed: false,
  delivered: false,
  lastUpdated: 1703123456789
})
```

### 跨分頁同步

```typescript
// useLocalStorage hook 支援跨分頁同步
window.addEventListener('storage', handleStorageChange)
window.addEventListener('local-storage', handleStorageChange)
```

---

## 🚀 性能優化

### useMemo 使用

```typescript
// JourneyContext
const progressMap = useMemo(() => {
  // 計算進度映射
}, [currentJourney, user])

// LeaderboardContext
const topThree = useMemo(() => {
  return entries.slice(0, 3)
}, [entries])
```

### useCallback 使用

```typescript
// AuthContext
const login = useCallback(async (lineToken?: string) => {
  // 登入邏輯
}, [])

// ToastContext
const showToast = useCallback((type, message, duration) => {
  // 顯示通知
}, [])
```

### 避免不必要的重渲染

- 使用 React.memo 包裝純展示元件
- Context value 使用 useMemo 包裹
- 回調函數使用 useCallback

---

## 🔧 除錯技巧

### 查看 Context 狀態

```typescript
// 在任何元件中
const { user, isAuthenticated } = useAuth()
console.log('Auth State:', { user, isAuthenticated })

const { journeys, progressMap } = useJourney()
console.log('Journey State:', { journeys, progressMap })
```

### localStorage 檢查

```typescript
// 在瀏覽器 Console
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key))
})
```

### React DevTools

1. 安裝 React Developer Tools 擴充功能
2. 在 Components 分頁查看 Context 值
3. 在 Profiler 分頁檢查性能

---

## ✅ 驗證檢查清單

### AuthContext
- [ ] 登入功能正常
- [ ] 登出功能正常
- [ ] localStorage 正確存儲 userId
- [ ] 頁面重新整理後用戶狀態保持
- [ ] 未認證用戶無法訪問保護頁面

### JourneyContext
- [ ] 課程列表正確載入
- [ ] 課程詳情正確載入
- [ ] 進度追蹤正常運作
- [ ] 單元繳交功能正常
- [ ] 章節解鎖功能正常
- [ ] localStorage 正確存儲進度

### LeaderboardContext
- [ ] 排行榜正確載入
- [ ] 篩選功能正常
- [ ] 搜尋功能正常
- [ ] 當前用戶排名正確計算

### ToastContext
- [ ] 成功通知正確顯示
- [ ] 錯誤通知正確顯示
- [ ] 自動關閉功能正常
- [ ] 多個通知堆疊正確

### 整合測試
- [ ] 登入後課程列表自動載入
- [ ] 進度追蹤與排行榜資料一致
- [ ] 所有錯誤都有對應的 Toast 通知
- [ ] 跨分頁狀態同步正常

---

## 📝 後續改進 (R2)

### AuthContext
- 實作真實 LINE Login API
- 實作 JWT token 管理
- 實作 refresh token 機制
- 加入 token 過期處理

### JourneyContext
- 實作真實課程 API
- 實作即時進度同步
- 加入衝突解決機制
- 實作離線模式

### LeaderboardContext
- 實作伺服器端排行榜 API
- 實作即時排名更新 (WebSocket)
- 加入分頁載入
- 實作排名變化動畫

### 通用改進
- 加入狀態持久化框架 (如 Zustand persist)
- 實作 optimistic updates
- 加入錯誤重試機制
- 實作請求去重與快取

---

## 📚 相關文檔

- [Component Library Guide](./component-library-guide.md)
- [API Client Documentation](../lib/api/README.md)
- [Testing Checklist](./testing-checklist.md)
- [RWD Guide](./RWD-GUIDE.md)
