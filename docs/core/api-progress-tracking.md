# 影片播放進度追蹤 API 設計

## 概述

本文件定義了影片播放進度追蹤的完整 API 設計，包含前後端互動流程、API 端點定義、資料格式和實作細節。

**設計原則**：
- 每 10 秒自動更新進度
- 影片需觀看到 100% 才算完成
- 不防止手拉進度條（不影響用戶體驗）
- 完成時自動觸發獎勵發放

---

## 1. 前後端互動流程

```
┌─────────────┐                           ┌─────────────┐
│   Frontend  │                           │   Backend   │
│  (播放器)    │                           │   (API)     │
└─────────────┘                           └─────────────┘
       │                                          │
       │ 1. 載入課程單元頁面                       │
       ├─────────────────────────────────────────>│
       │        GET /api/missions/{id}            │
       │                                          │
       │<─────────────────────────────────────────┤
       │     返回課程單元資訊 + 上次播放進度         │
       │     { lesson, progress: { lastPosition } }│
       │                                          │
       │ 2. 初始化播放器                          │
       │    設定播放位置 = lastPosition            │
       │                                          │
       │ 3. 開始播放影片                          │
       │                                          │
       │ 4. 每 10 秒發送進度更新                  │
       ├─────────────────────────────────────────>│
       │  POST /api/missions/{id}/progress        │
       │  { lastPosition, progressPercentage }    │
       │                                          │
       │<─────────────────────────────────────────┤
       │     200 OK { status: 'updated' }         │
       │                                          │
       │ 5. 達到 100% 時自動交付                  │
       ├─────────────────────────────────────────>│
       │     POST /api/missions/{id}/deliver      │
       │                                          │
       │<─────────────────────────────────────────┤
       │     200 OK { completed: true,            │
       │              expGained: 200,             │
       │              leveledUp: false }          │
       │                                          │
       │ 6. 顯示完成動畫 + 獎勵提示                │
       │                                          │
```

---

## 2. API 端點定義

### 2.1 獲取課程單元資訊

#### `GET /api/missions/{lessonId}`

**用途**: 獲取課程單元的詳細資訊和用戶的學習進度

**請求參數**:
- **Path Parameters**:
  - `lessonId` (number, required): 課程單元 ID

**認證**: 需要 JWT Token

**回應**:
```typescript
interface LessonDetailResponse {
  // 課程單元基本資訊
  lesson: {
    id: number;
    journeyId: number;
    chapterId: number;
    name: string;
    description?: string;
    type: 'video' | 'scroll' | 'google-form';
    premiumOnly: boolean;
    videoLength?: string;         // 如 "08:33"
    videoDuration?: number;       // 秒數
    reward: {
      exp: number;
      coin: number;
      subscriptionExtensionInDays: number;
      journeyId: number;
      externalRewardDescription: string;
    };
  };

  // 課程內容
  content: {
    type: 'video' | 'scroll' | 'google-form';
    videoUrl?: string;            // YouTube URL
    videoProvider?: 'youtube' | 'vimeo' | 'custom';
    videoEmbedCode?: string;
    markdownContent?: string;
    googleFormUrl?: string;
    attachments?: string[];
  };

  // 用戶進度
  progress: {
    status: 'not_started' | 'in_progress' | 'completed';
    progressPercentage: number;   // 0-100
    lastPosition?: number;        // 最後觀看位置（秒）
    watchCount: number;           // 觀看次數
    completedAt?: string;         // ISO date string
    lastAccessedAt: string;
  } | null;
}
```

**範例請求**:
```http
GET /api/missions/1 HTTP/1.1
Host: api.waterballsa.tw
Authorization: Bearer <jwt-token>
```

**範例回應**:
```json
{
  "lesson": {
    "id": 1,
    "journeyId": 0,
    "chapterId": 1,
    "name": "物件導向基礎概念",
    "description": "學習物件導向的核心概念",
    "type": "video",
    "premiumOnly": false,
    "videoLength": "08:33",
    "videoDuration": 513,
    "reward": {
      "exp": 200,
      "coin": 0,
      "subscriptionExtensionInDays": 0,
      "journeyId": 0,
      "externalRewardDescription": ""
    }
  },
  "content": {
    "type": "video",
    "videoUrl": "https://www.youtube.com/watch?v=xxxxx",
    "videoProvider": "youtube",
    "videoEmbedCode": "<iframe>...</iframe>"
  },
  "progress": {
    "status": "in_progress",
    "progressPercentage": 65.5,
    "lastPosition": 336,
    "watchCount": 2,
    "lastAccessedAt": "2025-11-18T10:30:00Z"
  }
}
```

**錯誤回應**:
```json
// 404 Not Found - 課程單元不存在
{
  "error": {
    "code": "LESSON_NOT_FOUND",
    "message": "課程單元不存在"
  }
}

// 403 Forbidden - 需要付費
{
  "error": {
    "code": "PREMIUM_REQUIRED",
    "message": "此課程單元需要付費會員才能觀看"
  }
}
```

---

### 2.2 更新播放進度

#### `POST /api/missions/{lessonId}/progress`

**用途**: 更新用戶的影片播放進度（前端每 10 秒調用一次）

**請求參數**:
- **Path Parameters**:
  - `lessonId` (number, required): 課程單元 ID

**認證**: 需要 JWT Token

**請求 Body**:
```typescript
interface ProgressUpdateRequest {
  lastPosition: number;           // 當前播放位置（秒）
  videoDuration: number;          // 影片總長度（秒）
  progressPercentage?: number;    // 可選，由前端計算或後端計算
}
```

**回應**:
```typescript
interface ProgressUpdateResponse {
  status: 'updated' | 'completed';
  progress: {
    progressPercentage: number;
    lastPosition: number;
    status: 'in_progress' | 'completed';
  };
  // 如果達到 100%，自動交付
  reward?: {
    expGained: number;
    leveledUp: boolean;
    newLevel?: number;
  };
}
```

**範例請求**:
```http
POST /api/missions/1/progress HTTP/1.1
Host: api.waterballsa.tw
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "lastPosition": 340,
  "videoDuration": 513,
  "progressPercentage": 66.27
}
```

**範例回應（尚未完成）**:
```json
{
  "status": "updated",
  "progress": {
    "progressPercentage": 66.27,
    "lastPosition": 340,
    "status": "in_progress"
  }
}
```

**範例回應（達到 100%，自動完成）**:
```json
{
  "status": "completed",
  "progress": {
    "progressPercentage": 100,
    "lastPosition": 513,
    "status": "completed"
  },
  "reward": {
    "expGained": 200,
    "leveledUp": false
  }
}
```

**後端邏輯**:
```typescript
async function updateLessonProgress(
  userId: number,
  lessonId: number,
  data: ProgressUpdateRequest
): Promise<ProgressUpdateResponse> {
  // 1. 計算進度百分比
  const progressPercentage = (data.lastPosition / data.videoDuration) * 100;

  // 2. 更新進度記錄
  const progress = await progressRepository.upsert({
    userId,
    lessonId,
    lastPosition: data.lastPosition,
    videoDuration: data.videoDuration,
    progressPercentage: Math.min(progressPercentage, 100),
    lastAccessedAt: new Date(),
  });

  // 3. 檢查是否達到 100%
  if (progress.progressPercentage >= 100 && progress.status !== 'completed') {
    // 自動交付，發放獎勵
    const reward = await completeLesson(userId, lessonId);
    return {
      status: 'completed',
      progress: {
        progressPercentage: 100,
        lastPosition: data.lastPosition,
        status: 'completed',
      },
      reward,
    };
  }

  return {
    status: 'updated',
    progress: {
      progressPercentage: progress.progressPercentage,
      lastPosition: progress.lastPosition,
      status: progress.status,
    },
  };
}
```

---

### 2.3 手動交付課程單元

#### `POST /api/missions/{lessonId}/deliver`

**用途**: 手動標記課程單元為完成（適用於非影片類型或用戶主動交付）

**請求參數**:
- **Path Parameters**:
  - `lessonId` (number, required): 課程單元 ID

**認證**: 需要 JWT Token

**請求 Body**: 無（或空 JSON）

**回應**:
```typescript
interface DeliverResponse {
  success: boolean;
  completed: boolean;
  reward: {
    expGained: number;
    coinGained: number;
    leveledUp: boolean;
    previousLevel?: number;
    newLevel?: number;
    previousExp?: number;
    newExp?: number;
    nextLevelExp?: number;
  };
  message?: string;
}
```

**範例請求**:
```http
POST /api/missions/1/deliver HTTP/1.1
Host: api.waterballsa.tw
Authorization: Bearer <jwt-token>
Content-Type: application/json

{}
```

**範例回應（首次完成）**:
```json
{
  "success": true,
  "completed": true,
  "reward": {
    "expGained": 200,
    "coinGained": 0,
    "leveledUp": false,
    "previousLevel": 5,
    "newLevel": 5,
    "previousExp": 1200,
    "newExp": 1400,
    "nextLevelExp": 2000
  }
}
```

**範例回應（已完成過，不重複發放獎勵）**:
```json
{
  "success": true,
  "completed": true,
  "reward": {
    "expGained": 0,
    "coinGained": 0,
    "leveledUp": false
  },
  "message": "您已經完成過此課程單元"
}
```

**範例回應（升級）**:
```json
{
  "success": true,
  "completed": true,
  "reward": {
    "expGained": 200,
    "coinGained": 0,
    "leveledUp": true,
    "previousLevel": 5,
    "newLevel": 6,
    "previousExp": 1850,
    "newExp": 2050,
    "nextLevelExp": 2600
  }
}
```

**後端邏輯**:
```typescript
async function deliverLesson(
  userId: number,
  lessonId: number
): Promise<DeliverResponse> {
  // 1. 檢查是否已完成
  const progress = await progressRepository.findOne({ userId, lessonId });
  if (progress?.status === 'completed') {
    return {
      success: true,
      completed: true,
      reward: {
        expGained: 0,
        coinGained: 0,
        leveledUp: false,
      },
      message: '您已經完成過此課程單元',
    };
  }

  // 2. 獲取課程單元的獎勵設定
  const lesson = await lessonRepository.findById(lessonId);
  const { exp, coin } = lesson.reward;

  // 3. 標記為完成
  await progressRepository.update(
    { userId, lessonId },
    {
      status: 'completed',
      progressPercentage: 100,
      completedAt: new Date(),
    }
  );

  // 4. 發放獎勵
  const rewardResult = await rewardService.grantReward(userId, {
    sourceType: 'lesson',
    sourceId: lessonId,
    exp,
    coin,
  });

  // 5. 更新課程整體進度
  await updateJourneyProgress(userId, lesson.journeyId);

  // 6. 發送通知（如果升級）
  if (rewardResult.leveledUp) {
    await notificationService.createLevelUpNotification(
      userId,
      rewardResult.newLevel
    );
  }

  return {
    success: true,
    completed: true,
    reward: {
      expGained: exp,
      coinGained: coin,
      leveledUp: rewardResult.leveledUp,
      previousLevel: rewardResult.previousLevel,
      newLevel: rewardResult.newLevel,
      previousExp: rewardResult.previousExp,
      newExp: rewardResult.newExp,
      nextLevelExp: rewardResult.nextLevelExp,
    },
  };
}
```

---

## 3. 前端實作指南

### 3.1 影片播放器整合

#### 使用 YouTube Player API

```typescript
import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  lessonId: number;
  videoUrl: string;
  initialPosition?: number;  // 從 API 獲取的上次播放位置
  onProgressUpdate: (data: ProgressData) => void;
  onComplete: () => void;
}

interface ProgressData {
  lastPosition: number;
  videoDuration: number;
  progressPercentage: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  lessonId,
  videoUrl,
  initialPosition = 0,
  onProgressUpdate,
  onComplete,
}) => {
  const playerRef = useRef<YT.Player | null>(null);
  const [duration, setDuration] = useState(0);
  const [completed, setCompleted] = useState(false);

  // 初始化 YouTube Player
  useEffect(() => {
    const videoId = extractYouTubeVideoId(videoUrl);

    playerRef.current = new YT.Player('player', {
      videoId,
      events: {
        onReady: (event) => {
          const player = event.target;
          setDuration(player.getDuration());

          // 設定初始播放位置
          if (initialPosition > 0) {
            player.seekTo(initialPosition, true);
          }
        },
        onStateChange: (event) => {
          // 檢測影片播放狀態
          if (event.data === YT.PlayerState.ENDED && !completed) {
            setCompleted(true);
            onComplete();
          }
        },
      },
    });

    return () => {
      playerRef.current?.destroy();
    };
  }, [videoUrl, initialPosition]);

  // 每 10 秒更新進度
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && duration > 0) {
        const currentTime = playerRef.current.getCurrentTime();
        const progressPercentage = (currentTime / duration) * 100;

        onProgressUpdate({
          lastPosition: Math.floor(currentTime),
          videoDuration: duration,
          progressPercentage: Math.min(progressPercentage, 100),
        });

        // 如果達到 100%，自動完成
        if (progressPercentage >= 100 && !completed) {
          setCompleted(true);
          onComplete();
        }
      }
    }, 10000); // 10 秒

    return () => clearInterval(interval);
  }, [duration, completed, onProgressUpdate, onComplete]);

  return <div id="player"></div>;
};
```

#### 使用自訂影片播放器（HTML5 Video）

```typescript
import React, { useEffect, useRef, useState } from 'react';

export const CustomVideoPlayer: React.FC<VideoPlayerProps> = ({
  lessonId,
  videoUrl,
  initialPosition = 0,
  onProgressUpdate,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [completed, setCompleted] = useState(false);

  // 設定初始播放位置
  useEffect(() => {
    if (videoRef.current && initialPosition > 0) {
      videoRef.current.currentTime = initialPosition;
    }
  }, [initialPosition]);

  // 每 10 秒更新進度
  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.duration > 0) {
        const progressPercentage = (video.currentTime / video.duration) * 100;

        onProgressUpdate({
          lastPosition: Math.floor(video.currentTime),
          videoDuration: Math.floor(video.duration),
          progressPercentage: Math.min(progressPercentage, 100),
        });

        // 檢查是否完成
        if (progressPercentage >= 100 && !completed) {
          setCompleted(true);
          onComplete();
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [completed, onProgressUpdate, onComplete]);

  // 監聽影片結束事件
  const handleEnded = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();
    }
  };

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      controls
      onEnded={handleEnded}
      style={{ width: '100%', maxWidth: '800px' }}
    />
  );
};
```

---

### 3.2 完整的課程單元頁面

```typescript
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VideoPlayer } from './VideoPlayer';
import { api } from '../services/api';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [rewardData, setRewardData] = useState<RewardData | null>(null);

  // 載入課程單元資訊
  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const data = await api.get(`/api/missions/${lessonId}`);
      setLesson(data);
    } catch (error) {
      console.error('載入課程失敗', error);
    } finally {
      setLoading(false);
    }
  };

  // 更新播放進度
  const handleProgressUpdate = async (data: ProgressData) => {
    try {
      const response = await api.post(
        `/api/missions/${lessonId}/progress`,
        data
      );

      // 如果後端返回 completed 狀態，顯示完成動畫
      if (response.status === 'completed') {
        setRewardData(response.reward);
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('更新進度失敗', error);
    }
  };

  // 手動完成（用於非影片類型）
  const handleManualComplete = async () => {
    try {
      const response = await api.post(`/api/missions/${lessonId}/deliver`);
      if (response.success) {
        setRewardData(response.reward);
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.error('交付失敗', error);
    }
  };

  // 影片自動完成
  const handleVideoComplete = async () => {
    // 由於前端每 10 秒會檢查進度，達到 100% 時已經在 handleProgressUpdate 中處理
    // 這裡可以作為備份機制
    console.log('影片播放完成');
  };

  if (loading) return <div>載入中...</div>;
  if (!lesson) return <div>課程不存在</div>;

  return (
    <div className="lesson-page">
      <h1>{lesson.lesson.name}</h1>
      <p>{lesson.lesson.description}</p>

      {/* 影片播放器 */}
      {lesson.lesson.type === 'video' && lesson.content.videoUrl && (
        <VideoPlayer
          lessonId={lesson.lesson.id}
          videoUrl={lesson.content.videoUrl}
          initialPosition={lesson.progress?.lastPosition || 0}
          onProgressUpdate={handleProgressUpdate}
          onComplete={handleVideoComplete}
        />
      )}

      {/* 文章內容 */}
      {lesson.lesson.type === 'scroll' && lesson.content.markdownContent && (
        <div>
          <div dangerouslySetInnerHTML={{ __html: lesson.content.htmlContent }} />
          <button onClick={handleManualComplete}>
            標記為完成
          </button>
        </div>
      )}

      {/* Google Form */}
      {lesson.lesson.type === 'google-form' && lesson.content.googleFormUrl && (
        <div>
          <iframe
            src={lesson.content.googleFormUrl}
            width="100%"
            height="800px"
            frameBorder="0"
          />
          <button onClick={handleManualComplete}>
            標記為完成
          </button>
        </div>
      )}

      {/* 完成動畫 Modal */}
      {showCompletionModal && rewardData && (
        <CompletionModal
          reward={rewardData}
          onClose={() => setShowCompletionModal(false)}
        />
      )}
    </div>
  );
};

// 完成動畫 Modal
interface CompletionModalProps {
  reward: RewardData;
  onClose: () => void;
}

const CompletionModal: React.FC<CompletionModalProps> = ({ reward, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🎉 課程完成！</h2>
        <p>獲得經驗值：+{reward.expGained} EXP</p>
        {reward.coinGained > 0 && <p>獲得金幣：+{reward.coinGained} Coin</p>}

        {reward.leveledUp && (
          <div className="level-up-animation">
            <h3>✨ 恭喜升級！</h3>
            <p>Lv.{reward.previousLevel} → Lv.{reward.newLevel}</p>
          </div>
        )}

        <button onClick={onClose}>繼續學習</button>
      </div>
    </div>
  );
};
```

---

## 4. 錯誤處理

### 4.1 網路錯誤處理

```typescript
// 前端：使用 retry 機制
const updateProgressWithRetry = async (data: ProgressData, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await api.post(`/api/missions/${lessonId}/progress`, data);
    } catch (error) {
      if (i === retries - 1) throw error;
      // 等待 2 秒後重試
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};
```

### 4.2 離線支援

```typescript
// 使用 localStorage 暫存進度
const saveProgressLocally = (lessonId: number, data: ProgressData) => {
  const key = `lesson-progress-${lessonId}`;
  localStorage.setItem(key, JSON.stringify({
    ...data,
    timestamp: Date.now(),
  }));
};

const syncLocalProgress = async (lessonId: number) => {
  const key = `lesson-progress-${lessonId}`;
  const cached = localStorage.getItem(key);
  if (cached) {
    const data = JSON.parse(cached);
    try {
      await api.post(`/api/missions/${lessonId}/progress`, data);
      localStorage.removeItem(key);
    } catch (error) {
      console.error('同步進度失敗', error);
    }
  }
};
```

---

## 5. 效能最佳化

### 5.1 批次更新

如果用戶同時觀看多個影片（例如開多個分頁），可以批次更新：

```typescript
// Backend API
POST /api/missions/batch-progress
{
  "updates": [
    { "lessonId": 1, "lastPosition": 100, "videoDuration": 500 },
    { "lessonId": 2, "lastPosition": 200, "videoDuration": 600 }
  ]
}
```

### 5.2 防抖動（Debounce）

```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce(
  (data: ProgressData) => {
    api.post(`/api/missions/${lessonId}/progress`, data);
  },
  10000, // 10 秒
  { maxWait: 10000 } // 最多等待 10 秒
);
```

---

## 6. 測試建議

### 6.1 單元測試

```typescript
describe('Video Progress Tracking', () => {
  it('should update progress every 10 seconds', async () => {
    // Mock timer
    jest.useFakeTimers();

    // Render video player
    render(<VideoPlayer lessonId={1} videoUrl="..." />);

    // Fast-forward 10 seconds
    jest.advanceTimersByTime(10000);

    // Verify API call
    expect(mockApi.post).toHaveBeenCalledWith(
      '/api/missions/1/progress',
      expect.objectContaining({
        lastPosition: expect.any(Number),
        videoDuration: expect.any(Number),
      })
    );
  });

  it('should complete lesson when reaching 100%', async () => {
    // Mock video duration and current time
    // ...
    // Verify completion callback is triggered
  });
});
```

### 6.2 整合測試

```typescript
describe('Lesson Completion Flow', () => {
  it('should complete lesson, grant reward, and update user level', async () => {
    // 1. Load lesson
    const lesson = await api.get('/api/missions/1');
    expect(lesson).toBeDefined();

    // 2. Update progress to 100%
    const response = await api.post('/api/missions/1/progress', {
      lastPosition: 500,
      videoDuration: 500,
      progressPercentage: 100,
    });

    // 3. Verify completion
    expect(response.status).toBe('completed');
    expect(response.reward.expGained).toBe(200);

    // 4. Verify user exp updated
    const user = await api.get('/api/users/me');
    expect(user.exp).toBeGreaterThan(previousExp);
  });
});
```

---

## 更新日期
- 2025-11-18：初版設計，定義影片播放進度追蹤的完整流程和 API
