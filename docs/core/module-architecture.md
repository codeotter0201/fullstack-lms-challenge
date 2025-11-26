# 水球軟體學院 LMS - 模組架構設計

## 概述

本文件定義了系統的模組劃分、職責邊界和模組間的互動方式。採用**低耦合、高內聚**的設計原則，確保模組可以獨立開發、測試和維護。

---

## 架構層級

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│              (REST Controllers / GraphQL Resolvers)         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Business Logic Layer                     │
│                     (Feature Modules)                        │
├──────────┬──────────┬───────────┬──────────┬───────────────┤
│  Auth    │  User    │  Journey  │ Progress │   Reward      │
│  Module  │  Module  │  Module   │  Module  │   Module      │
├──────────┼──────────┼───────────┼──────────┼───────────────┤
│   Gym    │Leaderboard│Notification│          │               │
│  Module  │  Module  │   Module  │          │               │
└──────────┴──────────┴───────────┴──────────┴───────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Data Access Layer                        │
│              (Repositories & Data Models)                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     Infrastructure Layer                     │
│         (Database, Cache, External Services)                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 核心模組 (Core Modules)

### 1. auth-module - 認證授權模組

#### 職責
- 處理用戶登入、註冊（OAuth 2.0）
- JWT Token 的生成、驗證、刷新
- 權限驗證（Role-Based Access Control）
- Session 管理

#### 對外 API
```typescript
interface AuthService {
  // OAuth 登入
  loginWithOAuth(provider: 'google' | 'facebook', code: string): Promise<AuthToken>;

  // Token 管理
  renewToken(refreshToken: string): Promise<AuthToken>;
  verifyToken(token: string): Promise<TokenPayload>;

  // 權限檢查
  hasPermission(userId: number, resource: string, action: string): Promise<boolean>;

  // 登出
  logout(userId: number): Promise<void>;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
```

#### 依賴
- `user-module`: 查詢或創建用戶
- `database`: 儲存 session 或 refresh token

#### API 端點
- `POST /api/auth/login` - OAuth 登入
- `POST /api/auth/register` - 註冊（透過 OAuth）
- `POST /api/world:renew-token` - 刷新 Token
- `GET /api/world/enter` - OAuth 入口

---

### 2. user-module - 用戶管理模組

#### 職責
- 用戶資料的 CRUD 操作
- 用戶等級與經驗值管理
- 第三方帳號綁定（Discord、GitHub）
- 用戶個人檔案管理

#### 對外 API
```typescript
interface UserService {
  // 用戶查詢
  getUserById(id: number): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
  getUsersByIds(ids: number[]): Promise<User[]>;

  // 用戶創建與更新
  createUser(data: CreateUserDto): Promise<User>;
  updateUser(id: number, data: UpdateUserDto): Promise<User>;

  // 等級與經驗值
  addExp(userId: number, exp: number, source: string): Promise<UserLevelUpdate>;
  getUserLevel(userId: number): Promise<LevelInfo>;

  // 第三方帳號
  bindAccount(userId: number, provider: string, accountData: any): Promise<void>;
  unbindAccount(userId: number, provider: string): Promise<void>;
  getAccountStatus(userId: number, provider: string): Promise<AccountStatus>;
}

interface UserLevelUpdate {
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  previousExp: number;
  newExp: number;
  nextLevelExp: number;
}
```

#### 依賴
- `reward-module`: 發放經驗值時通知獎勵系統
- `notification-module`: 等級提升時發送通知
- `database`: 用戶資料持久化

#### API 端點
- `GET /api/users/me` - 獲取當前用戶資訊
- `GET /api/users?ids={ids}` - 批量獲取用戶
- `GET /api/users/occupation-mapping` - 職業映射
- `GET /api/users/me/accounts/{provider}` - 帳號綁定狀態

---

### 3. journey-module - 課程管理模組

#### 職責
- 課程、章節、單元的資料管理
- 課程內容的組織和呈現
- 課程 slug 映射管理
- 技能標籤管理

#### 對外 API
```typescript
interface JourneyService {
  // 課程查詢
  getAllJourneys(page: number, items: number): Promise<Journey[]>;
  getJourneyById(id: number): Promise<Journey>;
  getJourneyBySlug(slug: string): Promise<Journey>;
  getSlugMapping(): Promise<Record<string, string>>;

  // 章節與單元
  getChaptersByJourneyId(journeyId: number): Promise<Chapter[]>;
  getLessonById(lessonId: number): Promise<Lesson>;
  getLessonContent(lessonId: number): Promise<LessonContent>;

  // 技能映射
  getSkillMapping(journeyId?: number): Promise<Record<string, string>>;
}
```

#### 依賴
- `database`: 課程資料持久化
- **無需依賴其他業務模組**（純資料查詢）

#### API 端點
- `GET /api/journeys/latest` - 獲取課程列表
- `GET /api/journey-slug-mapping` - Slug 映射
- `GET /api/journeys/{id}` - 課程詳情
- `GET /api/users/skill-name-mapping` - 技能映射

---

### 4. progress-module - 學習進度模組

#### 職責
- 追蹤用戶課程進度
- 影片播放進度更新（每 10 秒）
- 單元完成狀態管理
- 進度統計計算

#### 對外 API
```typescript
interface ProgressService {
  // 課程進度
  getUserProgress(userId: number, journeyId: number): Promise<UserProgress>;

  // 單元進度
  getLessonProgress(userId: number, lessonId: number): Promise<UserLessonProgress>;
  updateLessonProgress(userId: number, lessonId: number, data: ProgressUpdateDto): Promise<UserLessonProgress>;

  // 影片播放進度（每 10 秒更新）
  updateVideoProgress(userId: number, lessonId: number, position: number, duration: number): Promise<void>;

  // 完成單元
  completeLesson(userId: number, lessonId: number): Promise<CompletionResult>;
  deliverLesson(userId: number, lessonId: number): Promise<void>;
}

interface ProgressUpdateDto {
  lastPosition?: number;        // 影片位置（秒）
  progressPercentage?: number;  // 完成百分比
}

interface CompletionResult {
  completed: boolean;
  rewardGranted: boolean;
  expGained: number;
}
```

#### 依賴
- `journey-module`: 獲取課程單元資訊
- `reward-module`: 單元完成時發放獎勵
- `database`: 進度資料持久化

#### API 端點
- `GET /api/users/me/journey-status` - 用戶課程狀態
- `POST /api/missions/{id}/progress` - 更新進度
- `POST /api/missions/{id}/deliver` - 交付單元

---

### 5. reward-module - 獎勵系統模組

#### 職責
- 經驗值計算與發放
- 等級升級邏輯（遞增機制）
- 獎勵記錄（Audit Log）
- 金幣或其他虛擬貨幣管理（未來擴充）

#### 對外 API
```typescript
interface RewardService {
  // 發放獎勵
  grantReward(userId: number, reward: RewardData): Promise<RewardResult>;

  // 經驗值計算
  calculateExpForLesson(lessonId: number): Promise<number>;
  calculateLevel(exp: number): Promise<LevelInfo>;

  // 等級配置
  getLevelConfig(level: number): Promise<LevelConfig>;
  getAllLevelConfigs(): Promise<LevelConfig[]>;

  // 獎勵歷史
  getUserRewardHistory(userId: number, limit?: number): Promise<RewardLog[]>;
}

interface RewardData {
  sourceType: 'lesson' | 'gym' | 'mission' | 'manual';
  sourceId: number;
  exp: number;
  coin?: number;
  otherRewards?: any;
}

interface RewardResult {
  expGained: number;
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  newExp: number;
  nextLevelExp: number;
}

interface LevelInfo {
  currentLevel: number;
  currentExp: number;
  requiredExp: number;        // 到達當前等級需要的總 exp
  nextLevelExp: number;       // 到達下一等級需要的 exp
  progressToNextLevel: number; // 百分比
}
```

#### 依賴
- `user-module`: 更新用戶經驗值和等級
- `notification-module`: 升級時發送通知
- `database`: 獎勵記錄持久化

#### 等級計算公式（遞增機制）
```typescript
// 範例：Level 1→2 需要 200 exp, Level 2→3 需要 300 exp
const levelConfigs = [
  { level: 1, requiredExp: 0, expToNextLevel: 200 },
  { level: 2, requiredExp: 200, expToNextLevel: 300 },
  { level: 3, requiredExp: 500, expToNextLevel: 400 },
  { level: 4, requiredExp: 900, expToNextLevel: 500 },
  // ...
];

function calculateLevel(totalExp: number): LevelInfo {
  for (let i = levelConfigs.length - 1; i >= 0; i--) {
    if (totalExp >= levelConfigs[i].requiredExp) {
      const currentConfig = levelConfigs[i];
      const nextConfig = levelConfigs[i + 1];
      return {
        currentLevel: currentConfig.level,
        currentExp: totalExp,
        requiredExp: currentConfig.requiredExp,
        nextLevelExp: nextConfig ? nextConfig.requiredExp : Infinity,
        progressToNextLevel: nextConfig
          ? ((totalExp - currentConfig.requiredExp) / currentConfig.expToNextLevel) * 100
          : 100
      };
    }
  }
  return { currentLevel: 1, currentExp: totalExp, ... };
}
```

---

### 6. gym-module - 道館系統模組

#### 職責
- 道館挑戰管理
- 作業提交與審核
- 道館徽章管理
- 挑戰記錄查詢

#### 對外 API
```typescript
interface GymService {
  // 道館查詢
  getGymById(gymId: number): Promise<Gym>;
  getGymsByJourney(journeyId: number): Promise<Gym[]>;
  getGymBadges(journeyId: number): Promise<GymBadge[]>;

  // 提交管理
  submitGym(userId: number, gymId: number, submission: SubmissionDto): Promise<GymSubmission>;
  getSubmission(submissionId: number): Promise<GymSubmission>;
  getUserSubmissions(userId: number): Promise<GymSubmission[]>;

  // 審核（管理員功能）
  reviewSubmission(submissionId: number, review: ReviewDto): Promise<void>;

  // 挑戰記錄
  getChallengeRecords(userId: number): Promise<ChallengeRecord[]>;
}

interface SubmissionDto {
  submissionUrl?: string;
  submissionNote?: string;
  attachments?: string[];
}

interface ReviewDto {
  status: 'approved' | 'rejected' | 'revision_needed';
  reviewNote?: string;
  score?: number;
}
```

#### 依賴
- `journey-module`: 獲取道館資訊
- `reward-module`: 通過審核時發放獎勵
- `notification-module`: 審核結果通知
- `database`: 提交資料持久化

#### API 端點
- `GET /api/journeys/{id}/gym-badges` - 道館徽章
- `GET /api/users/me/journeys/gyms/challenges/records` - 挑戰記錄
- `POST /api/gyms/{id}/submissions` - 提交作業
- `GET /api/users/{id}/submissions` - 提交記錄

---

### 7. leaderboard-module - 排行榜模組

#### 職責
- 學習排行榜計算
- 排名快取與更新
- 用戶排名查詢

#### 對外 API
```typescript
interface LeaderboardService {
  // 排行榜查詢
  getLeaderboard(type: 'learning' | 'weekly', page: number, items: number): Promise<LeaderboardEntry[]>;
  getUserRank(userId: number, type: 'learning' | 'weekly'): Promise<UserRank>;

  // 排行榜更新（內部使用）
  updateUserRank(userId: number): Promise<void>;
  rebuildLeaderboard(): Promise<void>;
}

interface LeaderboardEntry {
  rank: number;
  userId: number;
  name: string;
  nickName?: string;
  occupation: string;
  jobTitle: string;
  level: number;
  exp: number;
  pictureUrl: string;
}

interface UserRank {
  rank: number;
  totalUsers: number;
  percentile: number;
}
```

#### 依賴
- `user-module`: 獲取用戶資訊
- `cache`: 排行榜快取（Redis 或記憶體）

#### API 端點
- `GET /api/users/leaderboard` - 排行榜
- `GET /api/users/leaderboard/me` - 我的排名

---

### 8. notification-module - 通知模組

#### 職責
- 通知創建與發送
- 通知狀態管理
- 批量通知處理

#### 對外 API
```typescript
interface NotificationService {
  // 發送通知
  sendNotification(userId: number, notification: NotificationDto): Promise<Notification>;
  sendBulkNotification(userIds: number[], notification: NotificationDto): Promise<void>;

  // 通知查詢
  getUserNotifications(userId: number, unreadOnly?: boolean): Promise<Notification[]>;
  markAsRead(notificationId: number): Promise<void>;
  markAllAsRead(userId: number): Promise<void>;

  // 通知模板（內部使用）
  createLevelUpNotification(userId: number, newLevel: number): Promise<void>;
  createLessonCompletedNotification(userId: number, lessonName: string): Promise<void>;
  createGymReviewedNotification(userId: number, gymName: string, status: string): Promise<void>;
}

interface NotificationDto {
  type: 'level_up' | 'lesson_completed' | 'gym_reviewed' | 'system';
  title: string;
  message: string;
  link?: string;
}
```

#### 依賴
- `database`: 通知資料持久化
- **被其他模組依賴**（user, reward, gym 等）

#### API 端點
- `GET /api/users/me/notifications` - 獲取通知

---

## 共享層 (Shared Layer)

### database - 資料庫層

#### 職責
- 資料庫連接管理
- ORM/Query Builder 封裝
- 事務管理
- 資料遷移

#### 實作策略（MVP 階段）
```typescript
// 統一的 Repository 介面
interface Repository<T> {
  findAll(options?: QueryOptions): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  findOne(where: Partial<T>): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

// MVP 階段：JSON 檔案實作
class JsonFileRepository<T> implements Repository<T> {
  // 實作細節...
}

// 未來：PostgreSQL 實作
class PostgresRepository<T> implements Repository<T> {
  // 實作細節...
}
```

---

### common - 共用工具層

#### 包含內容
- 共用型別定義 (DTOs, Interfaces)
- 工具函數 (Utils)
- 常數定義 (Constants)
- 錯誤類別 (Custom Errors)
- 驗證器 (Validators)

```typescript
// common/types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ErrorDetail;
  meta?: ResponseMeta;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// common/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super(401, 'Unauthorized', 'UNAUTHORIZED');
  }
}

// common/validators.ts
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateProgress(percentage: number): boolean {
  return percentage >= 0 && percentage <= 100;
}
```

---

### config - 配置管理層

#### 職責
- 環境變數管理
- 應用配置載入
- 密鑰管理

```typescript
// config/index.ts
export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '7d',
    refreshTokenExpiresIn: '30d',
  },

  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    facebook: {
      // ...
    },
  },

  database: {
    type: process.env.DB_TYPE || 'json', // 'json' | 'postgres'
    // PostgreSQL 配置（未來使用）
    postgres: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  },

  levelSystem: {
    // 等級配置可以從檔案或資料庫載入
    configSource: 'file', // 'file' | 'database'
    configPath: './data/level-configs.json',
  },

  video: {
    progressUpdateInterval: 10, // 秒
    completionThreshold: 100,   // 百分比
  },
};
```

---

## 模組間通訊

### 1. 直接調用（同步）

適用於簡單的資料查詢：

```typescript
// progress-module 調用 journey-module
class ProgressService {
  constructor(
    private journeyService: JourneyService
  ) {}

  async completeLesson(userId: number, lessonId: number) {
    // 查詢課程單元資訊
    const lesson = await this.journeyService.getLessonById(lessonId);
    // 處理完成邏輯...
  }
}
```

### 2. 事件驅動（非同步）

適用於跨模組的業務邏輯：

```typescript
// 事件定義
enum Events {
  LESSON_COMPLETED = 'lesson.completed',
  USER_LEVEL_UP = 'user.level_up',
  GYM_SUBMITTED = 'gym.submitted',
  GYM_REVIEWED = 'gym.reviewed',
}

// Event Bus
class EventBus {
  private handlers = new Map<string, Function[]>();

  on(event: string, handler: Function) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  emit(event: string, data: any) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

// 使用範例
// progress-module 發出事件
eventBus.emit(Events.LESSON_COMPLETED, {
  userId,
  lessonId,
  exp: lesson.reward.exp,
});

// reward-module 監聽事件
eventBus.on(Events.LESSON_COMPLETED, async (data) => {
  await rewardService.grantReward(data.userId, {
    sourceType: 'lesson',
    sourceId: data.lessonId,
    exp: data.exp,
  });
});

// notification-module 監聽升級事件
eventBus.on(Events.USER_LEVEL_UP, async (data) => {
  await notificationService.createLevelUpNotification(
    data.userId,
    data.newLevel
  );
});
```

---

## 依賴注入設計

使用依賴注入確保模組間低耦合：

```typescript
// 容器註冊
class Container {
  private services = new Map<string, any>();

  register<T>(name: string, factory: () => T) {
    this.services.set(name, factory);
  }

  resolve<T>(name: string): T {
    const factory = this.services.get(name);
    if (!factory) throw new Error(`Service ${name} not found`);
    return factory();
  }
}

// 註冊服務
const container = new Container();

container.register('journeyService', () => new JourneyService(
  container.resolve('journeyRepository')
));

container.register('progressService', () => new ProgressService(
  container.resolve('progressRepository'),
  container.resolve('journeyService'),
  container.resolve('rewardService')
));

container.register('rewardService', () => new RewardService(
  container.resolve('rewardRepository'),
  container.resolve('userService'),
  container.resolve('notificationService')
));

// 使用
const progressService = container.resolve<ProgressService>('progressService');
```

---

## MVP 階段模組優先級

### Phase 1: 核心功能（2 週）
1. ✅ **auth-module** - 認證登入（必要）
2. ✅ **user-module** - 用戶管理（必要）
3. ✅ **journey-module** - 課程資料（必要）
4. ✅ **database** - JSON 檔案實作（必要）

### Phase 2: 學習功能（2 週）
5. ✅ **progress-module** - 進度追蹤（核心）
6. ✅ **reward-module** - 經驗值系統（核心）
7. ✅ **leaderboard-module** - 排行榜（核心）

### Phase 3: 進階功能（2 週）
8. ⭕ **gym-module** - 道館系統（可簡化）
9. ⭕ **notification-module** - 通知系統（可簡化）

---

## 測試策略

### 單元測試
每個模組獨立測試，使用 Mock 模擬依賴：

```typescript
describe('ProgressService', () => {
  let progressService: ProgressService;
  let mockJourneyService: jest.Mocked<JourneyService>;
  let mockRewardService: jest.Mocked<RewardService>;

  beforeEach(() => {
    mockJourneyService = createMockJourneyService();
    mockRewardService = createMockRewardService();
    progressService = new ProgressService(
      mockProgressRepository,
      mockJourneyService,
      mockRewardService
    );
  });

  it('should complete lesson and grant reward', async () => {
    // 測試邏輯...
  });
});
```

### 整合測試
測試模組間的互動：

```typescript
describe('Lesson Completion Flow', () => {
  it('should complete lesson, grant exp, and send notification', async () => {
    // 1. 完成課程單元
    const result = await progressService.completeLesson(userId, lessonId);

    // 2. 驗證獎勵已發放
    const user = await userService.getUserById(userId);
    expect(user.exp).toBe(previousExp + 200);

    // 3. 驗證通知已發送
    const notifications = await notificationService.getUserNotifications(userId);
    expect(notifications).toContainEqual(
      expect.objectContaining({ type: 'lesson_completed' })
    );
  });
});
```

---

## 部署架構（MVP 階段）

```
┌─────────────────────────────────────────┐
│         Frontend (React/Next.js)        │
│          Port 3000 (開發環境)            │
└─────────────────────────────────────────┘
                    ↓ HTTP
┌─────────────────────────────────────────┐
│      Backend API (Node.js/NestJS)       │
│          Port 4000 (開發環境)            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Feature Modules (業務邏輯)   │   │
│  └─────────────────────────────────┘   │
│                 ↓                       │
│  ┌─────────────────────────────────┐   │
│  │   Data Layer (JSON Files)       │   │
│  │   - data/users.json             │   │
│  │   - data/journeys.json          │   │
│  │   - data/progress.json          │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 未來擴展考慮

### 微服務架構
當系統規模增長時，可以將模組拆分為獨立的微服務：

```
Auth Service  → User Service → Journey Service
                      ↓              ↓
                Progress Service ← Gym Service
                      ↓
                Reward Service → Notification Service
```

### 快取層
- 使用 Redis 快取排行榜
- 快取課程資料（較少變動）
- 快取用戶 session

### 訊息佇列
- 使用 RabbitMQ 或 Kafka 處理事件
- 非同步處理獎勵發放
- 批量通知發送

---

## 更新日期
- 2025-11-18：初版設計，定義 8 個核心模組和共享層
