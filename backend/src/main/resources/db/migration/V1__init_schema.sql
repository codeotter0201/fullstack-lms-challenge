-- V1__init_schema.sql
-- 建立水球軟體學院 LMS 初始資料庫結構
-- 包含: users, courses, lessons, progress 共 4 張資料表

-- ==========================================
-- 1. 用戶表 (users)
-- ==========================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url VARCHAR(500),
    role VARCHAR(20) NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    experience INTEGER NOT NULL DEFAULT 0,
    is_premium BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- 索引: 加速 email 查詢 (登入)
CREATE INDEX idx_users_email ON users(email);

COMMENT ON TABLE users IS '用戶表：儲存用戶基本資訊與認證資料';
COMMENT ON COLUMN users.email IS '電子郵件 (唯一，用於登入)';
COMMENT ON COLUMN users.password IS 'BCrypt 加密後的密碼';
COMMENT ON COLUMN users.role IS '角色: STUDENT, TEACHER, ADMIN';
COMMENT ON COLUMN users.level IS '用戶等級 (由 experience 計算)';
COMMENT ON COLUMN users.experience IS '經驗值 (1000 EXP = 1 級)';
COMMENT ON COLUMN users.is_premium IS '是否為付費會員';

-- ==========================================
-- 2. 課程表 (courses)
-- ==========================================
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    is_premium BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- 索引: 加速課程查詢 (權限過濾 + 排序)
CREATE INDEX idx_courses_published_premium ON courses(is_published, is_premium);
CREATE INDEX idx_courses_display_order ON courses(display_order);

COMMENT ON TABLE courses IS '課程表：儲存課程資訊';
COMMENT ON COLUMN courses.is_premium IS '是否為付費課程 (免費用戶無法訪問)';
COMMENT ON COLUMN courses.is_published IS '是否已發布 (未發布的課程不顯示)';
COMMENT ON COLUMN courses.display_order IS '顯示順序 (數字小的排在前面)';

-- ==========================================
-- 3. 單元表 (lessons)
-- ==========================================
CREATE TABLE lessons (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    video_url VARCHAR(500),
    video_duration INTEGER,
    content TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT true,
    experience_reward INTEGER NOT NULL DEFAULT 200,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_lessons_course
        FOREIGN KEY (course_id)
        REFERENCES courses(id)
        ON DELETE CASCADE
);

-- 索引: 加速單元查詢
CREATE INDEX idx_lessons_course_id ON lessons(course_id);
CREATE INDEX idx_lessons_course_order ON lessons(course_id, display_order);

COMMENT ON TABLE lessons IS '單元表：儲存課程單元內容';
COMMENT ON COLUMN lessons.type IS '單元類型: VIDEO, ARTICLE, QUIZ';
COMMENT ON COLUMN lessons.video_url IS 'YouTube 影片 URL';
COMMENT ON COLUMN lessons.video_duration IS '影片長度 (秒)';
COMMENT ON COLUMN lessons.content IS '文章內容 (ARTICLE 類型使用)';
COMMENT ON COLUMN lessons.experience_reward IS '完成後獲得的經驗值';

-- ==========================================
-- 4. 學習進度表 (progress)
-- ==========================================
CREATE TABLE progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    progress_percentage INTEGER NOT NULL DEFAULT 0,
    last_position INTEGER NOT NULL DEFAULT 0,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    is_submitted BOOLEAN NOT NULL DEFAULT false,
    experience_gained INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_progress_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_progress_lesson
        FOREIGN KEY (lesson_id)
        REFERENCES lessons(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_progress_user_lesson
        UNIQUE (user_id, lesson_id)
);

-- 索引: 加速進度查詢
CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_lesson_id ON progress(lesson_id);
CREATE INDEX idx_progress_completed ON progress(user_id, is_completed);

COMMENT ON TABLE progress IS '學習進度表：追蹤用戶的學習進度';
COMMENT ON COLUMN progress.progress_percentage IS '進度百分比 (0-100)';
COMMENT ON COLUMN progress.last_position IS '最後播放位置 (秒)';
COMMENT ON COLUMN progress.is_completed IS '是否完成 (進度 >= 100%)';
COMMENT ON COLUMN progress.is_submitted IS '是否已交付 (領取經驗值)';
COMMENT ON COLUMN progress.experience_gained IS '已獲得的經驗值';
COMMENT ON CONSTRAINT uq_progress_user_lesson ON progress IS '每個用戶對每個單元只能有一筆進度記錄';
