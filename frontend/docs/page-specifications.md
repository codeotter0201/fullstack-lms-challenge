# 頁面規格文檔

本文件詳細定義所有頁面的結構、功能、使用元件與資料需求。

---

## 目錄

1. [首頁](#首頁)
2. [認證頁面](#認證頁面)
3. [課程相關頁面](#課程相關頁面)
4. [用戶相關頁面](#用戶相關頁面)
5. [其他頁面](#其他頁面)

---

## 首頁

**路由**: `/`

**檔案路徑**: `app/page.tsx`

**佈局**: MainLayout (Navbar + Footer)

### 頁面結構

```
[Navbar]

[課程選擇器 + 前往挑戰地圖按鈕]

[促銷橫幅]
「將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！」

[歡迎區塊]
  標題: 「歡迎來到水球軟體學院」
  描述: 平台介紹文案
  [課程卡片區塊]
    - 軟體設計模式精通之旅 (選中狀態，黃色邊框)
    - AI x BDD：規格驅動全自動開發術

[特色區塊 - 4個卡片]
  1. 軟體設計模式之旅課程
  2. 水球潘的部落格
  3. 直接與老師或其他工程師交流
  4. 技能評級及證書系統

[創辦人介紹區塊]
  - 水球潘照片
  - 個人介紹
  - 5 個成就標籤

[Footer]
```

### 使用元件

- `CourseCard` x2
- `Card` x4 (特色區塊)
- `Button` (多個 CTA)
- `Badge` (成就標籤)

### 資料需求

```typescript
// 從 mock 資料載入
const journeys = await getJourneys() // 2門課程
const user = await getUser() // 當前用戶 (可能為 null)
```

### 互動行為

1. **課程卡片切換**: 點擊課程卡片，切換選中狀態（黃色邊框高亮）
2. **立刻體驗按鈕**: 跳轉到該課程的體驗單元
3. **立刻購買按鈕**: 跳轉到課程購買頁（R1 僅外觀）
4. **查看課程連結**: 跳轉到課程詳情頁
5. **部落格連結**: 外部連結到 blog.waterballsa.tw
6. **社群連結**: 外部連結到 Facebook、Discord 等

### 響應式設計

- **Desktop**: 課程卡片橫向排列，特色區塊 2x2 網格
- **Tablet**: 課程卡片橫向排列，特色區塊垂直堆疊
- **Mobile**: 所有內容垂直堆疊

### 參考截圖

`docs/screenshots/homepage-full.png`

---

## 認證頁面

### 登入頁

**路由**: `/sign-in`

**檔案路徑**: `app/(auth)/sign-in/page.tsx`

**佈局**: AuthLayout (簡化版，無 Sidebar)

#### 頁面結構

```
[簡化 Navbar - 僅 Logo]

[居中內容區]
  [LoginForm 元件]
    - Email 輸入框
    - Password 輸入框
    - 忘記密碼連結
    - 登入按鈕
    - 分隔線
    - 使用 Google 登入按鈕 (R1 僅 UI)
    - 使用 Facebook 登入按鈕 (R1 僅 UI)

  [註冊連結]
  「還沒有帳號？立即註冊」

[Footer]
```

#### 使用元件

- `LoginForm`
- `Input` x2
- `Button` x3

#### 功能 (R1)

- **表單驗證**: 前端驗證 Email 格式
- **錯誤顯示**: 顯示錯誤訊息（紅色文字）
- **登入按鈕**: 僅 UI，點擊後使用 mock 資料設定登入狀態
- **OAuth 按鈕**: 僅 UI，點擊無反應，添加 TODO 註解

#### 資料流程 (預留)

```typescript
// TODO: 整合真實 API
const handleLogin = async (credentials: LoginCredentials) => {
  // Mock 實作
  const mockUser = mockUsers.find(u => u.email === credentials.email)
  if (mockUser) {
    setUser(mockUser)
    localStorage.setItem('token', 'mock-jwt-token')
    router.push('/')
  }
}
```

---

## 課程相關頁面

### 課程列表頁

**路由**: `/courses`

**檔案路徑**: `app/(main)/courses/page.tsx`

**佈局**: MainLayout (Navbar + Footer，無 Sidebar)

#### 頁面結構

```
[Navbar]

[課程選擇器 + 通知按鈕 + 用戶頭像]

[課程網格]
  [CourseCard] - 軟體設計模式精通之旅
    - 擁有狀態: 尚未擁有
    - 折價券提示: 你有一張 3,000 折價券
    - 按鈕: [試聽課程] [立刻購買]

  [CourseCard] - AI x BDD
    - 擁有狀態: 尚未擁有
    - 按鈕: [僅限付費 (disabled)] [立刻購買]

[訂單紀錄區塊]
  圖示 + 標題: 「訂單紀錄」
  內容: 「目前沒有訂單記錄」

[Footer]
```

#### 使用元件

- `CourseCard` x2
- `Card` (訂單紀錄)
- `Badge` (擁有狀態)

#### 資料需求

```typescript
const journeys = await getJourneys()
const user = await getUser()
const userStatus = await getUserJourneyStatus(user.id) // 課程擁有狀態
const orders = await getUserOrders(user.id) // 訂單記錄
```

#### 功能

- **試聽課程**: 跳轉到試聽單元
- **立刻購買**: 跳轉到購買頁（R1 僅外觀）
- **訂單記錄**: 顯示用戶訂單列表（R1 顯示空狀態）

---

### 課程詳情頁 (所有單元)

**路由**: `/journeys/[journeySlug]`

**檔案路徑**: `app/journeys/[journeySlug]/page.tsx`

**佈局**: MainLayout (Navbar + Footer，無 Sidebar)

#### 頁面結構

```
[Navbar]

[課程選擇器 + 前往挑戰地圖 + 通知 + 用戶頭像]

[促銷橫幅] (如果有折價券)

[主內容區 - 分左右兩欄]

[左欄 - 課程資訊]
  [CourseHeader]
    - 課程標題
    - 課程描述 (3段文字)
    - 課程資訊標籤 (49部影片、大量實戰題)
    - CTA 按鈕: [立即加入課程] [預約 1v1 諮詢]

  [ChapterList - Accordion]
    章節 0: 課程介紹＆試聽 (預設展開)
      - 單元 1: 影片 (08:33)
      - 單元 2: 影片 (12:45)
      ...
    章節 1: 副本零：冒險者指引 (收合)
    章節 2: 副本一：行雲流水的設計底層思路 (收合)
    ...

[右欄 - 課程證書卡片]
  [CourseCertificate]
    - 證書圖片
    - 「課程證書」標題
    - [立即加入課程] 按鈕
    - 課程特色標籤:
      - 中文課程
      - 支援行動裝置
      - 專業的完課認證

[Footer]
```

#### 使用元件

- `CourseHeader`
- `ChapterList`
- `LessonItem` (多個)
- `CourseCertificate`
- `Button`
- `Badge`

#### 資料需求

```typescript
const journey = await getJourneyBySlug(params.journeySlug)
const user = await getUser()
const progress = await getUserProgress(user.id, journey.id)
```

#### 互動行為

1. **章節展開/收合**: 點擊章節標題切換展開狀態
2. **單元點擊**: 跳轉到該單元頁面
3. **鎖定單元**: 免費用戶點擊付費單元時顯示 Paywall
4. **立即加入課程**: 跳轉到購買頁（R1 僅外觀）

#### 響應式設計

- **Desktop**: 左右兩欄佈局
- **Tablet/Mobile**: 單欄佈局，右側卡片移到底部

---

### 課程單元頁 (影片觀看)

**路由**: `/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]`

**檔案路徑**: `app/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]/page.tsx`

**佈局**: MainLayout (Navbar + Sidebar)

#### 頁面結構

```
[Navbar]

[Sidebar - 章節導航]
  章節列表
  單元列表 (顯示完成狀態)

[主內容區]
  [課程選擇器]

  [促銷橫幅]

  [VideoPlayer 區塊]
    - YouTube 影片占位區域 (16:9)
    - 付費鎖定遮罩 (免費用戶)

  [單元資訊]
    - 單元標題
    - 單元描述

  [VideoProgress 進度條]
    - 顯示觀看進度百分比
    - 自動更新 (預留)

  [LessonComplete 交付按鈕]
    - 完成 100% 後顯示小圈圈 ○
    - 點擊交付後變成 ✓
    - 顯示 Toast: "獲得 200 EXP!"

[Footer]
```

#### 使用元件

- `Sidebar`
- `VideoPlayer`
- `VideoProgress`
- `LessonComplete`
- `PaywallOverlay` (免費用戶)
- `Toast` (交付成功)

#### 資料需求

```typescript
const journey = await getJourneyBySlug(params.journeySlug)
const lesson = await getLesson(params.lessonId)
const progress = await getLessonProgress(user.id, params.lessonId)
const hasAccess = checkUserAccess(user, lesson) // 檢查付費權限
```

#### 功能 (R1)

1. **影片播放器**:
   - 顯示占位區域
   - 預留 YouTube IFrame API 整合接口
   - TODO 註解說明

2. **進度追蹤** (預留):
   ```typescript
   // TODO: 整合真實 API
   const updateProgress = async (progress: number) => {
     // 每 10 秒自動發送進度更新
     await api.lessons.updateProgress(lessonId, progress)
   }
   ```

3. **斷點續播** (預留):
   ```typescript
   // TODO: 載入上次觀看位置
   const initialProgress = progress?.currentTime || 0
   ```

4. **單元交付**:
   ```typescript
   const handleDeliver = async () => {
     // Mock 實作
     setDelivered(true)
     updateUserExp(user.id, lesson.reward.exp)
     showToast(`獲得 ${lesson.reward.exp} EXP!`)
   }
   ```

5. **付費鎖定**:
   - 免費用戶看到 PaywallOverlay
   - 付費用戶正常觀看

#### 響應式設計

- **Desktop**: Sidebar 固定左側，影片區域佔主要空間
- **Tablet**: Sidebar 可收合
- **Mobile**: Sidebar 變成抽屜，影片全寬顯示

---

### 課程其他頁面 (占位)

#### 獎勵任務頁

**路由**: `/journeys/[journeySlug]/missions`

**內容**: 「即將推出」占位頁面

#### 挑戰地圖頁

**路由**: `/journeys/[journeySlug]/roadmap`

**內容**: 「即將推出」占位頁面

#### SOP 寶典頁

**路由**: `/journeys/[journeySlug]/sop`

**內容**: 「即將推出」占位頁面

**佔位頁面結構**:
```
[Navbar]
[Sidebar]

[主內容區]
  [圖示]
  標題: 「即將推出」
  描述: 「此功能將在 Release 2/3 推出」
  [返回課程按鈕]

[Footer]
```

---

## 用戶相關頁面

### 排行榜頁

**路由**: `/leaderboard`

**檔案路徑**: `app/(main)/leaderboard/page.tsx`

**佈局**: MainLayout (Navbar + Footer，無 Sidebar)

#### 頁面結構

```
[Navbar]

[課程選擇器 + 通知 + 用戶頭像]

[Tabs]
  - 學習排行榜 (選中)
  - 本週成長榜

[LeaderboardTable]
  30 筆 LeaderboardEntry:
    1. [排名 1] [頭像] Elliot - 初級工程師  Lv.19  31040 EXP
    2. [排名 2] [頭像] 精靈Ken Lin - 初級工程師  Lv.18  29130 EXP
    ...
    30. [排名 30] [頭像] SORA - 初級工程師  Lv.11  16041 EXP

[UserRankCard - 固定底部]
  你的排名: #2878
  [頭像] [用戶名]  Lv.1  0 EXP

[Footer]
```

#### 使用元件

- `Tabs`
- `LeaderboardTable`
- `LeaderboardEntry` x30
- `UserRankCard`
- `Avatar`
- `Badge` (職業標籤)

#### 資料需求

```typescript
const leaderboard = await getLeaderboard({ page: 0, items: 30 })
const user = await getUser()
const myRank = await getMyRank(user.id)
```

#### 功能

1. **Tab 切換**:
   - R1 僅「學習排行榜」有資料
   - 「本週成長榜」顯示空狀態

2. **排行榜載入**:
   - 初始載入 30 筆
   - R1 不實作無限滾動

3. **當前用戶高亮**:
   - 如果當前用戶在列表中，背景高亮

4. **點擊用戶**:
   - R1 不實作，預留 TODO 註解
   - R2 跳轉到用戶個人頁面

#### 響應式設計

- **Desktop**: 完整顯示所有欄位
- **Tablet**: 縮減間距
- **Mobile**: 隱藏職業標籤，縮小頭像

---

### 個人檔案頁

**路由**: `/users/me/profile`

**檔案路徑**: `app/(main)/users/me/profile/page.tsx`

**佈局**: MainLayout (Navbar + Footer，無 Sidebar)

#### 頁面結構

```
[Navbar]

[課程選擇器 + 通知 + 用戶頭像]

[個人檔案區塊 - 卡片]
  [UserProfile]
    - 頭像 (大，64px)
    - 暱稱
    - 職業標籤: 初級工程師
    - 等級: Lv.5
    - 經驗值進度條: 3000 / 5000 EXP
    - [編輯個人檔案] 按鈕 (R1 僅 UI)

[帳號綁定區塊 - 卡片]
  [AccountBinding]
    Discord: ✓ 已綁定 [解除綁定]
    GitHub: ✗ 未綁定 [立即綁定]

[課程進度區塊 - 卡片] (R1 簡化版)
  已完成課程: 0
  總學習時數: 0 小時

[Footer]
```

#### 使用元件

- `UserProfile`
- `AccountBinding`
- `Card` x3
- `ProgressBar`
- `Badge`
- `Button`

#### 資料需求

```typescript
const user = await getUser()
const accountBindings = await getAccountBindings(user.id)
const courseProgress = await getCourseProgress(user.id)
```

#### 功能 (R1)

- **顯示用戶資訊**: 從 Context 載入
- **經驗值計算**: 根據 design-tokens.md 中的等級對照表
- **編輯按鈕**: 僅 UI，點擊無反應
- **帳號綁定按鈕**: 僅 UI，點擊無反應

---

### 挑戰歷程頁

**路由**: `/users/me/portfolio`

**檔案路徑**: `app/(main)/users/me/portfolio/page.tsx`

**內容**: 「即將推出」占位頁面

---

## 其他頁面

### 404 Not Found

**路由**: (所有未定義路由)

**檔案路徑**: `app/not-found.tsx`

#### 頁面結構

```
[Navbar]

[居中內容]
  404 圖示
  標題: 「頁面不存在」
  描述: 「找不到您要訪問的頁面」
  [返回首頁] 按鈕

[Footer]
```

---

## 頁面開發優先級

### 第一優先 (核心流程)
1. 首頁 `/`
2. 登入頁 `/sign-in`
3. 課程詳情頁 `/journeys/[slug]`
4. 課程單元頁 `/journeys/[slug]/chapters/[id]/missions/[id]`

### 第二優先 (重要頁面)
5. 課程列表頁 `/courses`
6. 排行榜頁 `/leaderboard`
7. 個人檔案頁 `/users/me/profile`

### 第三優先 (占位頁面)
8. 其他占位頁面
9. 404 頁面

---

## 通用頁面邏輯

### SEO Metadata

每個頁面都應定義 Metadata：

```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: '水球軟體學院 - 軟體設計模式精通之旅',
  description: '用一趟旅程的時間，成為硬核的 Coding 實戰高手',
  openGraph: {
    title: '水球軟體學院',
    description: '軟體設計思路教材，線上 Code Review',
    images: ['/og-image.png'],
  },
}
```

### 認證保護

需要登入的頁面應檢查認證狀態：

```typescript
// 在頁面元件中
const { user, isAuthenticated } = useAuth()

if (!isAuthenticated) {
  redirect('/sign-in')
}
```

### Loading 狀態

所有頁面都應該有 Loading 狀態：

```typescript
// app/courses/loading.tsx
export default function Loading() {
  return <Skeleton />
}
```

### Error 處理

```typescript
// app/courses/error.tsx
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>出錯了！</h2>
      <button onClick={reset}>重試</button>
    </div>
  )
}
```

---

## 資料流程圖

```
Page Component
    ↓
useHook (useJourneys, useUser, etc.)
    ↓
Context (JourneyContext, UserContext, etc.)
    ↓
API Client (lib/api/*)
    ↓
Mock Data (R1) / Real API (R2+)
```

---

## 測試清單

每個頁面實作完成後應測試：

- [ ] 頁面正常渲染
- [ ] 所有連結可點擊
- [ ] 所有按鈕顯示正確
- [ ] Mock 資料正確顯示
- [ ] Loading 狀態正常
- [ ] Error 狀態正常
- [ ] RWD 在各尺寸正常
- [ ] SEO Metadata 正確
- [ ] 認證保護生效（如需要）
