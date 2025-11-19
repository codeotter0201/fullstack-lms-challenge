# 水球軟體學院平台 - 用戶流程與模組化設計

## 概述

本文件基於對 https://world.waterballsa.tw 的 API 調查，整理出用戶流程與建議的後端模組化架構設計。

目標：**使用 Java + Next.js + PostgreSQL 以低耦合的方式復刻此平台**

---

## 一、核心用戶流程

### 1.1 平台課程總覽（2025-11-18 更新）

平台目前提供 **5 門課程**：
1. **軟體設計模式精通之旅** (software-design-pattern) - ID: 0
2. **工程師下班職涯快速成長攻略** (software-career) - ID: 1
3. **領域驅動設計 (Domain-Driven Design)** (ddd) - ID: 2
4. **軟體設計實戰漫談** (software-design-talk) - ID: 3
5. **AI x BDD：規格驅動全自動開發術** (ai-bdd) - ID: 4

### 1.2 訪客流程（未登入）

```
訪客進入首頁
├─> 瀏覽課程介紹
│   ├─> 查看課程列表 (/courses) - 顯示 5 門課程
│   ├─> 查看課程詳情 (/journeys/[slug])
│   ├─> 查看課程章節/單元（部分免費內容）
│   └─> 查看技能評級及證書系統 (/skills-intro)
├─> 查看排行榜 (/leaderboard)
│   └─> 查看其他學員的學習成就
├─> 查看促銷活動
│   └─> 首頁 Banner：完成體驗課程獲得 3000 元折價券
└─> 註冊/登入
    ├─> Google OAuth 2.0
    └─> Facebook OAuth 2.0
```

**涉及 API**:
- `GET /api/journeys/latest?page={page}&items={items}` - 獲取課程列表
- `GET /api/journey-slug-mapping` - 課程 slug 映射
- `GET /api/journeys/{id}` - 課程詳情
- `GET /api/users/leaderboard?page={page}&items={items}` - 排行榜
- `GET /api/world/enter?provider={google|facebook}` - OAuth 登入端點
- `GET /api/users?ids={userIds}` - 批量獲取用戶資訊

---

### 1.3 學員流程（已登入）

#### 1.3.1 學習主流程

```
登入後首頁
├─> 查看個人資料
│   ├─> GET /api/users/me
│   ├─> 等級、經驗值、職業
│   └─> 通知 (GET /api/users/me/notifications)
│
├─> 選擇課程
│   ├─> 查看課程列表 (/courses) - 5 門課程可選
│   ├─> 使用頂部課程切換下拉選單快速切換
│   ├─> 點擊「前往挑戰地圖」快速進入當前課程地圖
│   ├─> 查看已購買課程 (GET /api/users/me/journey-status)
│   └─> 進入課程詳情頁
│
├─> 學習課程
│   ├─> 查看所有單元 (/journeys/[slug])
│   ├─> 觀看課程影片/文章
│   │   ├─> HLS (HTTP Live Streaming) 自適應串流
│   │   ├─> CDN 影片資源：cdn.waterballsa.tw
│   │   ├─> GET /api/journeys/{id}/chapters/{chapterId}/lessons/{lessonId} (獲取單元詳情)
│   │   ├─> GET /api/users/me/journeys/lessons/progresses (獲取課程進度)
│   │   ├─> POST /api/missions/{id}/progress (更新進度)
│   │   └─> POST /api/missions/{id}/deliver (完成課程)
│   ├─> 完成獎勵任務 (/journeys/[slug]/missions)
│   │   ├─> 任務鏈結構：新手任務 → 白段任務 → 黑段任務
│   │   ├─> 時間限制：21-30 天
│   │   ├─> 獎勵類型：經驗值、訂閱延長
│   │   ├─> GET /api/users/me/items (獲取用戶物品/獎勵)
│   │   └─> GET /api/users/{userId}/journeys/missions/progresses (獲取任務進度)
│   └─> 參考 SOP 寶典 (/journeys/[slug]/sop)
│       ├─> 🔒 需要購買課程才能訪問
│       └─> 註：部分頁面顯示為「Prompt 寶典」
│
├─> 挑戰道館
│   ├─> 查看挑戰地圖 (/journeys/[slug]/roadmap)
│   ├─> 10 個道館：白段 5 個（★-★★★）、黑段 5 個（★-★★★★）
│   ├─> 選擇道館挑戰
│   ├─> 提交作業 (POST /api/gyms/{id}/submissions)
│   └─> 獲得道館徽章 (GET /api/journeys/{id}/gym-badges)
│
└─> 追蹤成就
    ├─> 個人檔案 (/users/me/profile)
    │   ├─> 基本資料
    │   ├─> 道館徽章
    │   ├─> 技能評級
    │   └─> 證書
    ├─> 挑戰歷程 (/users/me/portfolio)
    └─> 排行榜排名 (GET /api/users/leaderboard/me)
```

**涉及 API**:
- `GET /api/users/me` - 當前用戶資訊
- `GET /api/users/me/notifications` - 用戶通知
- `GET /api/users/me/journey-status` - 課程購買狀態
- `GET /api/users/me/accounts/discord` - Discord 帳號綁定狀態
- `GET /api/users/me/accounts/github` - GitHub 帳號綁定狀態
- `POST /api/missions/{id}/progress` - 更新課程進度（推測）
- `POST /api/missions/{id}/deliver` - 完成課程（推測）
- `POST /api/gyms/{id}/submissions` - 提交道館作業（推測）
- `GET /api/users/me/journeys/gyms/challenges/records` - 當前用戶道館挑戰記錄
- `GET /api/users/{userId}/journeys/gyms/challenges/records` - 指定用戶道館挑戰記錄
- `GET /api/journeys/{id}/gym-badges` - 道館徽章
- `GET /api/users/leaderboard?page={page}&items={items}` - 排行榜
- `GET /api/users/leaderboard/me` - 個人排行
- `POST /api/world:renew-token` - 更新登入狀態

---

## 二、後端模組化設計（低耦合架構）

基於 DDD（領域驅動設計）和微服務思想，建議以下模組劃分：

### 2.1 模組架構圖

```
┌─────────────────────────────────────────────────────────┐
│                     API Gateway                         │
│              (Spring Cloud Gateway)                     │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│  認證授權模組   │  │   用戶模組     │  │   課程模組     │
│  (Auth Module) │  │ (User Module)  │  │(Journey Module)│
└────────────────┘  └────────────────┘  └────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│   通知模組     │  │  排行榜模組    │  │  進度追蹤模組  │
│(Notification)  │  │ (Leaderboard)  │  │  (Progress)    │
└────────────────┘  └────────────────┘  └────────────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼─────────┐
│   道館模組     │  │   獎勵模組     │  │   訂單模組     │
│  (Gym Module)  │  │ (Reward Module)│  │ (Order Module) │
└────────────────┘  └────────────────┘  └────────────────┘
                            │
                    ┌───────▼────────┐
                    │  共享服務層     │
                    │ (Shared Layer) │
                    └────────────────┘
```

---

### 2.2 模組詳細設計

#### **Module 1: 認證授權模組 (Auth Module)**

**職責**:
- OAuth 2.0 整合（Google, Facebook）
- JWT Token 生成與驗證
- 用戶註冊與登入
- Token 更新

**實體 (Entities)**:
```java
- User (基本用戶資訊)
- OAuthProvider (OAuth 提供者資訊)
- RefreshToken (更新令牌)
```

**API 端點**:
- `GET /api/world/enter?provider={google|facebook}` - OAuth 登入端點
- `POST /api/world:renew-token` - 更新認證 Token

**依賴**:
- 無（核心模組）

**資料庫表**:
- `users` (id, email, name, oauth_provider, oauth_id, created_at)
- `refresh_tokens` (id, user_id, token, expires_at)

---

#### **Module 2: 用戶模組 (User Module)**

**職責**:
- 用戶個人資料管理
- 用戶經驗值與等級系統
- 職業與技能管理
- 用戶頭像管理

**實體 (Entities)**:
```java
- UserProfile (用戶檔案)
- Occupation (職業類型)
- Skill (技能)
- UserSkill (用戶技能關聯)
```

**API 端點**:
- `GET /api/users/me` - 獲取當前用戶資訊
- `GET /api/users?ids={userIds}` - 批量獲取用戶資訊
- `GET /api/users/{id}/profile` - 用戶公開檔案（推測）
- `GET /api/users/{id}/portfolio` - 用戶作品集（推測）
- `GET /api/users/occupation-mapping` - 獲取職業類型映射表
- `GET /api/users/skill-name-mapping?journeyId={id}` - 獲取技能名稱映射表
- `GET /api/users/me/notifications` - 獲取用戶通知列表
- `GET /api/users/me/journey-status` - 獲取用戶課程訂單狀態
- `GET /api/users/me/accounts/discord` - Discord 帳號綁定狀態
- `GET /api/users/me/accounts/github` - GitHub 帳號綁定狀態

**依賴**:
- Auth Module（用戶身份驗證）
- Reward Module（經驗值與等級計算）

**資料庫表**:
- `user_profiles` (user_id, nickname, occupation, level, exp, picture_url)
- `occupations` (id, code, name)
- `skills` (id, name, description, journey_id)
- `user_skills` (user_id, skill_id, level)

---

#### **Module 3: 課程模組 (Journey Module)**

**職責**:
- 課程 (Journey) 管理
- 章節 (Chapter) 管理
- 課程單元 (Lesson/Mission) 管理
- 課程 slug 映射

**實體 (Entities)**:
```java
- Journey (課程)
- Chapter (章節/副本)
- Lesson (課程單元)
- Mission (任務)
```

**API 端點**:
- `GET /api/journeys/latest?page={page}&items={items}` - 獲取課程列表
- `GET /api/journeys/{id}` - 獲取指定課程詳情
- `GET /api/journey-slug-mapping` - 獲取課程 slug 映射表
- `GET /api/journeys/{id}/gym-badges` - 獲取課程道館徽章

**依賴**:
- Reward Module（課程完成獎勵）

**資料庫表**:
- `journeys` (id, name, slug, description, created_at)
- `chapters` (id, journey_id, name, order, password_required)
- `lessons` (id, chapter_id, journey_id, name, type, premium_only, video_length, content_url)
- `missions` (id, journey_id, name, description, reward_id)

---

#### **Module 4: 進度追蹤模組 (Progress Module)**

**職責**:
- 課程學習進度追蹤
- 課程完成狀態管理
- 學習歷程記錄

**實體 (Entities)**:
```java
- LessonProgress (課程單元進度)
- MissionProgress (任務進度)
- CompletionRecord (完成記錄)
```

**API 端點**:
- `GET /api/missions/{id}` - 獲取單元詳情（推測）
- `POST /api/missions/{id}/progress` - 更新觀看進度（推測）
- `POST /api/missions/{id}/deliver` - 完成單元（推測）
- `GET /api/missions/{id}/notes` - 獲取筆記（推測）
- `POST /api/missions/{id}/notes` - 新增筆記（推測）

**依賴**:
- User Module（用戶身份）
- Journey Module（課程資訊）
- Reward Module（完成獎勵發放）

**資料庫表**:
- `lesson_progress` (id, user_id, lesson_id, progress_percentage, last_watched_at)
- `mission_progress` (id, user_id, mission_id, status, completed_at)
- `completion_records` (id, user_id, completable_type, completable_id, completed_at)

---

#### **Module 5: 道館模組 (Gym Module)**

**職責**:
- 道館 (Gym) 管理
- 道館挑戰提交與審核
- 道館徽章管理

**實體 (Entities)**:
```java
- Gym (道館)
- GymChallenge (道館挑戰)
- GymSubmission (提交作業)
- GymBadge (道館徽章)
```

**API 端點**:
- `POST /api/gyms/{id}/submissions` - 提交道館作業（推測）
- `GET /api/users/{id}/submissions` - 獲取用戶提交記錄（推測）
- `GET /api/users/me/journeys/gyms/challenges/records` - 獲取當前用戶道館挑戰記錄
- `GET /api/users/{userId}/journeys/gyms/challenges/records` - 獲取指定用戶道館挑戰記錄
- `GET /api/journeys/{id}/gym-badges` - 獲取課程道館徽章

**依賴**:
- User Module（用戶身份）
- Journey Module（課程資訊）
- Reward Module（徽章獎勵）

**資料庫表**:
- `gyms` (id, chapter_id, name, description, difficulty)
- `gym_challenges` (id, gym_id, user_id, status, submitted_at, reviewed_at)
- `gym_submissions` (id, challenge_id, submission_url, feedback)
- `gym_badges` (id, gym_id, name, icon_url)
- `user_gym_badges` (user_id, badge_id, earned_at)

---

#### **Module 6: 排行榜模組 (Leaderboard Module)**

**職責**:
- 全站學習排行榜
- 週成長榜
- 個人排名查詢

**實體 (Entities)**:
```java
- LeaderboardEntry (排行榜條目)
- WeeklyGrowth (每週成長記錄)
```

**API 端點**:
- `GET /api/users/leaderboard?page={page}&items={items}` - 獲取學習排行榜
- `GET /api/users/leaderboard/me` - 獲取當前用戶排行榜位置

**依賴**:
- User Module（用戶經驗值）

**資料庫表**:
- `leaderboard_cache` (user_id, rank, exp, level, updated_at) - 定期更新的排行榜快取
- `weekly_growth` (user_id, week_start, exp_gained, rank)

---

#### **Module 7: 獎勵模組 (Reward Module)**

**職責**:
- 經驗值 (EXP) 計算與發放
- 金幣 (Coin) 管理
- 訂閱延長獎勵
- 等級升級邏輯

**實體 (Entities)**:
```java
- Reward (獎勵定義)
- RewardTransaction (獎勵交易記錄)
- LevelConfig (等級配置)
```

**API 端點**:
- 無直接 API，通過事件驅動觸發

**依賴**:
- User Module（更新用戶經驗值與等級）

**資料庫表**:
- `rewards` (id, type, exp, coin, subscription_days, description)
- `reward_transactions` (id, user_id, reward_id, source_type, source_id, created_at)
- `level_configs` (level, required_exp)

---

#### **Module 8: 通知模組 (Notification Module)**

**職責**:
- 系統通知管理
- 用戶通知推送
- 通知已讀狀態

**實體 (Entities)**:
```java
- Notification (通知)
```

**API 端點**:
- `GET /api/users/me/notifications` - 獲取用戶通知列表
- `PUT /api/notifications/{id}/read` - 標記通知為已讀（推測）

**依賴**:
- User Module（用戶身份）

**資料庫表**:
- `notifications` (id, user_id, type, title, content, is_read, created_at)

---

#### **Module 9: 訂單模組 (Order Module)**

**職責**:
- 課程購買訂單管理
- 支付整合
- 訂單狀態追蹤

**實體 (Entities)**:
```java
- Order (訂單)
- OrderItem (訂單項目)
- Payment (支付記錄)
```

**API 端點**:
- `GET /api/users/me/journey-status` - 獲取用戶課程訂單狀態
- `POST /api/orders` - 建立訂單（推測）
- `GET /api/orders/{id}` - 獲取訂單詳情（推測）

**依賴**:
- User Module（用戶身份）
- Journey Module（課程資訊）

**資料庫表**:
- `orders` (id, user_id, total_amount, status, created_at, paid_at)
- `order_items` (id, order_id, journey_id, price)
- `payments` (id, order_id, payment_method, amount, transaction_id, status)

---

#### **Module 10: 共享服務層 (Shared Layer)**

**職責**:
- CDN 文件上傳與管理
- 快取服務 (Redis)
- 事件發布/訂閱 (Event Bus)
- 共用工具類

**服務**:
- CDN Service (頭像、影片、文件上傳)
- Cache Service (Redis)
- Event Bus (Spring Event / RabbitMQ)
- Mapper Service (occupation-mapping, skill-name-mapping)

---

## 三、模組間通訊設計

### 3.1 同步通訊 (REST API)

用於需要即時回應的操作：
- API Gateway → 各模組的 REST API 調用
- 用戶查詢、課程查詢等

### 3.2 異步通訊 (Event-Driven)

用於非即時操作，降低耦合：

**事件範例**:
```java
// 課程完成事件
MissionCompletedEvent {
    userId: Long,
    missionId: Long,
    completedAt: Timestamp
}
→ Reward Module 監聽 → 發放經驗值
→ Leaderboard Module 監聽 → 更新排行榜
→ Notification Module 監聽 → 發送完成通知

// 道館挑戰提交事件
GymSubmissionEvent {
    userId: Long,
    gymId: Long,
    submissionId: Long
}
→ Notification Module 監聽 → 通知審核者

// 等級提升事件
LevelUpEvent {
    userId: Long,
    oldLevel: Int,
    newLevel: Int
}
→ Notification Module 監聽 → 發送升級通知
```

---

## 四、資料庫設計原則

### 4.1 每個模組獨立資料庫

採用 **Database per Service** 模式：
- `auth_db` - 認證授權模組
- `user_db` - 用戶模組
- `journey_db` - 課程模組
- `progress_db` - 進度追蹤模組
- `gym_db` - 道館模組
- `leaderboard_db` - 排行榜模組
- `reward_db` - 獎勵模組
- `notification_db` - 通知模組
- `order_db` - 訂單模組

### 4.2 跨模組資料查詢

**方案 1**: API 組合模式
```
前端請求 → API Gateway
→ 並行調用 User Module + Journey Module
→ 組合回應
```

**方案 2**: CQRS + 讀庫
```
寫操作 → 各模組獨立寫庫
讀操作 → 統一讀庫（通過事件同步）
```

---

## 五、技術棧建議

### 5.1 後端 (Java)

```
框架: Spring Boot 3.x
API Gateway: Spring Cloud Gateway
服務發現: Eureka / Consul
配置中心: Spring Cloud Config
認證: Spring Security + OAuth 2.0
ORM: JPA (Hibernate) / MyBatis
快取: Redis
消息佇列: RabbitMQ / Kafka
資料庫: PostgreSQL
```

### 5.2 前端 (Next.js)

```
框架: Next.js 14+ (App Router)
狀態管理: Zustand / Jotai
API 請求: TanStack Query (React Query)
UI 框架: Tailwind CSS + shadcn/ui
認證: NextAuth.js (OAuth)
```

---

## 六、開發優先順序

### Phase 1: MVP（最小可行產品）
1. 認證授權模組 - OAuth 登入
2. 用戶模組 - 基本個人資料
3. 課程模組 - 課程列表與詳情
4. 進度追蹤模組 - 觀看進度記錄
5. 排行榜模組 - 經驗值排行

### Phase 2: 核心功能
6. 道館模組 - 挑戰提交與徽章
7. 獎勵模組 - 完整經驗值與等級系統
8. 訂單模組 - 課程購買

### Phase 3: 進階功能
9. 通知模組 - 系統通知
10. 社群功能 - 討論區、作品展示

---

## 七、關鍵設計原則

### 7.1 低耦合要點

1. **模組間通過介面通訊**
   - 不直接依賴其他模組的實體類別
   - 使用 DTO (Data Transfer Object) 傳遞資料

2. **事件驅動架構**
   - 非即時操作使用事件通訊
   - 避免同步調用鏈過長

3. **資料庫隔離**
   - 每個模組獨立資料庫
   - 避免跨模組直接查詢資料庫

4. **API Gateway 統一入口**
   - 前端只與 Gateway 通訊
   - Gateway 負責路由與組合

### 7.2 可擴展性設計

1. **水平擴展**
   - 無狀態服務設計
   - 使用 Redis 做分散式 Session

2. **垂直拆分**
   - 高流量模組可獨立部署
   - 排行榜、課程查詢等讀多寫少模組使用讀寫分離

3. **快取策略**
   - 課程列表、排行榜使用 Redis 快取
   - CDN 快取靜態資源

---

## 八、總結

本設計方案將水球軟體學院平台拆分為 **9 個核心模組** + **1 個共享服務層**，每個模組職責單一、高內聚低耦合。

**核心優勢**:
- ✅ 模組獨立開發與部署
- ✅ 資料庫隔離，避免單點故障
- ✅ 事件驅動，非同步解耦
- ✅ 易於測試與維護
- ✅ 支援水平擴展

**下一步行動**:
1. 根據此架構設計 ERD（實體關係圖）
2. 定義各模組的 API 規範（OpenAPI/Swagger）
3. 搭建基礎架構（Gateway + Eureka + Config Server）
4. 按照 Phase 1 → Phase 2 → Phase 3 逐步實作

---

## 九、API 確認狀態說明

### 9.1 已確認的 API（實際調查發現）

以下 API 已通過 MCP Playwright 實際調查確認存在：

#### 認證與用戶管理
- ✅ `GET /api/users/me`
- ✅ `GET /api/users/me/notifications`
- ✅ `GET /api/users/me/journey-status`
- ✅ `GET /api/users/me/accounts/discord`
- ✅ `GET /api/users/me/accounts/github`
- ✅ `GET /api/users/me/journeys/gyms/challenges/records`
- ✅ `GET /api/users/{userId}/journeys/gyms/challenges/records`
- ✅ `GET /api/users/me/items` - 獲取用戶物品/獎勵
- ✅ `GET /api/users/{userId}/journeys/missions/progresses` - 獲取用戶任務進度
- ✅ `GET /api/users?ids={userIds}`
- ✅ `GET /api/users/occupation-mapping`
- ✅ `GET /api/users/skill-name-mapping`
- ✅ `POST /api/world:renew-token`
- ✅ `GET /api/world/enter?provider={google|facebook}`

#### 排行榜
- ✅ `GET /api/users/leaderboard?page={page}&items={items}`
- ✅ `GET /api/users/leaderboard/me`

#### 課程與旅程
- ✅ `GET /api/journeys/latest?page={page}&items={items}`
- ✅ `GET /api/journey-slug-mapping`
- ✅ `GET /api/journeys/{id}`
- ✅ `GET /api/journeys/{id}/gym-badges`
- ✅ `GET /api/journeys/{id}/chapters/{chapterId}/lessons/{lessonId}` - 獲取課程單元詳情
- ✅ `GET /api/users/me/journeys/lessons/progresses` - 獲取所有課程進度

### 9.2 推測的 API（尚未確認）

以下 API 基於前端代碼和業務邏輯推測存在，但未在調查中確認：

#### 課程進度相關
- ⚠️ `GET /api/missions/{id}` - 獲取單元詳情
- ⚠️ `POST /api/missions/{id}/progress` - 更新觀看進度
- ⚠️ `POST /api/missions/{id}/deliver` - 完成單元
- ⚠️ `GET /api/missions/{id}/notes` - 獲取筆記
- ⚠️ `POST /api/missions/{id}/notes` - 新增筆記

#### 道館提交相關
- ⚠️ `POST /api/gyms/{id}/submissions` - 提交作業
- ⚠️ `GET /api/users/{id}/submissions` - 獲取提交記錄

#### 用戶資料相關
- ⚠️ `GET /api/users/{id}/profile` - 用戶公開檔案
- ⚠️ `GET /api/users/{id}/portfolio` - 用戶作品集

#### 通知與訂單
- ⚠️ `PUT /api/notifications/{id}/read` - 標記通知為已讀
- ⚠️ `POST /api/orders` - 建立訂單
- ⚠️ `GET /api/orders/{id}` - 獲取訂單詳情

### 9.3 待調查的頁面

以下頁面需要進一步調查以確認相關 API：

1. **課程單元頁** (/journeys/[slug]/chapters/[id]/missions/[id])
   - 影片播放器相關 API
   - 課程進度追蹤 API
   - 筆記功能 API

2. **道館挑戰頁** (/journeys/[slug]/chapters/[id]/gyms/[id])
   - 作業提交相關 API
   - 審核回饋 API

3. **導航欄與側邊欄互動**
   - 通知彈出視窗內容
   - 課程切換下拉選單

---

**文件版本**: v4.0
**最後更新**: 2025-11-18
**作者**: Claude (基於 MCP Playwright 調查結果)
**更新記錄**:
- v1.0 (2025-11-18): 初始版本
- v2.0 (2025-11-18): 更新所有 API 端點,補充已確認與推測的 API 清單
- v3.0 (2025-11-18): 課程數量更新（2 門 → 5 門），新增 3 門課程資訊，更新用戶流程與 UI 功能
- v4.0 (2025-11-18): 新增 4 個確認的 API 端點（課程單元、進度、物品、任務進度），補充 HLS 影片技術細節，完善任務系統與道館列表，標記付費功能（SOP 寶典）
