# 水球軟體學院課程平台復刻 - 詳細開發攻略

## 一、面試核心要點理解

### 1.1 面試評估重點
- **Discovery**: 主動釐清產品運作原理
- **Formulation**: 將產品功能規格化（可執行規格如 Gherkin）
- **Automation**: 規格驅動開發能力
- **AI x BDD**: 透過 AI 放大產值，實現多倍開發速度
- **敏捷迭代**: 多次 Release、快速反饋、持續改進

### 1.2 必做事項
- 加入 Discord 宣告決心
- **主動提問**（不提問會直接落選） 
- 多次 Release 到 Discord 頻道
- E2E 自動化測試（必要）
- 錄製產品 Demo 影片

### 1.3 技術要求
- 前端：Next.js
- 後端：Java + Spring Boot
- 資料庫：PostgreSQL
- 部署：Docker Compose（必須能 `docker-compose up` 啟動）
- 可選：雲端服務（如 S3 替代方案）

---

## 二、平台核心功能模組分析

### 2.1 用戶系統
- 註冊/登入
- 個人檔案（學號、頭像、暱稱）
- 等級系統（Lv.1 - Lv.19+）
- 經驗值累積
- 技能評級（F- 到更高等級）

### 2.2 課程系統
- 課程列表（多門課程切換）
- 章節結構（副本概念）
- 課程單元（影片/文章/問卷）
- 觀看進度追蹤
- 課程交付與獎勵（經驗值）

### 2.3 遊戲化功能
- 排行榜（學習排行榜 + 本週成長榜）
- 挑戰地圖（道館系統）
  - 主線/支線任務
  - 難度星級（★ ~ ★★★★）
  - 挑戰模式選擇
  - 作業提交
  - 老師批改與回饋
- 挑戰歷程（公開作品集）
- 技能評級視覺化

### 2.4 獎勵任務系統（進階功能）
- 任務列表（待接受/進行中/已完成）
- 任務條件與獎勵
- 期限延長機制
- 機會卡消耗

---

## 三、推薦開發策略（敏捷迭代）

### 3.1 MVP 思維
**核心原則**：快速確認需求 → 快速澄清規格 → 快速收斂範疇 → 快速 AI 開發 → 快速上線 → 快速反饋

### 3.2 建議 Release 計畫

#### Release 1（Day 1-3）：基礎骨架
**目標**：最小可運行系統 + E2E 測試框架

**範疇**：
1. Docker Compose 環境設置
2. 用戶註冊/登入（JWT 認證）
3. 基本課程列表展示
4. 第一個 E2E 測試

**產出**：
- 可執行的 docker-compose.yml
- 基本 API 結構
- 前端路由框架
- Cucumber/Gherkin 規格範例

**Discord 提問範例**：
- 「用戶註冊需要哪些欄位？是否需要 email 驗證？」
- 「學號是系統自動生成還是用戶自選？格式是什麼？」

---

#### Release 2（Day 4-6）：課程核心
**目標**：課程觀看流程完整

**範疇**：
1. 課程章節結構展示
2. 課程單元頁面（影片播放）
3. 觀看進度追蹤
4. 課程交付功能
5. 經驗值獲取

**產出**：
- 影片播放器整合
- 進度條儲存邏輯
- 交付 API
- 相關 E2E 測試

**Discord 提問範例**：
- 「影片觀看進度到多少%才能交付？是 100% 還是有彈性？」
- 「經驗值計算公式是什麼？」

---

#### Release 3（Day 7-8）：遊戲化元素
**目標**：排行榜 + 等級系統

**範疇**：
1. 經驗值累積觸發升級
2. 等級門檻表實作
3. 排行榜 API
4. 本週成長榜計算

**產出**：
- 等級系統完整邏輯
- 排行榜前端頁面
- 相關 E2E 測試

**Discord 提問範例**：
- 「等級升級的經驗值門檻表是什麼？」
- 「本週成長榜的計算週期是週一開始還是滾動 7 天？」

---

#### Release 4（Day 9-10）：道館挑戰（選做）
**目標**：作業提交系統

**範疇**：
1. 道館頁面展示
2. 挑戰模式選擇
3. 題目內容顯示
4. 作業檔案上傳

**產出**：
- 檔案上傳功能
- 道館資料模型
- 相關 E2E 測試

---

#### Release 5（Day 10-10.5）：收尾優化
**目標**：整體體驗優化 + Demo 準備

**範疇**：
1. UI 美化
2. 錯誤處理
3. 個人檔案頁面
4. 技能評級展示
5. 錄製 Demo 影片

---

## 四、技術架構建議

### 4.1 專案結構

```
waterball-clone/
├── docker-compose.yml
├── frontend/                 # Next.js
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/        # API calls
│   │   └── styles/
│   ├── package.json
│   └── Dockerfile
├── backend/                  # Spring Boot
│   ├── src/main/java/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   └── dto/
│   ├── src/test/
│   │   └── resources/
│   │       └── features/    # Gherkin specs
│   ├── pom.xml
│   └── Dockerfile
├── specs/                    # 可執行規格
│   └── features/
│       ├── user_registration.feature
│       ├── course_viewing.feature
│       └── leaderboard.feature
└── e2e/                      # E2E 測試
    └── cypress/ or playwright/
```

### 4.2 資料模型建議

```java
// 核心實體
User {
    id, email, password, nickname, avatarUrl, studentId,
    level, experience, createdAt
}

Journey {
    id, name, description, imageUrl
}

Chapter {
    id, journeyId, title, order
}

Mission {
    id, chapterId, title, type (VIDEO/ARTICLE/QUIZ),
    contentUrl, experienceReward, order
}

UserProgress {
    userId, missionId, progress (0-100), completed, deliveredAt
}

Gym {
    id, chapterId, title, difficulty, description
}

Submission {
    id, userId, gymId, fileUrl, feedback, grade, submittedAt
}
```

### 4.3 API 設計建議

```
# 用戶相關
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/me
GET    /api/users/{id}/profile
GET    /api/users/{id}/portfolio

# 課程相關
GET    /api/journeys
GET    /api/journeys/{id}/chapters
GET    /api/chapters/{id}/missions
GET    /api/missions/{id}
POST   /api/missions/{id}/progress
POST   /api/missions/{id}/deliver

# 遊戲化
GET    /api/leaderboard
GET    /api/leaderboard/weekly
GET    /api/journeys/{id}/roadmap

# 道館
GET    /api/gyms/{id}
POST   /api/gyms/{id}/submissions
GET    /api/users/{id}/submissions
```

---

## 五、可執行規格範例（Gherkin）

```gherkin
# user_registration.feature
Feature: 用戶註冊
  作為訪客
  我想要註冊帳號
  以便開始學習課程

  Scenario: 成功註冊新帳號
    Given 我在註冊頁面
    When 我輸入有效的 email "test@example.com"
    And 我輸入密碼 "Password123"
    And 我輸入暱稱 "TestUser"
    And 我點擊註冊按鈕
    Then 我應該看到註冊成功訊息
    And 系統應該自動分配學號

# course_progress.feature
Feature: 課程觀看進度
  作為學員
  我想要追蹤我的課程觀看進度
  以便知道何時可以交付課程

  Scenario: 觀看影片並交付
    Given 我是已登入的學員
    And 我正在觀看課程影片 "設計模式入門"
    When 我的觀看進度達到 100%
    Then 我應該能夠交付此課程
    When 我點擊交付按鈕
    Then 我的經驗值應該增加 100 點

# leaderboard.feature
Feature: 排行榜
  作為學員
  我想要查看排行榜
  以便了解我的學習排名

  Scenario: 查看學習排行榜
    Given 系統中有多位學員
    When 我查看學習排行榜
    Then 我應該看到學員按經驗值降序排列
    And 每位學員顯示等級和經驗值
```

---

## 六、AI 開發策略

### 6.1 使用 AI 的時機
1. **生成基礎代碼**：Entity、DTO、Controller 基本結構
2. **前端組件**：根據截圖生成 React 組件
3. **測試代碼**：根據 Gherkin 生成 Step Definitions
4. **重複性工作**：CRUD 操作、API 調用

### 6.2 人工把關重點
1. **商業邏輯**：經驗值計算、等級升級邏輯
2. **資料一致性**：交易處理、並發控制
3. **安全性**：認證授權、輸入驗證
4. **架構決策**：模組劃分、依賴關係

### 6.3 AI 提示詞範例

```
# 生成 Entity
請根據以下需求生成 Spring Boot Entity:
- 用戶表：包含 id, email, password, nickname, level, experience
- 使用 JPA 註解
- 包含基本的 getter/setter
- 加入審計欄位（createdAt, updatedAt）

# 生成前端組件
請根據這個排行榜設計生成 React 組件:
- 顯示排名、頭像、暱稱、等級、經驗值
- 使用 Tailwind CSS
- 支持響應式設計
- 前三名有特殊樣式
```

---

## 七、常見陷阱與建議

### 7.1 避免的錯誤
1. **不提問**：這是最致命的錯誤，會直接落選
2. **埋頭苦幹不 Release**：沒有反饋循環
3. **過度設計**：避免 Clean Architecture 等複雜架構
4. **忽略 E2E 測試**：這是硬性要求
5. **最後才整合 Docker**：應該從第一天就配置好

### 7.2 加分項目
1. **規格文件完整**：Gherkin 規格、API 文檔
2. **頻繁且有意義的提問**：展現主動性
3. **多次小型 Release**：展現敏捷能力
4. **清晰的程式碼結構**：基本分層
5. **完整的 E2E 測試覆蓋**

### 7.3 時間管理建議
- **Day 1**：環境設置 + 第一次 Discord 提問
- **Day 2-3**：Release 1 + 提交到 Discord
- **Day 4-6**：Release 2 + 持續提問
- **Day 7-8**：Release 3
- **Day 9-10**：Release 4（視情況）
- **Day 10.5**：錄製 Demo 影片 + 提交

---

## 八、提交清單

### 8.1 Google Form 提交內容
1. 基本問題回答
2. 文字介紹開發成果
3. 專案 ZIP 檔案（含 docker-compose.yml）
4. Demo 影片（包含人像，介紹功能）

### 8.2 影片錄製要點
- 使用 OBS 等軟體
- 開啟鏡頭（人像放右下角）
- 介紹開發了哪些功能
- 實際操作 Demo
- 不需要太長，簡潔清楚即可

---

## 九、總結

這場面試的核心不在於你能做出多完美的產品，而在於：

1. **你是否主動溝通**（Discord 提問）
2. **你是否具備規格思維**（Gherkin 等可執行規格）
3. **你是否能快速迭代**（多次 Release）
4. **你是否善用 AI**（提升開發效率）
5. **你是否理解敏捷精神**（快速反饋循環）

記住面試官的話：「能在一週內做到多次 Release、範疇清楚、結果精準的人，會是最厲害的 AI 敏捷開發高手。」

祝你面試順利！
