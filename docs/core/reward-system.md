# 經驗值與等級系統設計

## 概述

本文件定義了完整的經驗值（EXP）與等級（Level）系統設計，包含升級機制、獎勵發放流程和相關 API。

**設計原則**：
- **遞增經驗值機制**：每升一級所需經驗值遞增（如 Lv.1→2 需 200 exp，Lv.2→3 需 300 exp）
- **固定獎勵值**：每個課程單元的經驗值由課程自行定義（MVP 使用固定值）
- **單次獎勵**：每個課程單元只能獲得一次獎勵
- **即時回饋**：完成課程單元立即發放獎勵並更新等級

---

## 1. 等級系統設計

### 1.1 等級配置表

參考水球平台的設計，使用遞增經驗值機制：

| 等級 | 到達此級所需總 EXP | 升到下一級需要的 EXP | 累計 EXP 範圍 | 稱號（可選） |
|------|-------------------|---------------------|--------------|-------------|
| 1    | 0                 | 200                 | 0 - 199      | 新手        |
| 2    | 200               | 300                 | 200 - 499    | 學徒        |
| 3    | 500               | 400                 | 500 - 899    | 進階者      |
| 4    | 900               | 500                 | 900 - 1399   | 熟練者      |
| 5    | 1400              | 600                 | 1400 - 1999  | 專家        |
| 6    | 2000              | 700                 | 2000 - 2699  | 大師        |
| 7    | 2700              | 800                 | 2700 - 3499  | 宗師        |
| 8    | 3500              | 900                 | 3500 - 4399  | 傳奇        |
| 9    | 4400              | 1000                | 4400 - 5399  | 至尊        |
| 10   | 5400              | 1100                | 5400 - 6499  | 神級        |
| ...  | ...               | ...                 | ...          | ...         |

### 1.2 等級計算公式

```typescript
interface LevelConfig {
  level: number;
  requiredExp: number;      // 從 Lv.0 到此級的總經驗值
  expToNextLevel: number;   // 升到下一級需要的經驗值
  title?: string;           // 等級稱號
}

// 範例配置
const levelConfigs: LevelConfig[] = [
  { level: 1, requiredExp: 0, expToNextLevel: 200, title: '新手' },
  { level: 2, requiredExp: 200, expToNextLevel: 300, title: '學徒' },
  { level: 3, requiredExp: 500, expToNextLevel: 400, title: '進階者' },
  { level: 4, requiredExp: 900, expToNextLevel: 500, title: '熟練者' },
  { level: 5, requiredExp: 1400, expToNextLevel: 600, title: '專家' },
  { level: 6, requiredExp: 2000, expToNextLevel: 700, title: '大師' },
  { level: 7, requiredExp: 2700, expToNextLevel: 800, title: '宗師' },
  { level: 8, requiredExp: 3500, expToNextLevel: 900, title: '傳奇' },
  { level: 9, requiredExp: 4400, expToNextLevel: 1000, title: '至尊' },
  { level: 10, requiredExp: 5400, expToNextLevel: 1100, title: '神級' },
  // 可持續擴展...
];

/**
 * 根據總經驗值計算用戶當前等級和進度
 */
function calculateLevel(totalExp: number): LevelInfo {
  // 從高到低遍歷，找到符合的等級
  for (let i = levelConfigs.length - 1; i >= 0; i--) {
    const config = levelConfigs[i];
    if (totalExp >= config.requiredExp) {
      const nextConfig = levelConfigs[i + 1];

      return {
        currentLevel: config.level,
        currentExp: totalExp,
        requiredExp: config.requiredExp,
        nextLevelExp: nextConfig ? nextConfig.requiredExp : Infinity,
        expToNextLevel: nextConfig ? nextConfig.requiredExp - totalExp : 0,
        progressToNextLevel: nextConfig
          ? ((totalExp - config.requiredExp) / config.expToNextLevel) * 100
          : 100,
        title: config.title,
      };
    }
  }

  // 如果沒有符合的，返回 Lv.1
  return {
    currentLevel: 1,
    currentExp: totalExp,
    requiredExp: 0,
    nextLevelExp: 200,
    expToNextLevel: 200 - totalExp,
    progressToNextLevel: (totalExp / 200) * 100,
    title: '新手',
  };
}

interface LevelInfo {
  currentLevel: number;       // 當前等級
  currentExp: number;         // 當前總經驗值
  requiredExp: number;        // 到達當前等級需要的總 exp
  nextLevelExp: number;       // 到達下一等級需要的總 exp
  expToNextLevel: number;     // 距離下一等級還需要的 exp
  progressToNextLevel: number; // 到下一等級的進度百分比 (0-100)
  title?: string;             // 等級稱號
}
```

**計算範例**：
```typescript
// 範例 1: 用戶有 450 exp
calculateLevel(450);
// 輸出:
// {
//   currentLevel: 2,          // Lv.2 (需要 200 exp)
//   currentExp: 450,
//   requiredExp: 200,
//   nextLevelExp: 500,        // Lv.3 需要 500 exp
//   expToNextLevel: 50,       // 還需要 50 exp 升到 Lv.3
//   progressToNextLevel: 83.3, // (450-200) / 300 * 100 = 83.3%
//   title: '學徒'
// }

// 範例 2: 用戶有 2500 exp
calculateLevel(2500);
// 輸出:
// {
//   currentLevel: 6,
//   currentExp: 2500,
//   requiredExp: 2000,
//   nextLevelExp: 2700,
//   expToNextLevel: 200,
//   progressToNextLevel: 71.4, // (2500-2000) / 700 * 100
//   title: '大師'
// }
```

---

## 2. 獎勵發放流程

### 2.1 獎勵來源

系統支援多種獎勵來源：

| 來源類型 | sourceType | 說明 | MVP 優先級 |
|---------|-----------|------|-----------|
| 課程單元 | `lesson` | 完成課程單元（影片、文章） | ✅ 高 |
| 道館挑戰 | `gym` | 通過道館挑戰審核 | ⭕ 中 |
| 任務獎勵 | `mission` | 完成特定任務 | ❌ 低 |
| 手動發放 | `manual` | 管理員手動發放 | ❌ 低 |

### 2.2 獎勵發放邏輯

```typescript
interface RewardData {
  sourceType: 'lesson' | 'gym' | 'mission' | 'manual';
  sourceId: number;           // 來源 ID（如 lessonId）
  exp: number;                // 經驗值
  coin?: number;              // 金幣（可選）
  otherRewards?: any;         // 其他獎勵（未來擴展）
}

interface RewardResult {
  success: boolean;
  expGained: number;          // 實際獲得的經驗值
  coinGained: number;         // 實際獲得的金幣
  leveledUp: boolean;         // 是否升級
  previousLevel: number;      // 升級前的等級
  newLevel: number;           // 升級後的等級
  previousExp: number;        // 升級前的總經驗值
  newExp: number;             // 升級後的總經驗值
  nextLevelExp: number;       // 下一等級所需總經驗值
  levelsGained?: number;      // 升了幾級（可能一次升多級）
}

/**
 * 發放獎勵的核心邏輯
 */
async function grantReward(
  userId: number,
  reward: RewardData
): Promise<RewardResult> {
  // 1. 檢查是否已經獲得過此獎勵
  const existingReward = await rewardLogRepository.findOne({
    userId,
    sourceType: reward.sourceType,
    sourceId: reward.sourceId,
  });

  if (existingReward) {
    // 已經獲得過，不重複發放
    const user = await userRepository.findById(userId);
    return {
      success: false,
      expGained: 0,
      coinGained: 0,
      leveledUp: false,
      previousLevel: user.level,
      newLevel: user.level,
      previousExp: user.exp,
      newExp: user.exp,
      nextLevelExp: user.nextLevelExp,
    };
  }

  // 2. 獲取用戶當前狀態
  const user = await userRepository.findById(userId);
  const previousLevel = user.level;
  const previousExp = user.exp;

  // 3. 計算新的經驗值和等級
  const newExp = previousExp + reward.exp;
  const levelInfo = calculateLevel(newExp);

  // 4. 更新用戶資料
  await userRepository.update(userId, {
    exp: newExp,
    level: levelInfo.currentLevel,
    nextLevelExp: levelInfo.nextLevelExp,
  });

  // 5. 記錄獎勵發放日誌
  await rewardLogRepository.create({
    userId,
    sourceType: reward.sourceType,
    sourceId: reward.sourceId,
    expGained: reward.exp,
    coinGained: reward.coin || 0,
    userLevelBefore: previousLevel,
    userExpBefore: previousExp,
    userLevelAfter: levelInfo.currentLevel,
    userExpAfter: newExp,
    leveledUp: levelInfo.currentLevel > previousLevel,
    createdAt: new Date(),
  });

  // 6. 如果升級，發送通知
  if (levelInfo.currentLevel > previousLevel) {
    await notificationService.createLevelUpNotification(
      userId,
      levelInfo.currentLevel
    );

    // 觸發升級事件（供其他模組監聽）
    eventBus.emit('user.level_up', {
      userId,
      previousLevel,
      newLevel: levelInfo.currentLevel,
      levelsGained: levelInfo.currentLevel - previousLevel,
    });
  }

  // 7. 返回結果
  return {
    success: true,
    expGained: reward.exp,
    coinGained: reward.coin || 0,
    leveledUp: levelInfo.currentLevel > previousLevel,
    previousLevel,
    newLevel: levelInfo.currentLevel,
    previousExp,
    newExp,
    nextLevelExp: levelInfo.nextLevelExp,
    levelsGained: levelInfo.currentLevel - previousLevel,
  };
}
```

### 2.3 一次升多級處理

某些情況下，用戶可能一次獲得大量經驗值而升多級：

```typescript
// 範例：用戶當前 Lv.1 (0 exp)，獲得 600 exp
// Lv.1 → Lv.2 需要 200 exp
// Lv.2 → Lv.3 需要 300 exp
// 600 exp 可以直接升到 Lv.3，還剩 100 exp

grantReward(userId, {
  sourceType: 'lesson',
  sourceId: 999,
  exp: 600,
});

// 結果：
// {
//   leveledUp: true,
//   previousLevel: 1,
//   newLevel: 3,
//   previousExp: 0,
//   newExp: 600,
//   nextLevelExp: 900,  // Lv.4 需要 900 exp
//   levelsGained: 2,     // 升了 2 級
// }
```

---

## 3. API 端點

### 3.1 獲取用戶等級資訊

#### `GET /api/users/me`

包含在用戶資訊中返回：

```json
{
  "id": 3080,
  "name": "Test User",
  "level": 5,
  "exp": 1650,
  "nextLevelExp": 2000,
  "pictureUrl": "...",
  ...
}
```

### 3.2 獲取等級配置

#### `GET /api/level-configs`

**用途**: 獲取所有等級配置（用於前端顯示等級進度條）

**認證**: 不需要

**回應**:
```json
[
  {
    "level": 1,
    "requiredExp": 0,
    "expToNextLevel": 200,
    "title": "新手"
  },
  {
    "level": 2,
    "requiredExp": 200,
    "expToNextLevel": 300,
    "title": "學徒"
  },
  ...
]
```

### 3.3 獲取獎勵歷史

#### `GET /api/users/me/rewards`

**用途**: 獲取用戶的獎勵歷史記錄

**認證**: 需要 JWT Token

**查詢參數**:
- `limit` (number, optional): 返回記錄數量，預設 20
- `offset` (number, optional): 分頁偏移量，預設 0

**回應**:
```typescript
interface RewardHistoryResponse {
  total: number;
  items: RewardLog[];
}

interface RewardLog {
  id: number;
  sourceType: 'lesson' | 'gym' | 'mission' | 'manual';
  sourceId: number;
  sourceName?: string;          // 來源名稱（如課程單元名稱）
  expGained: number;
  coinGained: number;
  userLevelBefore: number;
  userExpBefore: number;
  userLevelAfter: number;
  userExpAfter: number;
  leveledUp: boolean;
  createdAt: string;            // ISO date string
}
```

**範例回應**:
```json
{
  "total": 45,
  "items": [
    {
      "id": 123,
      "sourceType": "lesson",
      "sourceId": 1,
      "sourceName": "物件導向基礎概念",
      "expGained": 200,
      "coinGained": 0,
      "userLevelBefore": 4,
      "userExpBefore": 1200,
      "userLevelAfter": 5,
      "userExpAfter": 1400,
      "leveledUp": true,
      "createdAt": "2025-11-18T10:30:00Z"
    },
    {
      "id": 122,
      "sourceType": "lesson",
      "sourceId": 5,
      "sourceName": "SOLID 原則",
      "expGained": 300,
      "coinGained": 0,
      "userLevelBefore": 4,
      "userExpBefore": 900,
      "userLevelAfter": 4,
      "userExpAfter": 1200,
      "leveledUp": false,
      "createdAt": "2025-11-17T15:20:00Z"
    }
  ]
}
```

---

## 4. 前端實作

### 4.1 等級進度條

```typescript
import React from 'react';

interface LevelProgressBarProps {
  currentLevel: number;
  currentExp: number;
  nextLevelExp: number;
}

export const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  currentLevel,
  currentExp,
  nextLevelExp,
}) => {
  // 計算當前等級的配置
  const currentLevelConfig = levelConfigs.find(c => c.level === currentLevel);
  const requiredExp = currentLevelConfig?.requiredExp || 0;
  const expToNextLevel = currentLevelConfig?.expToNextLevel || 200;

  // 計算進度百分比
  const expInCurrentLevel = currentExp - requiredExp;
  const progressPercentage = (expInCurrentLevel / expToNextLevel) * 100;

  return (
    <div className="level-progress">
      <div className="level-info">
        <span className="level-badge">Lv.{currentLevel}</span>
        <span className="exp-text">
          {expInCurrentLevel} / {expToNextLevel} EXP
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
      <div className="next-level-text">
        距離 Lv.{currentLevel + 1} 還需 {nextLevelExp - currentExp} EXP
      </div>
    </div>
  );
};
```

### 4.2 升級動畫

```typescript
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelUpAnimationProps {
  show: boolean;
  previousLevel: number;
  newLevel: number;
  onComplete: () => void;
}

export const LevelUpAnimation: React.FC<LevelUpAnimationProps> = ({
  show,
  previousLevel,
  newLevel,
  onComplete,
}) => {
  useEffect(() => {
    if (show) {
      // 3 秒後自動關閉
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="level-up-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="level-up-content"
            initial={{ scale: 0.5, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <div className="level-up-icon">✨</div>
            <h2>恭喜升級！</h2>
            <div className="level-change">
              <span className="old-level">Lv.{previousLevel}</span>
              <span className="arrow">→</span>
              <span className="new-level">Lv.{newLevel}</span>
            </div>
            {newLevel - previousLevel > 1 && (
              <p className="multi-level">一次升了 {newLevel - previousLevel} 級！</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
```

### 4.3 獎勵提示

```typescript
import React from 'react';
import { toast } from 'react-toastify';

interface RewardToastProps {
  expGained: number;
  coinGained?: number;
  leveledUp: boolean;
  newLevel?: number;
}

export const showRewardToast = ({
  expGained,
  coinGained,
  leveledUp,
  newLevel,
}: RewardToastProps) => {
  if (leveledUp) {
    toast.success(
      <div className="reward-toast level-up">
        <div className="icon">🎉</div>
        <div className="content">
          <strong>恭喜升級到 Lv.{newLevel}！</strong>
          <p>獲得 +{expGained} EXP</p>
          {coinGained && coinGained > 0 && <p>+{coinGained} Coin</p>}
        </div>
      </div>,
      { autoClose: 5000 }
    );
  } else {
    toast.info(
      <div className="reward-toast">
        <div className="icon">⭐</div>
        <div className="content">
          <strong>獲得獎勵</strong>
          <p>+{expGained} EXP</p>
          {coinGained && coinGained > 0 && <p>+{coinGained} Coin</p>}
        </div>
      </div>,
      { autoClose: 3000 }
    );
  }
};
```

---

## 5. 課程單元經驗值配置

### 5.1 配置策略

**MVP 階段**：使用固定值

```json
{
  "lessons": [
    {
      "id": 1,
      "name": "物件導向基礎概念",
      "type": "video",
      "reward": {
        "exp": 200,
        "coin": 0
      }
    },
    {
      "id": 2,
      "name": "SOLID 原則",
      "type": "video",
      "reward": {
        "exp": 300,
        "coin": 0
      }
    },
    {
      "id": 3,
      "name": "設計模式介紹",
      "type": "scroll",
      "reward": {
        "exp": 150,
        "coin": 0
      }
    }
  ]
}
```

### 5.2 經驗值建議值

參考影片時長和內容難度：

| 內容類型 | 時長/難度 | 建議 EXP |
|---------|----------|---------|
| 短影片   | < 5 分鐘  | 100-150 |
| 中影片   | 5-15 分鐘 | 150-250 |
| 長影片   | 15-30 分鐘 | 250-400 |
| 超長影片 | > 30 分鐘 | 400-600 |
| 文章     | 簡單      | 100-150 |
| 文章     | 中等      | 150-250 |
| 問卷     | -         | 50-100  |
| 道館挑戰 | 簡單      | 300-500 |
| 道館挑戰 | 困難      | 500-1000 |

---

## 6. 防刷機制

### 6.1 單次獎勵限制

每個獎勵來源只能獲得一次獎勵：

```typescript
// 檢查獎勵記錄
const existingReward = await rewardLogRepository.findOne({
  userId,
  sourceType: 'lesson',
  sourceId: lessonId,
});

if (existingReward) {
  throw new Error('您已經完成過此課程單元');
}
```

### 6.2 完成狀態檢查

```typescript
// 檢查課程單元是否真的完成
const progress = await progressRepository.findOne({
  userId,
  lessonId,
});

if (progress.status !== 'completed') {
  throw new Error('請先完成課程單元');
}

if (progress.progressPercentage < 100) {
  throw new Error('請觀看完整影片');
}
```

### 6.3 速率限制

```typescript
// 防止短時間內大量提交
const recentRewards = await rewardLogRepository.find({
  userId,
  createdAt: { $gte: new Date(Date.now() - 60000) }, // 最近 1 分鐘
});

if (recentRewards.length > 5) {
  throw new Error('操作過於頻繁，請稍後再試');
}
```

---

## 7. 測試場景

### 7.1 基本獎勵發放

```typescript
describe('Reward System', () => {
  it('should grant exp and update user level', async () => {
    const user = await createTestUser({ level: 1, exp: 0 });

    const result = await rewardService.grantReward(user.id, {
      sourceType: 'lesson',
      sourceId: 1,
      exp: 200,
    });

    expect(result.success).toBe(true);
    expect(result.expGained).toBe(200);
    expect(result.leveledUp).toBe(true);
    expect(result.newLevel).toBe(2);
  });

  it('should not grant reward twice', async () => {
    const user = await createTestUser({ level: 1, exp: 0 });

    // 第一次發放
    await rewardService.grantReward(user.id, {
      sourceType: 'lesson',
      sourceId: 1,
      exp: 200,
    });

    // 第二次發放
    const result = await rewardService.grantReward(user.id, {
      sourceType: 'lesson',
      sourceId: 1,
      exp: 200,
    });

    expect(result.success).toBe(false);
    expect(result.expGained).toBe(0);
  });
});
```

### 7.2 升級通知

```typescript
describe('Level Up Notification', () => {
  it('should send notification when user levels up', async () => {
    const user = await createTestUser({ level: 1, exp: 150 });

    await rewardService.grantReward(user.id, {
      sourceType: 'lesson',
      sourceId: 1,
      exp: 200, // 150 + 200 = 350，應該升到 Lv.2
    });

    const notifications = await notificationRepository.find({ userId: user.id });
    expect(notifications).toContainEqual(
      expect.objectContaining({
        type: 'level_up',
        title: expect.stringContaining('Lv.2'),
      })
    );
  });
});
```

### 7.3 一次升多級

```typescript
describe('Multiple Level Up', () => {
  it('should handle multiple level ups in one reward', async () => {
    const user = await createTestUser({ level: 1, exp: 0 });

    const result = await rewardService.grantReward(user.id, {
      sourceType: 'manual',
      sourceId: 0,
      exp: 600, // 應該直接升到 Lv.3
    });

    expect(result.leveledUp).toBe(true);
    expect(result.previousLevel).toBe(1);
    expect(result.newLevel).toBe(3);
    expect(result.levelsGained).toBe(2);
  });
});
```

---

## 8. 未來擴展

### 8.1 動態經驗值

根據用戶行為動態調整：

```typescript
// 根據觀看速度、重複觀看次數等因素調整
function calculateDynamicExp(
  baseExp: number,
  watchCount: number,
  completionTime: number
): number {
  let multiplier = 1.0;

  // 首次完成獎勵
  if (watchCount === 1) {
    multiplier *= 1.2;
  }

  // 快速完成獎勵
  if (completionTime < expectedTime * 0.8) {
    multiplier *= 1.1;
  }

  return Math.floor(baseExp * multiplier);
}
```

### 8.2 成就系統

```typescript
interface Achievement {
  id: number;
  name: string;
  description: string;
  condition: (user: User) => boolean;
  reward: {
    exp: number;
    badge?: string;
  };
}

// 範例成就
const achievements: Achievement[] = [
  {
    id: 1,
    name: '初學者',
    description: '完成第一個課程單元',
    condition: (user) => user.completedLessons >= 1,
    reward: { exp: 100 },
  },
  {
    id: 2,
    name: '學習狂人',
    description: '連續 7 天學習',
    condition: (user) => user.streakDays >= 7,
    reward: { exp: 500, badge: 'learning-maniac' },
  },
];
```

### 8.3 VIP 經驗值加成

```typescript
function getExpMultiplier(user: User): number {
  if (user.roles.includes('vip_premium')) {
    return 1.5; // 150% 經驗值
  }
  if (user.roles.includes('vip_basic')) {
    return 1.2; // 120% 經驗值
  }
  return 1.0;
}
```

---

## 更新日期
- 2025-11-18：初版設計，定義遞增經驗值機制和完整獎勵流程
