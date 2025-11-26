# 水球軟體學院 LMS - Data Models 設計

## 概述

本文件定義了完整的資料模型設計，包含 TypeScript interfaces 和對應的 PostgreSQL schema。雖然 MVP 階段不使用 PostgreSQL，但資料結構設計已考慮未來遷移的需求。

---

## 1. 用戶系統 (User Domain)

### 1.1 User - 用戶

**用途**: 儲存用戶基本資料、等級、經驗值

#### TypeScript Interface
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  nickName?: string;              // 暱稱（注意：駝峰式命名）
  occupation: string;             // 職業類型（如 "JUNIOR_PROGRAMMER"）
  jobTitle?: string;              // 職稱顯示名稱（如 "初級工程師"）
  level: number;                  // 當前等級
  exp: number;                    // 當前經驗值
  nextLevelExp: number;           // 升級所需經驗值
  pictureUrl: string;             // 頭像 URL
  roles: string[];                // 用戶角色（如 ["user", "admin"]）

  // 個人檔案額外欄位
  birthday?: string;              // 生日（ISO date string）
  gender?: string;                // 性別
  region?: string;                // 地區
  githubLink?: string;            // GitHub 連結

  // 時間戳記
  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  nick_name VARCHAR(100),
  occupation VARCHAR(50) NOT NULL DEFAULT 'JUNIOR_PROGRAMMER',
  job_title VARCHAR(100),
  level INTEGER NOT NULL DEFAULT 1,
  exp INTEGER NOT NULL DEFAULT 0,
  next_level_exp INTEGER NOT NULL DEFAULT 200,
  picture_url TEXT NOT NULL,
  roles TEXT[] DEFAULT ARRAY['user']::TEXT[],

  -- 個人檔案
  birthday DATE,
  gender VARCHAR(20),
  region VARCHAR(100),
  github_link VARCHAR(255),

  -- 時間戳記
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_exp ON users(exp DESC);
```

---

### 1.2 UserAccount - 第三方帳號綁定

**用途**: 儲存用戶綁定的第三方帳號（Discord、GitHub）

#### TypeScript Interface
```typescript
interface UserAccount {
  id: number;
  userId: number;
  provider: 'discord' | 'github' | 'google' | 'facebook';
  providerAccountId: string;      // 第三方平台的用戶 ID
  accessToken?: string;           // 存取權杖（加密儲存）
  refreshToken?: string;          // 刷新權杖（加密儲存）
  expiresAt?: Date;               // 權杖過期時間
  bound: boolean;                 // 是否已綁定

  // GitHub 專用
  availableRepos?: string[];      // 可用的 GitHub repositories

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE user_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(20) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  bound BOOLEAN DEFAULT false,

  -- GitHub 專用
  available_repos TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, provider)
);

CREATE INDEX idx_user_accounts_user_id ON user_accounts(user_id);
```

---

### 1.3 UserProgress - 用戶課程進度

**用途**: 追蹤用戶在特定課程中的整體進度

#### TypeScript Interface
```typescript
interface UserProgress {
  id: number;
  userId: number;
  journeyId: number;

  // 進度統計
  completedLessons: number;       // 已完成單元數
  totalLessons: number;           // 總單元數
  progressPercentage: number;     // 整體完成百分比

  // 狀態
  status: 'not_started' | 'in_progress' | 'completed';
  startedAt?: Date;               // 開始學習時間
  completedAt?: Date;             // 完成時間

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE user_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,

  -- 進度統計
  completed_lessons INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,

  -- 狀態
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, journey_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_journey_id ON user_progress(journey_id);
```

---

### 1.4 UserLessonProgress - 用戶單元學習進度

**用途**: 追蹤用戶在特定課程單元的學習進度（特別是影片播放進度）

#### TypeScript Interface
```typescript
interface UserLessonProgress {
  id: number;
  userId: number;
  lessonId: number;
  journeyId: number;
  chapterId: number;

  // 進度資訊
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;     // 完成百分比 (0-100)

  // 影片專用
  lastPosition?: number;          // 最後觀看位置（秒）
  videoDuration?: number;         // 影片總長度（秒）
  watchCount: number;             // 觀看次數

  // 時間記錄
  startedAt?: Date;               // 第一次開始時間
  completedAt?: Date;             // 完成時間（達到 100%）
  lastAccessedAt: Date;           // 最後存取時間

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE user_lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,

  -- 進度資訊
  status VARCHAR(20) NOT NULL DEFAULT 'not_started',
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,

  -- 影片專用
  last_position INTEGER,          -- 秒數
  video_duration INTEGER,         -- 秒數
  watch_count INTEGER NOT NULL DEFAULT 0,

  -- 時間記錄
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_lesson_progress_user_id ON user_lesson_progress(user_id);
CREATE INDEX idx_user_lesson_progress_lesson_id ON user_lesson_progress(lesson_id);
CREATE INDEX idx_user_lesson_progress_status ON user_lesson_progress(status);
```

---

## 2. 課程系統 (Journey Domain)

### 2.1 Journey - 課程

**用途**: 課程主體資料

#### TypeScript Interface
```typescript
interface Journey {
  id: number;
  name: string;
  slug: string;                   // URL 友善的識別碼
  description?: string;
  coverImageUrl?: string;

  // 技能標籤
  skills: number[];               // 技能 ID 陣列

  // 課程統計
  totalChapters: number;
  totalLessons: number;
  totalGyms: number;

  // 排序與狀態
  displayOrder: number;
  isPublished: boolean;
  isPremium: boolean;             // 是否需要付費

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE journeys (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,

  -- 技能標籤（使用 PostgreSQL array）
  skills INTEGER[],

  -- 課程統計
  total_chapters INTEGER NOT NULL DEFAULT 0,
  total_lessons INTEGER NOT NULL DEFAULT 0,
  total_gyms INTEGER NOT NULL DEFAULT 0,

  -- 排序與狀態
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_journeys_slug ON journeys(slug);
CREATE INDEX idx_journeys_is_published ON journeys(is_published);
```

---

### 2.2 Chapter - 章節

**用途**: 課程的章節/副本

#### TypeScript Interface
```typescript
interface Chapter {
  id: number;
  journeyId: number;
  name: string;
  description?: string;

  // 排序
  displayOrder: number;

  // 權限控制
  passwordRequired: boolean;
  password?: string;              // 如果需要密碼

  // 獎勵
  reward: Reward;

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE chapters (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- 排序
  display_order INTEGER NOT NULL DEFAULT 0,

  -- 權限控制
  password_required BOOLEAN DEFAULT false,
  password VARCHAR(100),

  -- 獎勵（JSON 格式儲存）
  reward JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chapters_journey_id ON chapters(journey_id);
CREATE INDEX idx_chapters_display_order ON chapters(journey_id, display_order);
```

---

### 2.3 Lesson - 課程單元

**用途**: 具體的課程單元（影片、文章、問卷等）

#### TypeScript Interface
```typescript
interface Lesson {
  id: number;
  journeyId: number;
  chapterId: number;
  name: string;
  description?: string;

  // 單元類型
  type: 'video' | 'scroll' | 'google-form';

  // 內容 ID（關聯到 LessonContent）
  contentId?: number;

  // 權限
  premiumOnly: boolean;           // 是否僅限付費用戶

  // 排序
  displayOrder: number;

  // 獎勵
  reward: Reward;

  // 影片專用
  videoLength?: string;           // 如 "08:33"
  videoDuration?: number;         // 秒數

  createdAt: Date;
  updatedAt: Date;
}

interface Reward {
  exp: number;                    // 經驗值
  coin: number;                   // 金幣
  subscriptionExtensionInDays: number;
  journeyId: number;
  externalRewardDescription: string;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- 單元類型
  type VARCHAR(20) NOT NULL,      -- 'video', 'scroll', 'google-form'

  -- 內容 ID
  content_id INTEGER REFERENCES lesson_contents(id) ON DELETE SET NULL,

  -- 權限
  premium_only BOOLEAN DEFAULT false,

  -- 排序
  display_order INTEGER NOT NULL DEFAULT 0,

  -- 獎勵（JSON 格式）
  reward JSONB NOT NULL DEFAULT '{"exp": 0, "coin": 0, "subscriptionExtensionInDays": 0, "journeyId": 0, "externalRewardDescription": ""}'::jsonb,

  -- 影片專用
  video_length VARCHAR(10),       -- 如 "08:33"
  video_duration INTEGER,         -- 秒數

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lessons_journey_id ON lessons(journey_id);
CREATE INDEX idx_lessons_chapter_id ON lessons(chapter_id);
CREATE INDEX idx_lessons_type ON lessons(type);
CREATE INDEX idx_lessons_display_order ON lessons(chapter_id, display_order);
```

---

### 2.4 LessonContent - 課程單元內容

**用途**: 儲存課程單元的實際內容

#### TypeScript Interface
```typescript
interface LessonContent {
  id: number;
  lessonId: number;
  type: 'video' | 'scroll' | 'google-form';

  // 影片內容
  videoUrl?: string;              // YouTube URL 或其他影片平台
  videoProvider?: 'youtube' | 'vimeo' | 'custom';
  videoEmbedCode?: string;        // 嵌入代碼

  // 文章內容
  markdownContent?: string;       // Markdown 格式的文章內容
  htmlContent?: string;           // 渲染後的 HTML（可選）

  // Google Form
  googleFormUrl?: string;         // Google Form 連結

  // 資源檔案
  attachments?: string[];         // 附件 URL 陣列

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE lesson_contents (
  id SERIAL PRIMARY KEY,
  lesson_id INTEGER UNIQUE REFERENCES lessons(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,

  -- 影片內容
  video_url TEXT,
  video_provider VARCHAR(20),
  video_embed_code TEXT,

  -- 文章內容
  markdown_content TEXT,
  html_content TEXT,

  -- Google Form
  google_form_url TEXT,

  -- 資源檔案
  attachments TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lesson_contents_lesson_id ON lesson_contents(lesson_id);
```

---

## 3. 道館系統 (Gym Domain)

### 3.1 Gym - 道館

**用途**: 道館挑戰資料

#### TypeScript Interface
```typescript
interface Gym {
  id: number;
  journeyId: number;
  chapterId: number;
  name: string;
  description?: string;

  // 難度與類型
  difficulty: number;             // 星級 (1-5)
  type: 'white' | 'black';        // 白段 or 黑段

  // 挑戰內容
  challengeDescription: string;   // 挑戰說明
  requirementDescription?: string; // 繳交要求

  // 獎勵
  reward: Reward;

  // 排序
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE gyms (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,

  -- 難度與類型
  difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  type VARCHAR(10) NOT NULL,      -- 'white' or 'black'

  -- 挑戰內容
  challenge_description TEXT NOT NULL,
  requirement_description TEXT,

  -- 獎勵（JSON 格式）
  reward JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- 排序
  display_order INTEGER NOT NULL DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gyms_journey_id ON gyms(journey_id);
CREATE INDEX idx_gyms_chapter_id ON gyms(chapter_id);
CREATE INDEX idx_gyms_type ON gyms(type);
```

---

### 3.2 GymSubmission - 道館提交

**用途**: 用戶提交的道館作業

#### TypeScript Interface
```typescript
interface GymSubmission {
  id: number;
  userId: number;
  gymId: number;
  journeyId: number;
  chapterId: number;

  // 提交內容
  submissionUrl?: string;         // GitHub Repo URL 或其他連結
  submissionNote?: string;        // 提交說明
  attachments?: string[];         // 附件 URL

  // 狀態
  status: 'pending' | 'approved' | 'rejected' | 'revision_needed';

  // 評審資訊
  reviewedBy?: number;            // 評審者 ID
  reviewNote?: string;            // 評審意見
  reviewedAt?: Date;

  // 分數（可選）
  score?: number;

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE gym_submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  gym_id INTEGER NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,

  -- 提交內容
  submission_url TEXT,
  submission_note TEXT,
  attachments TEXT[],

  -- 狀態
  status VARCHAR(20) NOT NULL DEFAULT 'pending',

  -- 評審資訊
  reviewed_by INTEGER REFERENCES users(id),
  review_note TEXT,
  reviewed_at TIMESTAMP WITH TIME ZONE,

  -- 分數
  score INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gym_submissions_user_id ON gym_submissions(user_id);
CREATE INDEX idx_gym_submissions_gym_id ON gym_submissions(gym_id);
CREATE INDEX idx_gym_submissions_status ON gym_submissions(status);
```

---

### 3.3 GymBadge - 道館徽章

**用途**: 道館對應的徽章資料

#### TypeScript Interface
```typescript
interface GymBadge {
  id: number;
  gymId: number;
  journeyId: number;
  chapterId: number;
  name: string;
  imageUrl: string;               // 徽章圖片 URL

  createdAt: Date;
  updatedAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE gym_badges (
  id SERIAL PRIMARY KEY,
  gym_id INTEGER UNIQUE NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  journey_id INTEGER NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  chapter_id INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gym_badges_gym_id ON gym_badges(gym_id);
CREATE INDEX idx_gym_badges_journey_id ON gym_badges(journey_id);
```

---

## 4. 經驗值與獎勵系統 (Reward Domain)

### 4.1 LevelConfig - 等級配置

**用途**: 定義每個等級所需的經驗值（遞增機制）

#### TypeScript Interface
```typescript
interface LevelConfig {
  level: number;
  requiredExp: number;            // 從 0 級到此級所需的總經驗值
  expToNextLevel: number;         // 升到下一級需要的經驗值差
  title?: string;                 // 等級稱號（可選）
  perks?: string[];               // 等級特權（可選）
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE level_configs (
  level INTEGER PRIMARY KEY,
  required_exp INTEGER NOT NULL,  -- 從 0 級到此級的總經驗值
  exp_to_next_level INTEGER NOT NULL,
  title VARCHAR(50),
  perks TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 初始化等級配置（範例：遞增機制）
INSERT INTO level_configs (level, required_exp, exp_to_next_level, title) VALUES
  (1, 0, 200, '新手'),
  (2, 200, 300, '學徒'),
  (3, 500, 400, '進階'),
  (4, 900, 500, '專家'),
  (5, 1400, 600, '大師');
```

---

### 4.2 RewardLog - 獎勵記錄

**用途**: 記錄所有經驗值和獎勵的發放

#### TypeScript Interface
```typescript
interface RewardLog {
  id: number;
  userId: number;

  // 獎勵來源
  sourceType: 'lesson' | 'gym' | 'mission' | 'manual';
  sourceId: number;               // 來源 ID（如 lessonId, gymId）

  // 獎勵內容
  expGained: number;
  coinGained: number;
  otherRewards?: string;          // 其他獎勵描述（JSON）

  // 用戶狀態（發放時）
  userLevelBefore: number;
  userExpBefore: number;
  userLevelAfter: number;
  userExpAfter: number;
  leveledUp: boolean;             // 是否升級

  createdAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE reward_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 獎勵來源
  source_type VARCHAR(20) NOT NULL,
  source_id INTEGER NOT NULL,

  -- 獎勵內容
  exp_gained INTEGER NOT NULL DEFAULT 0,
  coin_gained INTEGER NOT NULL DEFAULT 0,
  other_rewards JSONB,

  -- 用戶狀態
  user_level_before INTEGER NOT NULL,
  user_exp_before INTEGER NOT NULL,
  user_level_after INTEGER NOT NULL,
  user_exp_after INTEGER NOT NULL,
  leveled_up BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reward_logs_user_id ON reward_logs(user_id);
CREATE INDEX idx_reward_logs_source ON reward_logs(source_type, source_id);
CREATE INDEX idx_reward_logs_created_at ON reward_logs(created_at DESC);
```

---

## 5. 通知系統 (Notification Domain)

### 5.1 Notification - 通知

**用途**: 用戶通知資料

#### TypeScript Interface
```typescript
interface Notification {
  id: number;
  userId: number;

  // 通知內容
  type: 'level_up' | 'lesson_completed' | 'gym_reviewed' | 'system';
  title: string;
  message: string;
  link?: string;                  // 點擊後跳轉的連結

  // 狀態
  isRead: boolean;
  readAt?: Date;

  createdAt: Date;
}
```

#### PostgreSQL Schema
```sql
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- 通知內容
  type VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  link TEXT,

  -- 狀態
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## 6. 輔助資料表

### 6.1 OccupationMapping - 職業映射

**用途**: 職業代碼到顯示名稱的映射

```sql
CREATE TABLE occupation_mappings (
  code VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  display_order INTEGER DEFAULT 0
);

INSERT INTO occupation_mappings (code, name, display_order) VALUES
  ('JUNIOR_PROGRAMMER', '初級工程師', 1),
  ('PROGRAMMER', '工程師', 2),
  ('SENIOR_PROGRAMMER', '資深工程師', 3),
  ('ARCHITECT', '架構師', 4);
```

---

### 6.2 SkillMapping - 技能映射

**用途**: 技能 ID 到名稱的映射

```sql
CREATE TABLE skill_mappings (
  id SERIAL PRIMARY KEY,
  journey_id INTEGER REFERENCES journeys(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_skill_mappings_journey_id ON skill_mappings(journey_id);
```

---

## 7. 資料關聯圖

```
User (用戶)
  ├─ UserAccount (第三方帳號)
  ├─ UserProgress (課程進度)
  ├─ UserLessonProgress (單元進度)
  ├─ GymSubmission (道館提交)
  ├─ RewardLog (獎勵記錄)
  └─ Notification (通知)

Journey (課程)
  ├─ Chapter (章節)
  │   ├─ Lesson (課程單元)
  │   │   └─ LessonContent (單元內容)
  │   └─ Gym (道館)
  │       ├─ GymBadge (徽章)
  │       └─ GymSubmission (提交)
  └─ UserProgress (用戶進度)
```

---

## 8. MVP 階段簡化策略

### 使用 JSON 檔案模擬

在 MVP 階段，可以用以下方式模擬資料：

```typescript
// data/users.json
{
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "name": "Test User",
      "level": 1,
      "exp": 0,
      "nextLevelExp": 200,
      ...
    }
  ]
}

// data/journeys.json
// data/lessons.json
// data/user-progress.json
```

### 資料操作層設計

即使使用 JSON，也應該設計統一的資料操作介面：

```typescript
interface DataRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}
```

這樣未來遷移到 PostgreSQL 時，只需要替換底層實作即可。

---

## 9. 索引策略建議

### 高頻查詢索引
- `users.email` - 登入查詢
- `users.exp DESC` - 排行榜查詢
- `user_lesson_progress(user_id, lesson_id)` - 進度查詢
- `lessons(chapter_id, display_order)` - 課程列表
- `reward_logs.created_at DESC` - 最近獎勵記錄

### 複合索引
```sql
CREATE INDEX idx_user_progress_composite ON user_progress(user_id, journey_id, status);
CREATE INDEX idx_lessons_composite ON lessons(journey_id, chapter_id, display_order);
```

---

## 10. 資料完整性規則

### 外鍵約束
- 所有關聯欄位都應設定 `REFERENCES` 和適當的 `ON DELETE` 行為
- 用戶刪除時：`CASCADE` 刪除所有關聯資料
- 課程刪除時：`CASCADE` 刪除章節、單元，但保留用戶進度記錄（改為 `SET NULL`）

### 檢查約束
```sql
ALTER TABLE gyms ADD CONSTRAINT check_difficulty
  CHECK (difficulty BETWEEN 1 AND 5);

ALTER TABLE user_lesson_progress ADD CONSTRAINT check_percentage
  CHECK (progress_percentage BETWEEN 0 AND 100);

ALTER TABLE users ADD CONSTRAINT check_exp
  CHECK (exp >= 0 AND level >= 1);
```

---

## 更新日期
- 2025-11-18：初版設計，基於水球平台 API 調查結果
