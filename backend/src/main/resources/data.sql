-- 測試資料 (開發環境使用)
-- 注意: 這些資料僅用於開發測試,不會在生產環境執行

-- 清空現有資料 (如果表存在)
-- TRUNCATE TABLE progress, lessons, courses, users RESTART IDENTITY CASCADE;

-- 建立測試課程
INSERT INTO courses (title, description, thumbnail_url, is_premium, is_published, display_order, created_at, updated_at)
VALUES
    ('Java 基礎入門', '從零開始學習 Java 程式設計', 'https://example.com/java-basics.jpg', false, true, 1, NOW(), NOW()),
    ('Spring Boot 實戰', '使用 Spring Boot 建立企業級應用', 'https://example.com/spring-boot.jpg', true, true, 2, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 建立測試單元 (課程 1 - 免費課程)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, experience_reward, is_published, created_at, updated_at)
VALUES
    (1, 'Java 環境安裝', '學習如何安裝 JDK 和 IDE', 'VIDEO', 'https://www.youtube.com/watch?v=example1', 600, 1, 200, true, NOW(), NOW()),
    (1, '第一個 Java 程式', '撰寫並執行第一個 Hello World', 'VIDEO', 'https://www.youtube.com/watch?v=example2', 900, 2, 200, true, NOW(), NOW()),
    (1, '變數與資料型別', '認識 Java 的基本資料型別', 'VIDEO', 'https://www.youtube.com/watch?v=example3', 1200, 3, 200, true, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- 建立測試單元 (課程 2 - 付費課程)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, experience_reward, is_published, created_at, updated_at)
VALUES
    (2, 'Spring Boot 介紹', '認識 Spring Boot 框架', 'VIDEO', 'https://www.youtube.com/watch?v=example4', 800, 1, 200, true, NOW(), NOW()),
    (2, '建立第一個 REST API', '使用 Spring Boot 建立 API', 'VIDEO', 'https://www.youtube.com/watch?v=example5', 1500, 2, 200, true, NOW(), NOW())
ON CONFLICT DO NOTHING;
