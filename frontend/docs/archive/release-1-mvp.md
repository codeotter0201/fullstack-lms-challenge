# Release 1 MVP: 使用者可以上課

## 📋 目標

實現核心需求：**使用者可以上課**

使用者能夠登入、瀏覽課程、觀看影片、追蹤進度、獲得經驗值並升級

---

## 🎯 核心功能範圍

### ✅ Release 1 包含

1. **使用者認證** - OAuth 登入（或測試登入）
2. **課程瀏覽** - 查看所有課程、章節、課程單元
3. **影片播放** - YouTube 嵌入式播放器
4. **進度追蹤** - 每 10 秒自動更新觀看位置
5. **自動完成** - 觀看到 100% 自動標記完成
6. **經驗值系統** - 完成課程獲得固定經驗值
7. **等級系統** - 遞增經驗值升級（Lv1→2: 200 exp, Lv2→3: 300 exp）
8. **升級提示** - 升級時顯示動畫

### ❌ Release 1 不包含（延後到 Release 2+）

- Gym 挑戰系統
- 排行榜
- 通知資料庫（僅顯示即時 toast）
- 社群帳號連結
- 筆記功能
- 付費內容限制

---

## 🏗️ 技術架構

### 後端模組（5 個核心模組）

#### 1. auth-module（認證模組）
**職責：**
- OAuth 認證流程（Google/Facebook）
- JWT token 產生與驗證
- 測試登入（開發階段）

**API：**
```typescript
POST /api/auth/login
POST /api/world:renew-token
```

#### 2. user-module（使用者模組）
**職責：**
- 使用者 CRUD
- 使用者狀態管理（等級、經驗值）
- 個人資料查詢

**資料模型：**
```typescript
interface User {
  id: number;
  email: string;
  name: string;
  nickName?: string;
  level: number;              // 當前等級
  exp: number;                // 當前經驗值
  nextLevelExp: number;       // 下一級所需經驗值
  pictureUrl: string;
  createdAt: Date;
}
```

**API：**
```typescript
GET /api/users/me
```

#### 3. journey-module（課程模組）
**職責：**
- 讀取課程資料（從 JSON 檔案）
- 課程、章節、課程單元查詢
- 課程結構導覽

**資料模型：**
```typescript
interface Journey {
  id: number;
  name: string;
  slug: string;
  description?: string;
  chapters: Chapter[];
}

interface Chapter {
  id: number;
  journeyId: number;
  name: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  journeyId: number;
  chapterId: number;
  name: string;
  type: 'video' | 'scroll' | 'google-form';
  videoUrl?: string;
  videoLength?: string;       // 顯示用（如 "8:33"）
  reward: {
    exp: number;              // 固定經驗值 100-300
  };
}
```

**API：**
```typescript
GET /api/journeys/latest
GET /api/journey-slug-mapping
GET /api/journeys/{id}
```

#### 4. progress-module（進度模組）
**職責：**
- 追蹤影片觀看位置
- 每 10 秒更新進度
- 課程完成度計算
- 自動完成檢測（100% → 觸發交付）

**資料模型：**
```typescript
interface UserLessonProgress {
  id: number;
  userId: number;
  lessonId: number;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number; // 0-100
  lastPosition?: number;      // 影片位置（秒）
  videoDuration?: number;     // 總長度（秒）
  watchCount: number;         // 觀看次數
  completedAt?: Date;
  lastAccessedAt: Date;
}

interface UserProgress {
  id: number;
  userId: number;
  journeyId: number;
  completedLessons: number;
  totalLessons: number;
  status: 'not_started' | 'in_progress' | 'completed';
}
```

**API：**
```typescript
GET  /api/missions/{lessonId}
POST /api/missions/{lessonId}/progress
POST /api/missions/{lessonId}/deliver
```

#### 5. reward-module（獎勵模組）
**職責：**
- 經驗值發放
- 等級計算
- 升級檢測
- 重複獎勵防止

**資料模型：**
```typescript
interface RewardLog {
  id: number;
  userId: number;
  sourceType: 'lesson';       // MVP 只有 lesson
  sourceId: number;           // lessonId
  expGained: number;
  userExpBefore: number;
  userExpAfter: number;
  leveledUp: boolean;
  previousLevel?: number;
  newLevel?: number;
  createdAt: Date;
}

interface LevelConfig {
  level: number;
  requiredExp: number;        // 此等級起始經驗值
  expToNextLevel: number;     // 升下一級需要多少
  title: string;              // 等級稱號
}
```

**等級配置（硬編碼）：**
```typescript
const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, requiredExp: 0, expToNextLevel: 200, title: '新手' },
  { level: 2, requiredExp: 200, expToNextLevel: 300, title: '學徒' },
  { level: 3, requiredExp: 500, expToNextLevel: 400, title: '進階者' },
  { level: 4, requiredExp: 900, expToNextLevel: 500, title: '熟練者' },
  { level: 5, requiredExp: 1400, expToNextLevel: 600, title: '專家' },
  { level: 6, requiredExp: 2000, expToNextLevel: 700, title: '大師' },
  { level: 7, requiredExp: 2700, expToNextLevel: 800, title: '宗師' },
  { level: 8, requiredExp: 3500, expToNextLevel: 900, title: '傳奇' },
  { level: 9, requiredExp: 4400, expToNextLevel: 1000, title: '神話' },
  { level: 10, requiredExp: 5400, expToNextLevel: 0, title: '至尊' },
];
```

### 資料儲存

**MVP 階段：JSON 檔案**

```
data/
├── users.json
├── journeys.json
├── user-lesson-progress.json
├── user-progress.json
└── reward-logs.json
```

**Repository 模式：**
```typescript
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  findOne(filter: Partial<T>): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  delete(id: number): Promise<void>;
}

// 實作可替換：JsonRepository → PostgresRepository
class JsonUserRepository implements Repository<User> { ... }
```

---

## 🎨 前端架構

### 頁面結構（4 個核心頁面）

#### 1. 登入頁 `/sign-in`
**功能：**
- OAuth 登入按鈕（Google/Facebook）
- 或測試登入（開發用）

**API 呼叫：**
```typescript
POST /api/auth/login
// 成功後設定 cookie，跳轉到 /
```

---

#### 2. 課程總覽 `/`
**功能：**
- 顯示使用者資訊（名稱、等級、經驗值進度條）
- 顯示所有課程卡片
- 點擊進入課程詳情

**元件：**
```tsx
<Dashboard>
  <Navigation>
    <UserLevelBadge level={2} exp={350} nextLevelExp={500} />
  </Navigation>

  <CourseList>
    <CourseCard
      title="Software Design Pattern"
      slug="software-design-pattern"
      chapterCount={3}
      completedLessons={2}
      totalLessons={6}
    />
  </CourseList>
</Dashboard>
```

**API 呼叫：**
```typescript
GET /api/users/me
GET /api/journeys/latest
```

---

#### 3. 課程詳情 `/journeys/{slug}`
**功能：**
- 顯示課程標題、描述
- 顯示所有章節
- 每個章節展開顯示課程單元列表
- 課程單元狀態：未開始 / 進行中 / 已完成

**元件：**
```tsx
<CourseView>
  <CourseHeader title="Software Design Pattern" />

  <ChapterList>
    <ChapterCard name="Basics" chapterId={1}>
      <LessonList>
        <LessonCard
          name="OOP Fundamentals"
          type="video"
          duration="8:33"
          status="completed"
          exp={200}
        />
        <LessonCard
          name="Design Principles"
          type="scroll"
          status="in_progress"
          exp={150}
        />
      </LessonList>
    </ChapterCard>
  </ChapterList>
</CourseView>
```

**API 呼叫：**
```typescript
GET /api/journeys/{id}
```

---

#### 4. 課程播放器 `/journeys/{slug}/chapters/{chapterId}/missions/{lessonId}`
**功能：**
- 影片播放（YouTube 嵌入或 HTML5）
- 進度條顯示
- 每 10 秒自動儲存進度
- 100% 自動完成並顯示獎勵 modal
- 下一課程按鈕

**元件：**
```tsx
<LessonPlayer>
  <VideoPlayer
    videoUrl={lesson.videoUrl}
    initialPosition={progress.lastPosition}
    onProgressUpdate={(position, duration, percentage) => {
      // 每 10 秒呼叫一次
      updateProgress(lessonId, position, duration, percentage);
    }}
    onComplete={() => {
      // 100% 時自動觸發
      deliverLesson(lessonId);
    }}
  />

  <ProgressBar value={progress.progressPercentage} />

  {showRewardModal && (
    <RewardModal
      expGained={200}
      leveledUp={true}
      newLevel={2}
    />
  )}

  <NextLessonButton />
</LessonPlayer>
```

**API 呼叫：**
```typescript
// 載入時
GET /api/missions/{lessonId}

// 每 10 秒
POST /api/missions/{lessonId}/progress
{
  lastPosition: 120,
  videoDuration: 513,
  progressPercentage: 23.4
}

// 100% 時自動呼叫
POST /api/missions/{lessonId}/deliver
// Response:
{
  status: "completed",
  progress: { ... },
  reward: {
    expGained: 200,
    leveledUp: true,
    previousLevel: 1,
    newLevel: 2,
    newExp: 300,
    nextLevelExp: 500
  }
}
```

---

## 🔄 使用者流程

### 完整流程圖

```
1. [登入頁面]
   ↓ 點擊 "Sign in with Google"
   ↓ OAuth 認證

2. [課程總覽]
   ↓ 顯示：等級、經驗值、所有課程
   ↓ 點擊 "Software Design Pattern"

3. [課程詳情]
   ↓ 顯示：3 個章節、每章 2 個課程單元
   ↓ 點擊 Chapter 1 > "OOP Fundamentals"

4. [課程播放器]
   ↓ 載入影片 + 上次觀看位置
   ↓ 開始播放
   ↓ 每 10 秒：自動更新進度到後端
   ↓ 觀看到 100%
   ↓ 自動標記完成

5. [獎勵 Modal]
   ↓ 顯示 "🎉 課程完成！+200 EXP"
   ↓ 若升級：顯示 "Lv.1 → Lv.2 ✨"
   ↓ 點擊 "下一課程" 或 "返回課程"

6. [返回課程詳情]
   ↓ Chapter 1 顯示 1/2 已完成
   ↓ 繼續下一課程...
```

### 核心互動細節

#### 影片進度追蹤流程

```typescript
// 前端：每 10 秒執行
useEffect(() => {
  const interval = setInterval(() => {
    if (player && videoDuration > 0) {
      const currentTime = player.getCurrentTime();
      const progressPercentage = (currentTime / videoDuration) * 100;

      // API 呼叫
      updateProgress({
        lastPosition: Math.floor(currentTime),
        videoDuration: videoDuration,
        progressPercentage: Math.min(progressPercentage, 100),
      });

      // 檢查是否完成
      if (progressPercentage >= 100 && !completed) {
        setCompleted(true);
        handleComplete(); // 顯示 modal
      }
    }
  }, 10000); // 10 秒

  return () => clearInterval(interval);
}, [videoDuration, completed]);
```

#### 自動完成與獎勵流程

```typescript
// 後端：progress-module
async function updateProgress(userId, lessonId, data) {
  // 更新進度
  const progress = await progressRepository.update({
    userId,
    lessonId,
    lastPosition: data.lastPosition,
    progressPercentage: data.progressPercentage,
    videoDuration: data.videoDuration,
  });

  // 檢查是否達到 100%
  if (data.progressPercentage >= 100 && progress.status !== 'completed') {
    // 自動觸發交付
    const result = await deliverLesson(userId, lessonId);
    return {
      status: 'completed',
      progress: result.progress,
      reward: result.reward,
    };
  }

  return { status: 'updated', progress };
}

// 後端：交付課程
async function deliverLesson(userId, lessonId) {
  // 1. 標記完成
  const progress = await progressRepository.update({
    userId,
    lessonId,
    status: 'completed',
    completedAt: new Date(),
  });

  // 2. 發放獎勵
  const lesson = await lessonRepository.findById(lessonId);
  const rewardResult = await rewardService.grantReward(userId, {
    sourceType: 'lesson',
    sourceId: lessonId,
    exp: lesson.reward.exp,
  });

  // 3. 更新課程進度
  await updateJourneyProgress(userId, lesson.journeyId);

  return {
    progress,
    reward: rewardResult,
  };
}

// 後端：reward-module
async function grantReward(userId, reward) {
  // 1. 檢查是否已領取
  const existingReward = await rewardLogRepository.findOne({
    userId,
    sourceType: reward.sourceType,
    sourceId: reward.sourceId,
  });

  if (existingReward) {
    return { success: false, message: '已領取過此獎勵' };
  }

  // 2. 計算新經驗值與等級
  const user = await userRepository.findById(userId);
  const newExp = user.exp + reward.exp;
  const levelInfo = calculateLevel(newExp);

  const leveledUp = levelInfo.currentLevel > user.level;

  // 3. 更新使用者
  await userRepository.update(userId, {
    exp: newExp,
    level: levelInfo.currentLevel,
    nextLevelExp: levelInfo.nextLevelExp,
  });

  // 4. 記錄獎勵
  await rewardLogRepository.create({
    userId,
    sourceType: reward.sourceType,
    sourceId: reward.sourceId,
    expGained: reward.exp,
    userExpBefore: user.exp,
    userExpAfter: newExp,
    leveledUp,
    previousLevel: user.level,
    newLevel: levelInfo.currentLevel,
  });

  return {
    success: true,
    expGained: reward.exp,
    leveledUp,
    previousLevel: user.level,
    newLevel: levelInfo.currentLevel,
    newExp,
    nextLevelExp: levelInfo.nextLevelExp,
  };
}

// 等級計算
function calculateLevel(exp: number): LevelInfo {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    const config = LEVEL_CONFIGS[i];
    if (exp >= config.requiredExp) {
      return {
        currentLevel: config.level,
        requiredExp: config.requiredExp,
        nextLevelExp: config.requiredExp + config.expToNextLevel,
        expToNextLevel: config.expToNextLevel,
        progressToNext: config.expToNextLevel > 0
          ? ((exp - config.requiredExp) / config.expToNextLevel) * 100
          : 100,
        title: config.title,
      };
    }
  }
  return LEVEL_CONFIGS[0]; // 預設 Lv.1
}
```

---

## 📝 API 規格

### 1. 認證 API

#### `POST /api/auth/login`
**請求：**
```typescript
// OAuth
GET /api/world/enter?provider=google
// 重導向到 Google OAuth

// 測試登入（開發用）
POST /api/auth/login
{
  "testUserId": 1
}
```

**回應：**
```typescript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "level": 2,
    "exp": 350,
    "nextLevelExp": 500
  }
}
// Set cookie: auth_token={token}
```

---

### 2. 使用者 API

#### `GET /api/users/me`
**回應：**
```typescript
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "nickName": "Johnny",
  "level": 2,
  "exp": 350,
  "nextLevelExp": 500,
  "pictureUrl": "https://...",
  "createdAt": "2025-11-18T00:00:00Z"
}
```

---

### 3. 課程 API

#### `GET /api/journeys/latest`
**回應：**
```typescript
[
  {
    "id": 0,
    "name": "Software Design Pattern",
    "slug": "software-design-pattern",
    "description": "學習常見的設計模式...",
    "chapterCount": 3,
    "totalLessons": 6,
    "userProgress": {
      "completedLessons": 2,
      "status": "in_progress"
    }
  }
]
```

#### `GET /api/journeys/{id}`
**回應：**
```typescript
{
  "id": 0,
  "name": "Software Design Pattern",
  "slug": "software-design-pattern",
  "description": "學習常見的設計模式...",
  "chapters": [
    {
      "id": 1,
      "name": "Basics",
      "lessons": [
        {
          "id": 1,
          "name": "OOP Fundamentals",
          "type": "video",
          "videoLength": "8:33",
          "reward": { "exp": 200 },
          "userProgress": {
            "status": "completed",
            "progressPercentage": 100
          }
        },
        {
          "id": 2,
          "name": "Design Principles",
          "type": "scroll",
          "reward": { "exp": 150 },
          "userProgress": {
            "status": "in_progress",
            "progressPercentage": 45
          }
        }
      ]
    }
  ]
}
```

---

### 4. 課程學習 API（核心）

#### `GET /api/missions/{lessonId}`
**回應：**
```typescript
{
  "lesson": {
    "id": 1,
    "journeyId": 0,
    "chapterId": 1,
    "name": "OOP Fundamentals",
    "type": "video",
    "reward": { "exp": 200 }
  },
  "content": {
    "videoUrl": "https://www.youtube.com/watch?v=xxx",
    "videoProvider": "youtube",
    "videoDuration": 513  // 秒
  },
  "progress": {
    "status": "in_progress",
    "progressPercentage": 45,
    "lastPosition": 230,
    "videoDuration": 513,
    "watchCount": 2,
    "lastAccessedAt": "2025-11-18T10:30:00Z"
  },
  "navigation": {
    "previousLesson": null,
    "nextLesson": {
      "id": 2,
      "name": "Design Principles"
    }
  }
}
```

#### `POST /api/missions/{lessonId}/progress`
**請求：**
```typescript
{
  "lastPosition": 340,
  "videoDuration": 513,
  "progressPercentage": 66.27
}
```

**回應（未完成）：**
```typescript
{
  "status": "updated",
  "progress": {
    "progressPercentage": 66.27,
    "lastPosition": 340,
    "status": "in_progress"
  }
}
```

**回應（達到 100%，自動完成）：**
```typescript
{
  "status": "completed",
  "progress": {
    "progressPercentage": 100,
    "lastPosition": 513,
    "status": "completed",
    "completedAt": "2025-11-18T11:00:00Z"
  },
  "reward": {
    "expGained": 200,
    "leveledUp": true,
    "previousLevel": 1,
    "newLevel": 2,
    "newExp": 300,
    "nextLevelExp": 500
  }
}
```

#### `POST /api/missions/{lessonId}/deliver`
**用途：** 手動標記完成（若前端需要）

**回應：** 同上 100% 回應

---

## 🧪 測試清單

### 功能測試

#### 認證流程
- [ ] 使用者可以透過 Google OAuth 登入
- [ ] 登入後設定 JWT cookie
- [ ] 登入後跳轉到課程總覽
- [ ] Token 過期後可以重新整理

#### 課程瀏覽
- [ ] 課程總覽顯示所有課程
- [ ] 顯示使用者等級、經驗值、進度條
- [ ] 點擊課程進入課程詳情
- [ ] 課程詳情顯示所有章節與課程單元
- [ ] 課程單元顯示狀態（未開始/進行中/已完成）

#### 影片播放
- [ ] 點擊課程單元進入播放器
- [ ] 影片載入並從上次位置繼續播放
- [ ] 每 10 秒自動更新進度到後端
- [ ] 進度條即時顯示觀看百分比
- [ ] 可以手動拖曳進度條（不阻擋）

#### 課程完成
- [ ] 觀看到 100% 自動標記完成
- [ ] 顯示獎勵 modal（經驗值、等級）
- [ ] 若升級顯示升級動畫
- [ ] 完成後課程狀態變為「已完成」
- [ ] 可以點擊「下一課程」繼續學習

#### 經驗值與升級
- [ ] 完成課程獲得正確經驗值
- [ ] 經驗值累加正確
- [ ] 達到門檻時升級
- [ ] 升級後等級與所需經驗值更新
- [ ] 同一課程不能重複獲得獎勵

#### 資料持久化
- [ ] 重新整理頁面後登入狀態保留
- [ ] 重新整理後課程進度保留
- [ ] 重新整理後等級與經驗值保留
- [ ] 影片繼續從上次位置播放

### 邊界測試

- [ ] 未登入使用者訪問課程頁面應重導向到登入
- [ ] 不存在的課程 ID 回傳 404
- [ ] 進度更新失敗時前端顯示錯誤
- [ ] 網路斷線時重連後繼續更新進度
- [ ] 同時開啟多個分頁不會重複發放獎勵

### 效能測試

- [ ] 10 秒更新間隔不會造成效能問題
- [ ] JSON 檔案讀寫速度可接受（< 100ms）
- [ ] 課程列表載入速度 < 1 秒

---

## 📦 測試資料

### 測試使用者
```json
{
  "users": [
    {
      "id": 1,
      "email": "test1@example.com",
      "name": "測試使用者一",
      "level": 1,
      "exp": 0,
      "nextLevelExp": 200,
      "pictureUrl": "https://i.pravatar.cc/150?img=1"
    },
    {
      "id": 2,
      "email": "test2@example.com",
      "name": "測試使用者二",
      "level": 2,
      "exp": 350,
      "nextLevelExp": 500,
      "pictureUrl": "https://i.pravatar.cc/150?img=2"
    }
  ]
}
```

### 測試課程
```json
{
  "journeys": [
    {
      "id": 0,
      "name": "Software Design Pattern",
      "slug": "software-design-pattern",
      "description": "學習常見的設計模式，提升程式碼品質",
      "chapters": [
        {
          "id": 1,
          "name": "Basics",
          "lessons": [
            {
              "id": 1,
              "name": "OOP Fundamentals",
              "type": "video",
              "videoUrl": "https://www.youtube.com/watch?v=pTB0EiLXUC8",
              "videoLength": "8:33",
              "reward": { "exp": 200 }
            },
            {
              "id": 2,
              "name": "Design Principles",
              "type": "scroll",
              "reward": { "exp": 150 }
            }
          ]
        },
        {
          "id": 2,
          "name": "Patterns",
          "lessons": [
            {
              "id": 3,
              "name": "Creational Patterns",
              "type": "video",
              "videoUrl": "https://www.youtube.com/watch?v=xxx",
              "videoLength": "12:45",
              "reward": { "exp": 250 }
            },
            {
              "id": 4,
              "name": "Structural Patterns",
              "type": "scroll",
              "reward": { "exp": 200 }
            }
          ]
        },
        {
          "id": 3,
          "name": "Advanced",
          "lessons": [
            {
              "id": 5,
              "name": "Behavioral Patterns",
              "type": "video",
              "videoUrl": "https://www.youtube.com/watch?v=yyy",
              "videoLength": "15:30",
              "reward": { "exp": 300 }
            },
            {
              "id": 6,
              "name": "Best Practices",
              "type": "scroll",
              "reward": { "exp": 250 }
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🚀 交付標準

### 驗收條件

**使用者可以完成以下完整流程：**

1. ✅ 在登入頁面透過 OAuth 登入
2. ✅ 看到課程總覽，顯示個人等級與所有課程
3. ✅ 點擊「Software Design Pattern」課程
4. ✅ 看到 3 個章節，每章 2 個課程單元
5. ✅ 點擊 Chapter 1 > "OOP Fundamentals" 課程
6. ✅ 影片播放器載入，從上次位置繼續播放
7. ✅ 觀看過程中每 10 秒自動儲存進度
8. ✅ 進度條即時顯示觀看百分比
9. ✅ 觀看到 100% 時自動標記完成
10. ✅ 顯示獎勵 modal：「🎉 課程完成！+200 EXP」
11. ✅ 經驗值累加，若達門檻顯示升級動畫
12. ✅ 點擊「下一課程」繼續學習
13. ✅ 返回課程詳情，Chapter 1 顯示 1/2 已完成
14. ✅ 完成第二課程，Chapter 1 顯示 2/2 已完成
15. ✅ 重新整理頁面，所有進度保留

### 成功指標

- **核心功能完整性**：所有 15 項驗收條件通過
- **使用者體驗**：從登入到完成課程流程順暢，無卡頓
- **資料正確性**：進度、經驗值、等級計算正確無誤
- **穩定性**：無明顯 bug，錯誤處理完善

---

## 📅 開發時程（2 週）

### Week 1：後端開發

**Day 1-2：基礎架構**
- [ ] 專案初始化（Node.js/NestJS）
- [ ] Repository 模式實作（JSON 版本）
- [ ] user-module：CRUD + 等級管理
- [ ] journey-module：讀取課程資料

**Day 3-4：核心邏輯**
- [ ] auth-module：JWT 認證（測試登入）
- [ ] progress-module：進度追蹤與更新
- [ ] reward-module：經驗值發放與升級計算

**Day 5：API 整合**
- [ ] 實作所有 API 端點
- [ ] API 測試（Postman/cURL）
- [ ] 準備測試資料（JSON 檔案）

### Week 2：前端開發與整合

**Day 1-3：前端頁面**
- [ ] 登入頁面 + OAuth 整合
- [ ] 課程總覽頁面
- [ ] 課程詳情頁面
- [ ] 課程播放器（YouTube 嵌入）

**Day 4：前後端整合**
- [ ] 串接所有 API
- [ ] 實作 10 秒進度更新機制
- [ ] 實作自動完成與獎勵 modal
- [ ] 升級動畫

**Day 5：測試與修正**
- [ ] 完整流程測試
- [ ] Bug 修正
- [ ] 效能優化
- [ ] 準備 Demo

---

## 🎯 MVP 簡化策略

### 資料庫
- ✅ **使用 JSON 檔案**，不建置 PostgreSQL
- 🔄 設計 Repository interface，未來可無痛切換

### 認證
- ✅ **測試登入**（硬編碼使用者），可選實作 Google OAuth
- 🔄 未來加入完整 OAuth 與 session 管理

### 通知
- ✅ **前端 toast 顯示**（升級提示）
- ❌ 不建置通知資料庫與推播

### 內容類型
- ✅ **影片課程**（YouTube 嵌入）
- ⭕ **文章課程**（Markdown 顯示，選做）
- ❌ Google Form 延後

### 高級功能
- ❌ Gym 挑戰系統
- ❌ 排行榜
- ❌ 社群帳號連結
- ❌ 筆記功能
- ❌ 付費內容

---

## 📌 技術選型建議

### 後端
- **框架**：NestJS（模組化、易測試）或 Express
- **語言**：TypeScript
- **認證**：JWT + Passport.js
- **資料**：JSON 檔案（fs-extra）

### 前端
- **框架**：React + TypeScript
- **路由**：React Router
- **狀態**：Context API 或 Zustand
- **UI**：Tailwind CSS + shadcn/ui
- **影片**：YouTube iframe API 或 react-player

### 開發工具
- **API 測試**：Postman
- **版控**：Git
- **部署**：Vercel（前端）+ Railway/Render（後端）

---

## ✅ 總結

Release 1 MVP 聚焦於**最小可用產品**，讓使用者能夠：
- 登入系統
- 瀏覽課程
- 觀看影片
- 追蹤進度
- 獲得經驗值
- 升級

所有進階功能（Gym、排行榜、通知、筆記）延後到 Release 2，確保在 2 週內交付可用的核心功能。
