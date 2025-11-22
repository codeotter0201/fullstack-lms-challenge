-- V2__insert_initial_data.sql
-- 插入開發/測試用初始資料
-- 包含: 2 個課程 (1 免費 + 1 付費) 和 5 個單元

-- ==========================================
-- 1. 建立測試課程
-- ==========================================
INSERT INTO courses (title, description, thumbnail_url, is_premium, is_published, display_order, created_at, updated_at)
VALUES
    (
        'Java 基礎入門',
        '從零開始學習 Java 程式設計',
        'https://example.com/java-basics.jpg',
        false,  -- 免費課程
        true,
        1,
        NOW(),
        NOW()
    ),
    (
        'Spring Boot 實戰',
        '使用 Spring Boot 建立企業級應用',
        'https://example.com/spring-boot.jpg',
        true,   -- 付費課程
        true,
        2,
        NOW(),
        NOW()
    );

-- ==========================================
-- 2. 建立課程 1 的單元 (免費課程)
-- ==========================================
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, experience_reward, is_published, created_at, updated_at)
VALUES
    (
        1,
        'Java 環境安裝',
        '學習如何安裝 JDK 和 IDE',
        'VIDEO',
        'https://www.youtube.com/watch?v=example1',
        600,   -- 10 分鐘
        1,
        200,
        true,
        NOW(),
        NOW()
    ),
    (
        1,
        '第一個 Java 程式',
        '撰寫並執行第一個 Hello World',
        'VIDEO',
        'https://www.youtube.com/watch?v=example2',
        900,   -- 15 分鐘
        2,
        200,
        true,
        NOW(),
        NOW()
    ),
    (
        1,
        '變數與資料型別',
        '認識 Java 的基本資料型別',
        'VIDEO',
        'https://www.youtube.com/watch?v=example3',
        1200,  -- 20 分鐘
        3,
        200,
        true,
        NOW(),
        NOW()
    );

-- ==========================================
-- 3. 建立課程 2 的單元 (付費課程)
-- ==========================================
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, experience_reward, is_published, created_at, updated_at)
VALUES
    (
        2,
        'Spring Boot 介紹',
        '認識 Spring Boot 框架',
        'VIDEO',
        'https://www.youtube.com/watch?v=example4',
        800,   -- 約 13 分鐘
        1,
        200,
        true,
        NOW(),
        NOW()
    ),
    (
        2,
        '建立第一個 REST API',
        '使用 Spring Boot 建立 API',
        'VIDEO',
        'https://www.youtube.com/watch?v=example5',
        1500,  -- 25 分鐘
        2,
        200,
        true,
        NOW(),
        NOW()
    );

-- ==========================================
-- 驗證資料插入結果
-- ==========================================
-- 課程總數應為 2
-- 單元總數應為 5 (課程 1: 3 個，課程 2: 2 個)
