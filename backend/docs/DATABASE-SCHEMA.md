# 資料庫架構文檔

## 資料庫資訊

- **類型**: PostgreSQL 15
- **資料庫名稱**: waterball_lms
- **字符集**: UTF-8

## 資料表結構

### users (用戶表)

用戶基本資訊與認證資料

| 欄位名 | 類型 | 約束 | 說明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 用戶 ID |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 電子郵件 (登入帳號) |
| password | VARCHAR(255) | NOT NULL | 加密後的密碼 (BCrypt) |
| display_name | VARCHAR(100) | | 顯示名稱 |
| avatar_url | VARCHAR(500) | | 頭像 URL |
| role | VARCHAR(20) | NOT NULL | 角色: STUDENT, ADMIN |
| level | INTEGER | NOT NULL, DEFAULT 1 | 用戶等級 |
| experience | INTEGER | NOT NULL, DEFAULT 0 | 經驗值 |
| is_premium | BOOLEAN | NOT NULL, DEFAULT false | 是否為付費會員 |
| created_at | TIMESTAMP | NOT NULL | 創建時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引:**
- `idx_users_email` ON (email)

**業務規則:**
- email 唯一，用於登入
- password 使用 BCrypt 加密
- level 由 experience 計算: `level = (experience / 1000) + 1`

---

### courses (課程表)

課程資訊

| 欄位名 | 類型 | 約束 | 說明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 課程 ID |
| title | VARCHAR(200) | NOT NULL | 課程標題 |
| description | TEXT | | 課程描述 |
| thumbnail_url | VARCHAR(500) | | 縮圖 URL |
| is_premium | BOOLEAN | NOT NULL, DEFAULT false | 是否為付費課程 |
| is_published | BOOLEAN | NOT NULL, DEFAULT true | 是否已發布 |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | 顯示順序 |
| created_at | TIMESTAMP | NOT NULL | 創建時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引:**
- `idx_courses_published_premium` ON (is_published, is_premium)
- `idx_courses_display_order` ON (display_order)

**業務規則:**
- 免費用戶只能看到 `is_premium = false` 的課程
- 付費用戶可以看到所有課程
- 只顯示 `is_published = true` 的課程

---

### lessons (單元表)

課程單元內容

| 欄位名 | 類型 | 約束 | 說明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 單元 ID |
| course_id | BIGINT | NOT NULL, FK → courses | 所屬課程 ID |
| title | VARCHAR(200) | NOT NULL | 單元標題 |
| description | TEXT | | 單元描述 |
| type | VARCHAR(20) | NOT NULL | 類型: VIDEO, ARTICLE, QUIZ |
| video_url | VARCHAR(500) | | YouTube 影片 URL |
| video_duration | INTEGER | | 影片長度 (秒) |
| content | TEXT | | 文章內容 (ARTICLE 類型) |
| display_order | INTEGER | NOT NULL, DEFAULT 0 | 顯示順序 |
| is_published | BOOLEAN | NOT NULL, DEFAULT true | 是否已發布 |
| experience_reward | INTEGER | NOT NULL, DEFAULT 200 | 完成獎勵經驗值 |
| created_at | TIMESTAMP | NOT NULL | 創建時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引:**
- `idx_lessons_course_id` ON (course_id)
- `idx_lessons_course_order` ON (course_id, display_order)

**外鍵:**
- `fk_lessons_course` FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE

**業務規則:**
- type = VIDEO 時，必須有 video_url 和 video_duration
- type = ARTICLE 時，必須有 content
- 每個課程的單元按 display_order 排序

---

### progress (學習進度表)

用戶的學習進度追蹤

| 欄位名 | 類型 | 約束 | 說明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 進度 ID |
| user_id | BIGINT | NOT NULL, FK → users | 用戶 ID |
| lesson_id | BIGINT | NOT NULL, FK → lessons | 單元 ID |
| progress_percentage | INTEGER | NOT NULL, DEFAULT 0 | 進度百分比 (0-100) |
| last_position | INTEGER | NOT NULL, DEFAULT 0 | 最後播放位置 (秒) |
| is_completed | BOOLEAN | NOT NULL, DEFAULT false | 是否完成 (≥100%) |
| is_submitted | BOOLEAN | NOT NULL, DEFAULT false | 是否已交付 (領取經驗值) |
| experience_gained | INTEGER | NOT NULL, DEFAULT 0 | 已獲得的經驗值 |
| created_at | TIMESTAMP | NOT NULL | 創建時間 |
| updated_at | TIMESTAMP | NOT NULL | 更新時間 |

**索引:**
- `idx_progress_user_lesson` UNIQUE ON (user_id, lesson_id)
- `idx_progress_user_id` ON (user_id)
- `idx_progress_lesson_id` ON (lesson_id)

**外鍵:**
- `fk_progress_user` FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
- `fk_progress_lesson` FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE

**業務規則:**
- 每個用戶對每個單元只有一筆進度記錄 (user_id, lesson_id 唯一)
- progress_percentage = (last_position / video_duration) * 100
- is_completed = (progress_percentage >= 100)
- is_submitted 為 true 後，不能再次領取經驗值

---

## 資料關聯圖

```
┌─────────┐
│  users  │
└────┬────┘
     │ 1:N
     ▼
┌──────────┐
│ progress │
└────┬─────┘
     │ N:1
     ▼
┌─────────┐       ┌──────────┐
│ lessons │◄──────│ courses  │
└─────────┘  N:1  └──────────┘
```

## 查詢範例

### 取得用戶可訪問的課程

```sql
-- 免費用戶
SELECT c.*
FROM courses c
WHERE c.is_published = true
  AND c.is_premium = false
ORDER BY c.display_order;

-- 付費用戶
SELECT c.*
FROM courses c
WHERE c.is_published = true
ORDER BY c.display_order;
```

### 取得課程的所有單元 (含進度)

```sql
SELECT
    l.*,
    COALESCE(p.progress_percentage, 0) as progress_percentage,
    COALESCE(p.last_position, 0) as last_position,
    COALESCE(p.is_completed, false) as is_completed,
    COALESCE(p.is_submitted, false) as is_submitted
FROM lessons l
LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
WHERE l.course_id = ?
  AND l.is_published = true
ORDER BY l.display_order;
```

### 計算課程完成度

```sql
SELECT
    c.id,
    c.title,
    COUNT(l.id) as total_lessons,
    COUNT(CASE WHEN p.is_completed = true THEN 1 END) as completed_lessons,
    ROUND(COUNT(CASE WHEN p.is_completed = true THEN 1 END) * 100.0 / COUNT(l.id), 2) as completion_rate
FROM courses c
JOIN lessons l ON c.id = l.course_id
LEFT JOIN progress p ON l.id = p.lesson_id AND p.user_id = ?
WHERE c.is_published = true
  AND l.is_published = true
GROUP BY c.id, c.title;
```

### 取得用戶學習統計

```sql
SELECT
    u.id,
    u.display_name,
    u.level,
    u.experience,
    COUNT(DISTINCT p.lesson_id) as lessons_completed,
    SUM(p.experience_gained) as total_experience_gained
FROM users u
LEFT JOIN progress p ON u.id = p.user_id AND p.is_completed = true
WHERE u.id = ?
GROUP BY u.id, u.display_name, u.level, u.experience;
```

## 初始化數據

位置: `src/main/resources/data.sql`

```sql
-- 課程
INSERT INTO courses (title, description, thumbnail_url, is_premium, is_published, display_order, created_at, updated_at)
VALUES
    ('Java 基礎入門', '從零開始學習 Java', 'https://example.com/java.jpg', false, true, 1, NOW(), NOW()),
    ('Spring Boot 實戰', '企業級應用開發', 'https://example.com/spring.jpg', true, true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 單元
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, experience_reward, is_published, created_at, updated_at)
VALUES
    (1, 'Java 環境安裝', '安裝 JDK 和 IDE', 'VIDEO', 'https://www.youtube.com/watch?v=xxx', 600, 1, 200, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
```

## 遷移策略

### 當前實施方案: Flyway Database Migration

專案已引入 Flyway 進行資料庫版本控制，所有環境統一使用 `ddl-auto=validate`。

### Migration 檔案結構

```
backend/src/main/resources/db/migration/
  ├── V1__init_schema.sql          # 初始 schema (4 張表 + 索引)
  ├── V2__insert_initial_data.sql  # 測試資料 (2 課程 + 5 單元)
  └── (未來的 migration 檔案)
```

### 配置說明

**開發環境** (application-dev.yml):
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate  # 只驗證，不修改
  flyway:
    enabled: true
    baseline-on-migrate: true
    clean-disabled: false  # 允許 clean
```

**生產環境** (application-prod.yml):
```yaml
spring:
  jpa:
    hibernate:
      ddl-auto: validate
  flyway:
    enabled: true
    baseline-on-migrate: true
    clean-disabled: true  # 禁止 clean
```

### 新增 Migration 檔案

**命名規範**: `V{版本號}__{描述}.sql`

範例:
```sql
-- V3__add_user_phone_number.sql
ALTER TABLE users ADD COLUMN phone_number VARCHAR(20);
CREATE INDEX idx_users_phone ON users(phone_number);
```

### 驗證 Migration

```bash
# 查看 migration 歷史
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms \
  -c "SELECT * FROM flyway_schema_history ORDER BY installed_rank;"

# 檢查表結構
docker exec waterball-lms-db psql -U wblms_user -d waterball_lms -c "\dt"
```

### 重置資料庫 (開發環境)

```bash
# 完全清空並重建
cd deploy
docker-compose down -v
docker-compose up -d

# Flyway 會自動執行所有 migration
```

## 效能優化建議

### 已實現索引
- users.email (唯一索引)
- progress (user_id, lesson_id) 複合唯一索引

### 建議新增索引
```sql
-- 課程查詢優化
CREATE INDEX idx_courses_published_premium ON courses(is_published, is_premium);
CREATE INDEX idx_courses_display_order ON courses(display_order);

-- 單元查詢優化
CREATE INDEX idx_lessons_course_order ON lessons(course_id, display_order);

-- 進度統計優化
CREATE INDEX idx_progress_completed ON progress(user_id, is_completed);
```

### 查詢優化
- 使用 JOIN FETCH 避免 N+1 問題
- 適當使用 @BatchSize
- 考慮使用 Redis 快取課程列表

## 備份策略

### 開發環境
```bash
# 備份
docker exec waterball-lms-db pg_dump -U wblms_user waterball_lms > backup.sql

# 還原
docker exec -i waterball-lms-db psql -U wblms_user waterball_lms < backup.sql
```

### 生產環境
- 每日自動備份
- 保留最近 7 天備份
- 每週完整備份保留 4 週
