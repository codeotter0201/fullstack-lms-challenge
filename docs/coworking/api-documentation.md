# 水球軟體學院平台 API 文件

## 概述

此文件記錄了透過 MCP Playwright 調查 https://world.waterballsa.tw 網站所發現的所有 API 端點。

---

## 1. 認證相關 API

### GET /api/users/me
- **用途**: 獲取當前登入用戶資訊
- **認證**: 需要 JWT Token
- **未登入回應**: 401 Unauthorized
- **回應結構**:
```json
{
  "id": 3080,
  "email": "user@example.com",
  "name": "User Name",
  "occupation": "JUNIOR_PROGRAMMER",
  "level": 1,
  "exp": 0,
  "nextLevelExp": 200,
  "pictureUrl": "https://lh3.googleusercontent.com/...",
  "roles": []
}
```

### GET /api/users/me/notifications
- **用途**: 獲取當前用戶的通知列表
- **認證**: 需要 JWT Token
- **回應**: 通知陣列（空陣列表示無通知）

### GET /api/users/me/journey-status
- **用途**: 獲取當前用戶的課程狀態（訂單資訊）
- **認證**: 需要 JWT Token
- **回應結構**:
```json
{
  "orders": []
}
```

### GET /api/users/me/accounts/discord
- **用途**: 獲取當前用戶的 Discord 帳號綁定狀態
- **認證**: 需要 JWT Token
- **回應**: Discord 帳號資訊或綁定狀態

### GET /api/users/me/accounts/github
- **用途**: 獲取當前用戶的 GitHub 帳號綁定狀態
- **認證**: 需要 JWT Token
- **回應**: GitHub 帳號資訊或綁定狀態

### POST /api/world:renew-token
- **用途**: 更新認證 Token
- **認證**: 需要 JWT Token
- **備註**: 用於延長登入狀態

### GET /api/world/enter
- **用途**: OAuth 登入端點
- **參數**: `provider` - 登入提供者 (google, facebook)
- **範例**: `/api/world/enter?provider=google`
- **回應**: 重定向到 OAuth 提供者

---

## 2. 課程/旅程 API

### GET /api/journeys/latest
- **用途**: 獲取所有課程列表及完整課程資料（包含章節、任務、道館）
- **參數**:
  - `page`: 頁碼（從 0 開始）
  - `items`: 每頁項目數量
- **範例**: `/api/journeys/latest?page=0&items=100`
- **注意**: 截至 2025-11-18，此 API 返回 5 門課程
- **回應結構**:
```json
[
  {
    "id": 4,
    "name": "AI x BDD：規格驅動全自動開發術",
    "slug": "ai-bdd",
    "createdAt": 1757750531454,
    "skills": [...],
    "chapters": [
      {
        "id": 0,
        "name": "課程介紹＆試聽",
        "reward": {
          "exp": 150,
          "coin": 100,
          "subscriptionExtensionInDays": 0,
          "journeyId": 0,
          "externalRewardDescription": ""
        },
        "passwordRequired": false,
        "lessons": [
          {
            "id": 1,
            "chapterId": 0,
            "journeyId": 4,
            "name": "這門課絕對不只是教你寫規格",
            "premiumOnly": false,
            "type": "scroll",  // 類型: scroll(文章), video(影片), google-form(問卷)
            "createdAt": 1757750531454,
            "reward": {
              "exp": 201,
              "coin": 0,
              "subscriptionExtensionInDays": 0,
              "journeyId": 0,
              "externalRewardDescription": ""
            },
            "videoLength": "08:33"  // 僅限 video 類型
          }
        ],
        "gyms": [...]
      }
    ],
    "missions": [...]
  }
]
```

### GET /api/journey-slug-mapping
- **用途**: 獲取課程 slug 到 ID 的映射表
- **回應結構** (共 5 門課程，2025-11-18 更新):
```json
{
  "software-design-pattern": "0",
  "software-career": "1",
  "ddd": "2",
  "software-design-talk": "3",
  "ai-bdd": "4"
}
```
- **課程列表**:
  - ID 0: 軟體設計模式精通之旅 (software-design-pattern)
  - ID 1: 工程師下班職涯快速成長攻略 (software-career)
  - ID 2: 領域驅動設計 (Domain-Driven Design) (ddd)
  - ID 3: 軟體設計實戰漫談 (software-design-talk)
  - ID 4: AI x BDD：規格驅動全自動開發術 (ai-bdd)

### GET /api/journeys/{journeyId}
- **用途**: 獲取特定課程的詳細資訊
- **參數**: `journeyId` - 課程 ID
- **範例**: `/api/journeys/0` 或 `/api/journeys/4`
- **回應**: 完整的課程資料（包含章節、課程單元、道館等）

### GET /api/journeys/{journeyId}/gym-badges
- **用途**: 獲取特定課程的道館徽章資訊
- **參數**: `journeyId` - 課程 ID
- **範例**: `/api/journeys/0/gym-badges`
- **回應**: 道館徽章列表
- **回應結構**:
```json
[
  {
    "id": 1,
    "name": "命名達人",
    "gymId": 1,
    "imageUrl": "https://cdn.waterballsa.tw/...",
    "journeyId": 0,
    "chapterId": 1
  }
]
```
- **說明**:
  - `/api/journeys/0/gym-badges` 返回 20 個徽章
  - `/api/journeys/4/gym-badges` 返回 7 個徽章

### GET /api/users?ids={userIds}
- **用途**: 批量獲取用戶資訊
- **參數**: `ids` - 用戶 ID（可以是單個或多個，用逗號分隔）
- **範例**: `/api/users?ids=1774` 或 `/api/users?ids=1774,3080`
- **回應**: 用戶資訊陣列

### GET /api/users/occupation-mapping
- **用途**: 獲取職業類型的映射表
- **回應結構**:
```json
{
  "JUNIOR_PROGRAMMER": {
    "name": "初級工程師"
  }
}
```

### GET /api/users/skill-name-mapping
- **用途**: 獲取技能名稱的映射表
- **參數**: `journeyId` - 課程 ID（可選）
- **範例**: `/api/users/skill-name-mapping?journeyId=0`
- **回應結構**:
```json
{
  "1": "物件導向分析：\n需求結構化分析",
  "2": "物件導向分析：\n區分結構與行為",
  "3": "物件導向設計：\n抽象/萃取能力"
}
```

---

## 3. 排行榜 API

### GET /api/users/leaderboard
- **用途**: 獲取學習排行榜
- **參數**:
  - `page`: 頁碼（從 0 開始）
  - `items`: 每頁項目數量
- **範例**: `/api/users/leaderboard?page=0&items=30`
- **回應結構**:
```json
[
  {
    "id": 1774,
    "name": "陳志穎",
    "nickname": "Elliot",
    "occupation": "JUNIOR_PROGRAMMER",
    "jobTitle": "初級工程師",
    "level": 19,
    "exp": 31040,
    "pictureUrl": "https://cdn.waterballsa.tw/..."
  }
]
```

### GET /api/users/leaderboard/me
- **用途**: 獲取當前用戶在排行榜的位置
- **認證**: 需要 JWT Token
- **未登入回應**: 401 Unauthorized

---

## 4. 道館/挑戰 API

### GET /api/users/me/journeys/gyms/challenges/records
- **用途**: 獲取當前用戶的道館挑戰記錄
- **認證**: 需要 JWT Token
- **回應**: 挑戰記錄陣列（空陣列表示無記錄）

### GET /api/users/{userId}/journeys/gyms/challenges/records
- **用途**: 獲取特定用戶的道館挑戰記錄
- **參數**: `userId` - 用戶 ID
- **認證**: 需要 JWT Token
- **回應**: 挑戰記錄陣列

---

## 5. 前端路由結構

基於頁面 URL 和 JavaScript chunks，推斷出以下前端路由：

```
/                                                    # 首頁
/sign-in                                             # 登入頁
/courses                                             # 課程列表頁
/leaderboard                                         # 排行榜頁
/skills-intro                                        # 技能評級及證書系統介紹頁（新增 2025-11-18）
/users/me/profile                                    # 個人檔案頁（當前用戶）
/users/me/portfolio                                  # 挑戰歷程頁（當前用戶）
/journeys/[journeySlug]                              # 課程詳情頁（所有單元）
/journeys/[journeySlug]/missions                     # 獎勵任務頁
/journeys/[journeySlug]/roadmap                      # 挑戰地圖頁
/journeys/[journeySlug]/sop                          # SOP 寶典頁（部分頁面顯示為 "Prompt 寶典"）
/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]  # 課程單元頁
/journeys/[journeySlug]/chapters/[chapterId]/gyms/[gymId]         # 道館挑戰詳情
```

---

## 6. 資料模型分析

### User（用戶）
```typescript
interface User {
  id: number;
  email?: string;          // 僅在 /api/users/me 回應中出現
  name: string;
  nickName?: string;       // 注意：使用駝峰式命名
  occupation: string;      // 如: "JUNIOR_PROGRAMMER"
  jobTitle?: string;       // 如: "初級工程師"（排行榜有此欄位）
  level: number;
  exp: number;
  nextLevelExp?: number;   // 下一等級所需經驗值（僅在 /api/users/me）
  pictureUrl: string;
  roles?: string[];        // 用戶角色陣列（僅在 /api/users/me）
  // 個人檔案額外欄位
  birthday?: string;
  gender?: string;
  region?: string;
  githubLink?: string;
}
```

### Journey（課程/旅程）
```typescript
interface Journey {
  id: number;
  name: string;
  slug: string;
  createdAt: number;
  skills: Skill[];
  chapters: Chapter[];
  missions: Mission[];
}
```

### Chapter（章節/副本）
```typescript
interface Chapter {
  id: number;
  name: string;
  reward: Reward;
  passwordRequired: boolean;
  lessons: Lesson[];
  gyms: Gym[];
}
```

### Lesson（課程單元）
```typescript
interface Lesson {
  id: number;
  chapterId: number;
  journeyId: number;
  name: string;
  description?: string;
  premiumOnly: boolean;
  type: "scroll" | "video" | "google-form";
  createdAt: number;
  reward: Reward;
  videoLength?: string;  // 僅限 video 類型
}
```

### Reward（獎勵）
```typescript
interface Reward {
  exp: number;
  coin: number;
  subscriptionExtensionInDays: number;
  journeyId: number;
  externalRewardDescription: string;
}
```

### Gym（道館）
```typescript
interface Gym {
  id: number;
  name: string;
  difficulty: number;      // 星級 (1-5)
  chapterId: number;
  journeyId: number;
  type: "white" | "black"; // 白段 or 黑段
  // 其他欄位需要登入才能完整查看
}
```

---

## 7. 頁面與 API 對應關係

### 1. 首頁 (/)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/users/me/notifications`
- `GET /api/users/me/journey-status`
- `POST /api/world:renew-token`

### 2. 登入頁 (/sign-in)
**載入的 API:**
- `GET /api/users/me` (檢查登入狀態)
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journey-slug-mapping`

**登入流程 API:**
- `GET /api/world/enter?provider=google`
- `GET /api/world/enter?provider=facebook`

### 3. 課程列表頁 (/courses)
**載入的 API:**
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journey-slug-mapping`
- `GET /api/users/me`
- `GET /api/users/me/notifications`
- `GET /api/users/me/journey-status`
- `GET /api/users/me/journeys/gyms/challenges/records` (2次)
- `POST /api/world:renew-token`

### 4. 課程詳情頁 (/journeys/software-design-pattern)
**載入的 API:**
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journey-slug-mapping`
- `GET /api/users/me`
- `GET /api/users/me/notifications`
- `GET /api/users/me/journey-status`
- `GET /api/users/me/journeys/gyms/challenges/records` (2次)
- `POST /api/world:renew-token`

### 5. 排行榜頁 (/leaderboard)
**載入的 API:**
- `GET /api/users/leaderboard?page=0&items=30`
- `GET /api/users/leaderboard/me`
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `POST /api/world:renew-token`

### 6. 個人檔案頁 (/users/me/profile)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/users/me/accounts/discord`
- `GET /api/users/me/accounts/github`
- `GET /api/users/me/journey-status`
- `GET /api/journeys/latest?page=0&items=100`
- `POST /api/world:renew-token`

### 7. 挑戰歷程頁 (/users/me/portfolio)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/users/me/journeys/gyms/challenges/records`
- `GET /api/journeys/latest?page=0&items=100`
- `POST /api/world:renew-token`

### 8. 獎勵任務頁 (/journeys/software-design-pattern/missions)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journeys/{id}` (包含任務資料)
- `GET /api/users/me/items` (獲取用戶物品/獎勵)
- `GET /api/users/{userId}/journeys/missions/progresses` (獲取任務進度)
- `GET /api/users/me/journey-status`
- `POST /api/world:renew-token`

### 9. 挑戰地圖頁 (/journeys/software-design-pattern/roadmap)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journeys/0` (課程 ID 0 = software-design-pattern)
- `GET /api/users/me/journeys/gyms/challenges/records`
- `POST /api/world:renew-token`

### 10. SOP 寶典頁 (/journeys/software-design-pattern/sop)
**載入的 API:**
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/users/me/journey-status` (檢查課程權限)
- `POST /api/world:renew-token`

### 11. 課程單元頁 (/journeys/[slug]/chapters/[chapterId]/missions/[lessonId])
**載入的 API:**
- `GET /api/users/me`
- `GET /api/journeys/latest?page=0&items=100`
- `GET /api/journeys/{id}` (獲取課程資料)
- `GET /api/journeys/{id}/chapters/{chapterId}/lessons/{lessonId}` (獲取課程單元詳情)
- `GET /api/users/me/journeys/lessons/progresses` (獲取所有課程進度)
- `GET cdn.waterballsa.tw/.../videos/{videoId}/{videoId}.m3u8` (HLS 影片清單)
- `GET cdn.waterballsa.tw/.../videos/{videoId}/{videoId}-*.ts` (HLS 影片分段)
- `POST /api/world:renew-token`

**推測的進度追蹤 API**:
- `POST /api/missions/{id}/progress` (更新觀看進度)
- `POST /api/missions/{id}/deliver` (完成課程)

---

## 8. 認證機制

### 認證方式
平台使用 OAuth 2.0 認證，支持：
- Facebook 登入
- Google 登入

### OAuth 登入流程
1. 重定向到 `/api/world/enter?provider={google|facebook}`
2. OAuth 提供者授權
3. 回調到平台
4. 後端生成 JWT Token
5. 設置 Cookie
6. 重定向到 `localStorage.loginCallbackUrl` 或首頁

### Token 管理
- **Cookie-based**: JWT Token 存儲在 Cookie 中
- **Token 更新**: 定期調用 `POST /api/world:renew-token` 延長登入狀態

---

## 9. 尚需進一步調查的 API（需要登入）

由於未登入限制，以下 API 需要進一步調查：

1. **課程進度相關**:
   - `GET /api/missions/{id}` - 獲取單元詳情
   - `POST /api/missions/{id}/progress` - 更新觀看進度
   - `POST /api/missions/{id}/deliver` - 交付課程

2. **筆記相關**:
   - `GET /api/missions/{id}/notes` - 獲取筆記
   - `POST /api/missions/{id}/notes` - 新增筆記

3. **用戶資料相關**:
   - `GET /api/users/{id}/profile` - 用戶個人檔案
   - `GET /api/users/{id}/portfolio` - 用戶作品集

4. **道館提交相關**:
   - `POST /api/gyms/{id}/submissions` - 提交作業
   - `GET /api/users/{id}/submissions` - 獲取用戶提交記錄

5. **認證相關**:
   - `POST /api/auth/login` - 登入（透過 OAuth）
   - `POST /api/auth/register` - 註冊（透過 OAuth）

---

## 10. CDN 資源

平台使用自有 CDN 存儲用戶頭像和媒體資源：
- **Base URL**: `https://cdn.waterballsa.tw/`
- **用戶頭像**: `/{hash}/pictures/file?latestEditTime={timestamp}`
- **Bot 頭像**: `/bots/pictures/{filename}`

### HLS 影片串流
平台使用 HLS (HTTP Live Streaming) 協議提供影片內容：
- **協議**: HLS (HTTP Live Streaming)
- **影片清單**: `/.../videos/{videoId}/{videoId}.m3u8`
- **影片分段**: `/.../videos/{videoId}/{videoId}-*.ts`
- **特性**:
  - 自適應位元率串流 (Adaptive Bitrate Streaming)
  - 響應式品質調整
  - 分段載入，節省頻寬
  - 支援多種解析度自動切換

---

## 11. 技術棧觀察

### 前端
- **框架**: Next.js (App Router)
- **狀態管理**: RxJS (觀察到 combineLatest 使用)
- **CDN**: 自有 CDN (cdn.waterballsa.tw)
- **分析工具**:
  - Google Analytics (G-45MLDLZXG2)
  - Google Tag Manager (GTM-KZN5SDRL)
  - Facebook Pixel (1198985825392308)
  - Microsoft Clarity (pa4jrbzcsh)
  - Google Ads (AW-17630822713)

### API 特性
- RESTful 設計
- 分頁支持 (page, items 參數)
- JSON 格式回應
- JWT Token 認證
- 課程資料預載入（chapters、lessons、gyms 嵌入在 journey 回應中）

### API 設計模式
1. **分頁機制**:
   - 排行榜: `page` + `items` 參數 (預設: page=0, items=30)
   - 課程列表: `page` + `items` 參數 (預設: page=0, items=100)

2. **資源預載入**:
   - 大多數頁面都會預載入 `/api/journeys/latest` 和 `/api/users/me`
   - 使用 Next.js chunks 預載入相關頁面的 JavaScript

3. **權限控制**:
   - SOP 寶典頁需要檢查 `journey-status` 確認課程購買狀態
   - 道館挑戰記錄僅對已登入用戶開放
   - 個人檔案編輯功能需要認證

4. **ID vs Slug**:
   - 課程 ID: 數字 (0, 1, 2, 3, 4)
   - 課程 Slug: 字串 (software-design-pattern, ddd, ai-bdd 等)
   - 映射: 透過 `/api/journey-slug-mapping` 進行轉換

---

## 12. 建議的後端 API 實作

基於調查結果，建議按以下優先級實作 API：

### 階段 1: MVP (最小可行產品)

#### 1. 認證系統
```
POST   /api/auth/register         # 註冊（透過 OAuth）
POST   /api/auth/login            # 登入（透過 OAuth）
GET    /api/users/me              # 獲取當前用戶資訊
POST   /api/world:renew-token     # 更新認證 Token
GET    /api/world/enter           # OAuth 登入端點
```

#### 2. 課程系統
```
GET    /api/journeys/latest       # 獲取課程列表
GET    /api/journey-slug-mapping  # 獲取課程 slug 映射
GET    /api/journeys/{id}         # 獲取課程詳情
```

#### 3. 排行榜
```
GET    /api/users/leaderboard     # 獲取排行榜
GET    /api/users/leaderboard/me  # 獲取當前用戶排名
```

### 階段 2: 核心功能

#### 4. 進度追蹤
```
GET    /api/missions/{id}              # 獲取單元詳情
POST   /api/missions/{id}/progress     # 更新觀看進度
POST   /api/missions/{id}/deliver      # 完成單元
GET    /api/users/me/journey-status    # 獲取用戶課程狀態
```

#### 5. 道館系統
```
GET    /api/users/me/journeys/gyms/challenges/records  # 獲取挑戰記錄
GET    /api/journeys/{journeyId}/gym-badges            # 獲取道館徽章
POST   /api/gyms/{id}/submissions                      # 提交作業
GET    /api/users/{id}/submissions                     # 獲取提交記錄
```

### 階段 3: 進階功能

#### 6. 社交整合
```
GET    /api/users/me/accounts/discord  # Discord 帳號綁定狀態
GET    /api/users/me/accounts/github   # GitHub 帳號綁定狀態
```

#### 7. 通知系統
```
GET    /api/users/me/notifications     # 獲取用戶通知列表
```

#### 8. 用戶資料
```
GET    /api/users/{id}/profile         # 用戶個人檔案
GET    /api/users/{id}/portfolio       # 用戶作品集
GET    /api/users?ids={userIds}        # 批量獲取用戶資訊
```

#### 9. 筆記功能
```
GET    /api/missions/{id}/notes        # 獲取筆記
POST   /api/missions/{id}/notes        # 新增筆記
```

#### 10. 輔助 API
```
GET    /api/users/occupation-mapping   # 獲取職業映射表
GET    /api/users/skill-name-mapping   # 獲取技能映射表
```

---

## 更新日期

- 2025-11-17：初次調查（未登入狀態）
- 2025-11-18：補充調查（已登入狀態），新增用戶認證相關 API、通知、訂單狀態等端點
- 2025-11-18：課程數量更新（2 門 → 5 門），更新課程 slug 映射表，新增 3 門課程資訊
- 2025-11-18：整合 api-summary.md，新增頁面與 API 對應關係、完整資料模型、詳細認證流程、結構化實作優先級
- 2025-11-18：全面驗證所有 API 端點，修正 User 模型中的 nickName 欄位命名，補充 gym-badges 回應結構

## 調查方法

使用 MCP Playwright 工具：
1. 導航至各個頁面（首頁、課程、個人檔案、排行榜等）
2. 捕獲網路請求
3. 使用 JavaScript evaluate 直接呼叫 API
4. 分析回應資料結構
5. 測試登入與未登入狀態的差異
