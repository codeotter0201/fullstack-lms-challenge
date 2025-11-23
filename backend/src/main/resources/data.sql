-- 測試資料 (開發環境使用)
-- 注意: 這些資料僅用於開發測試,不會在生產環境執行
-- 圖片來源: Unsplash (免費商用) - https://unsplash.com
-- 影片來源: YouTube 公開影片

-- ============================================================================
-- 課程資料
-- ============================================================================
INSERT INTO courses (title, description, thumbnail_url, is_premium, price, is_published, display_order, created_at, updated_at)
VALUES
    (
        'Java 基礎入門',
        '從零開始學習 Java 程式設計，適合完全沒有程式基礎的初學者',
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        false,
        0,
        true,
        1,
        NOW(),
        NOW()
    ),
    (
        'Spring Boot 實戰',
        '使用 Spring Boot 建立企業級應用，包含 RESTful API、資料庫整合等實戰技巧',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
        true,
        2990.00,
        true,
        2,
        NOW(),
        NOW()
    ),
    (
        'React 前端開發',
        '學習現代前端框架 React，打造互動式網頁應用',
        'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        true,
        3990.00,
        true,
        3,
        NOW(),
        NOW()
    ),
    (
        'Python 資料科學',
        '使用 Python 進行資料分析與機器學習入門',
        'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
        true,
        4990.00,
        true,
        4,
        NOW(),
        NOW()
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 課程單元資料 (使用有趣的 YouTube 影片)
-- ============================================================================

-- Java 基礎入門課程的單元 (免費課程 - 使用經典梗影片)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, is_published, experience_reward, created_at, updated_at)
SELECT
    c.id,
    title,
    description,
    'VIDEO',
    video_url,
    video_duration,
    display_order,
    true,
    200,
    NOW(),
    NOW()
FROM courses c
CROSS JOIN (
    VALUES
        ('Java 環境安裝', '學習如何安裝 Java 開發環境（絕對不是瑞克搖）', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 213, 1),
        ('第一個 Java 程式', '撰寫你的第一個 Hello World 程式', 'https://www.youtube.com/watch?v=yPYZpwSpKmA', 185, 2),
        ('變數與資料型態', '了解 Java 的變數宣告與基本資料型態', 'https://www.youtube.com/watch?v=fC7oUOUEEi4', 156, 3),
        ('條件判斷', '學習 if-else 與 switch 條件控制', 'https://www.youtube.com/watch?v=lpiB2wMc49g', 243, 4),
        ('迴圈控制', '掌握 for、while 迴圈的使用技巧', 'https://www.youtube.com/watch?v=moSFlvxnbgk', 198, 5),
        ('陣列操作', '學習如何使用陣列儲存多筆資料', 'https://www.youtube.com/watch?v=V-_O7nl0Ii0', 234, 6),
        ('函式與方法', '了解如何定義與呼叫方法', 'https://www.youtube.com/watch?v=iik25wqIuFo', 167, 7),
        ('物件導向基礎', '認識類別與物件的基本概念', 'https://www.youtube.com/watch?v=Ct6BUPvE2sM', 221, 8),
        ('繼承與多型', '深入理解物件導向的繼承機制', 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', 189, 9),
        ('例外處理', '學習如何優雅地處理程式錯誤', 'https://www.youtube.com/watch?v=ZZ5LpwO-An4', 276, 10)
) AS lessons(title, description, video_url, video_duration, display_order)
WHERE c.title = 'Java 基礎入門'
ON CONFLICT DO NOTHING;

-- Spring Boot 實戰課程的單元 (付費課程 - 使用有趣的程式教學影片)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, is_published, experience_reward, created_at, updated_at)
SELECT
    c.id,
    title,
    description,
    'VIDEO',
    video_url,
    video_duration,
    display_order,
    true,
    300,
    NOW(),
    NOW()
FROM courses c
CROSS JOIN (
    VALUES
        ('Spring Boot 簡介', '認識 Spring Boot 框架與核心概念', 'https://www.youtube.com/watch?v=vtPkZShrvXQ', 245, 1),
        ('建立第一個專案', '使用 Spring Initializr 建立專案', 'https://www.youtube.com/watch?v=eBGIQ7ZuuiU', 198, 2),
        ('RESTful API 設計', '設計符合 REST 規範的 API', 'https://www.youtube.com/watch?v=SLwpqD8n3d0', 312, 3),
        ('資料庫整合 JPA', '使用 JPA 與資料庫互動', 'https://www.youtube.com/watch?v=00-y7q3H1kE', 267, 4),
        ('Spring Security 基礎', '實作使用者認證與授權', 'https://www.youtube.com/watch?v=sm-8qfMWEV8', 423, 5),
        ('JWT Token 實作', '實作 JWT 身份驗證機制', 'https://www.youtube.com/watch?v=X80nJ5T7YpE', 389, 6),
        ('檔案上傳功能', '實作檔案上傳與儲存', 'https://www.youtube.com/watch?v=mEcM4hLX-4U', 234, 7),
        ('Email 發送服務', '整合 Email 發送功能', 'https://www.youtube.com/watch?v=3_pGHdiM-8g', 198, 8),
        ('單元測試撰寫', '學習撰寫單元測試與整合測試', 'https://www.youtube.com/watch?v=aHMgGzpvzfU', 345, 9),
        ('部署到雲端', '將應用部署到 Heroku/AWS', 'https://www.youtube.com/watch?v=tnTy7UiP_0o', 412, 10),
        ('效能優化技巧', 'Spring Boot 應用效能優化', 'https://www.youtube.com/watch?v=O5pqJRUrWC4', 289, 11),
        ('Docker 容器化', '使用 Docker 容器化應用', 'https://www.youtube.com/watch?v=Gjnup-PuquQ', 356, 12)
) AS lessons(title, description, video_url, video_duration, display_order)
WHERE c.title = 'Spring Boot 實戰'
ON CONFLICT DO NOTHING;

-- React 前端開發課程的單元 (付費課程 - 使用 React 相關梗影片)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, is_published, experience_reward, created_at, updated_at)
SELECT
    c.id,
    title,
    description,
    'VIDEO',
    video_url,
    video_duration,
    display_order,
    true,
    300,
    NOW(),
    NOW()
FROM courses c
CROSS JOIN (
    VALUES
        ('React 核心概念', '認識 React 的基本概念與特色', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 267, 1),
        ('JSX 語法介紹', '學習 JSX 的語法與使用方式', 'https://www.youtube.com/watch?v=7iJtraVUDQc', 189, 2),
        ('元件與 Props', '建立可重用的 React 元件', 'https://www.youtube.com/watch?v=hQAHSlTtcmY', 234, 3),
        ('State 狀態管理', '理解 React 的狀態管理機制', 'https://www.youtube.com/watch?v=O6P86uwfdR0', 298, 4),
        ('Hooks 基礎', '學習 useState 和 useEffect', 'https://www.youtube.com/watch?v=TNhaISOUy6Q', 312, 5),
        ('表單處理', '處理使用者輸入與表單驗證', 'https://www.youtube.com/watch?v=IkMND33x0qQ', 245, 6),
        ('React Router', '實作前端路由與頁面導航', 'https://www.youtube.com/watch?v=Ul3y1LXxzdU', 289, 7),
        ('API 資料串接', '使用 fetch/axios 串接後端 API', 'https://www.youtube.com/watch?v=QGvpMKJ04Tc', 356, 8),
        ('Context API', '使用 Context 管理全域狀態', 'https://www.youtube.com/watch?v=35lXWvCuM8o', 278, 9),
        ('效能優化', 'React 效能優化技巧與最佳實踐', 'https://www.youtube.com/watch?v=uojLJFt9SzY', 321, 10)
) AS lessons(title, description, video_url, video_duration, display_order)
WHERE c.title = 'React 前端開發'
ON CONFLICT DO NOTHING;

-- Python 資料科學課程的單元 (付費課程 - 使用 Python 教學影片)
INSERT INTO lessons (course_id, title, description, type, video_url, video_duration, display_order, is_published, experience_reward, created_at, updated_at)
SELECT
    c.id,
    title,
    description,
    'VIDEO',
    video_url,
    video_duration,
    display_order,
    true,
    300,
    NOW(),
    NOW()
FROM courses c
CROSS JOIN (
    VALUES
        ('Python 基礎複習', '快速複習 Python 基本語法', 'https://www.youtube.com/watch?v=rfscVS0vtbw', 367, 1),
        ('NumPy 陣列運算', '使用 NumPy 進行高效數值運算', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 234, 2),
        ('Pandas 資料處理', '使用 Pandas 處理表格資料', 'https://www.youtube.com/watch?v=vmEHCJofslg', 298, 3),
        ('資料視覺化', '使用 Matplotlib 繪製統計圖表', 'https://www.youtube.com/watch?v=UO98lJQ3QGI', 312, 4),
        ('資料清理技巧', '處理缺失值與異常資料', 'https://www.youtube.com/watch?v=bDhvCp3_lYw', 267, 5),
        ('統計分析基礎', '描述性統計與機率分布', 'https://www.youtube.com/watch?v=xxpc-HPKN28', 289, 6),
        ('機器學習入門', '認識機器學習的基本概念', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 421, 7),
        ('迴歸分析', '使用線性迴歸預測數值', 'https://www.youtube.com/watch?v=nk2CQITm_eo', 345, 8),
        ('分類演算法', '使用決策樹進行分類', 'https://www.youtube.com/watch?v=RmajweUFKvM', 298, 9),
        ('模型評估', '評估機器學習模型的效能', 'https://www.youtube.com/watch?v=85dtiMz9tSo', 256, 10),
        ('實戰專案', '完整的資料科學專案實作', 'https://www.youtube.com/watch?v=ua-CiDNNj30', 456, 11)
) AS lessons(title, description, video_url, video_duration, display_order)
WHERE c.title = 'Python 資料科學'
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 說明
-- ============================================================================
-- 圖片來源:
-- - Unsplash (https://unsplash.com) - 免費商用圖片
--
-- 影片來源:
-- - YouTube 公開影片，包含:
--   1. 經典瑞克搖 (Never Gonna Give You Up) - 作為第一個 Java 單元的驚喜
--   2. 各類程式教學影片
--   3. 熱門梗影片與教學內容
--
-- 課程設計:
-- - Java 基礎入門: 免費課程 (NT$0)，10 個單元
-- - Spring Boot 實戰: 付費課程 (NT$2,990)，12 個單元
-- - React 前端開發: 付費課程 (NT$3,990)，10 個單元
-- - Python 資料科學: 付費課程 (NT$4,990)，11 個單元
