👉 [R1 規劃 4/5] 交付內容 & 測試清單

### 交付內容

Release 1 完成後,我們會提供以下完整的交付物:

**1. 測試環境 URL**
- 前端: Vercel 部署 (自動 HTTPS)
- 後端: Linode / AWS EC2 部署 (Docker Compose)
- 資料庫: PostgreSQL (Docker,與後端同機部署)
- URL 格式:
  - 前端: https://waterball-lms-xxx.vercel.app
  - 後端: https://api.waterball-lms.com (需配置域名)

**2. 測試帳號 (三層架構)**
- 免費學員: student-free@example.com / password123
- 付費學員: student-paid@example.com / password123
- 老師: teacher@example.com / password123 (R3 道館審核時使用)
- 管理員: admin@example.com / password123 (系統管理功能)

說明: R1 先實作基礎三層架構,一個用戶只有一個主要角色,資料庫結構已預留多身分組擴充空間

**3. Docker Compose 部署包**
包含:
- docker-compose.yml (本地開發: 前端 + 後端 + PostgreSQL)
- docker-compose.prod.yml (生產環境: 後端 + PostgreSQL,部署到 EC2/Linode)
- .env.example (環境變數範本)
- docs/deployment/README.md (部署說明文件)

**4. E2E 自動化測試報告 (Playwright)**
測試範圍: 登入流程、付費/免費用戶權限驗證、影片觀看完整流程、進度自動儲存、斷點續播、單元完成判定 (100% 進度)、單元交付功能 (點擊小圈圈)、經驗值獲得與升級、防重複交付
報告格式: HTML 測試報告 + 截圖 (失敗案例)
成功標準: 核心流程測試全部通過

**5. GitHub Repository**
- 前端: Next.js 專案 (TypeScript + Tailwind CSS)
- 後端: Spring Boot 專案 (Java 17+)
- README.md: 專案說明、技術棧、本地開發指南
- CHANGELOG.md: Release 1 功能清單

### 技術架構

**前端技術棧**
- 框架: Next.js 14 (App Router)
- 語言: TypeScript 5.x
- UI 框架: React 18
- 樣式: Tailwind CSS 3.x
- 狀態管理: React Context API (R1 簡單版,R2 可能改用 Zustand)
- API 請求: Fetch API + 自訂 API Client
- 影片播放: YouTube IFrame API

**後端技術棧**
- 框架: Spring Boot 3.x
- 語言: Java 17+
- 安全: Spring Security + JWT
- 資料庫: Spring Data JPA + PostgreSQL 15
- API 文件: Swagger/OpenAPI (可選)
- 測試: JUnit 5 + Mockito

**部署架構**
生產環境: Frontend (Vercel) → HTTPS → Backend (Linode / AWS EC2 - Docker) → PostgreSQL (Docker,同機部署)
本地開發: Frontend (localhost:3000) → Backend (localhost:8080) → PostgreSQL (Docker / localhost:5432)

### PM 測試清單

Release 1 完成後,你可以進行以下測試來驗收功能:

**權限驗證測試**
- 用免費用戶帳號登入
- 嘗試點擊付費課程
- 應該看到鎖定遮罩與升級提示訊息
- 確認無法觀看付費課程影片

**付費用戶觀看測試**
- 用付費用戶帳號登入
- 點擊任一課程單元 (影片)
- 影片應該可以正常播放
- 播放控制功能 (播放、暫停、進度條、全螢幕) 正常運作

**經驗值獲得測試**
- 觀看一支影片到 100% 進度
- 影片單元旁邊應該顯示可點擊的小圈圈
- 點擊小圈圈「交付單元」
- 應該看到 Toast 通知顯示「獲得 200 EXP」
- 個人檔案或導航欄顯示經驗值增加
- 小圈圈變為已完成狀態 (✓ 圖示)
- 如果達到升級門檻,應該看到等級提升
- 再次點擊已交付的單元,應該無法重複獲得經驗值

**斷點續播測試**
- 觀看影片到一半 (例如 50% 進度)
- 關閉瀏覽器 (或切換到其他頁面)
- 重新開啟該課程頁面
- 影片應該從上次的位置 (50%) 繼續播放

**手機版體驗測試**
- 用手機瀏覽器開啟測試環境 URL
- 檢查導航欄是否正常顯示 (漢堡選單)
- 點擊漢堡選單,側邊欄應該以抽屜方式開啟
- 影片播放器應該適應手機螢幕寬度
- 所有功能在手機上可正常使用

---

### 請確認

以上交付內容、技術架構、測試清單是否正確合理?
- 交付內容是否符合你的期望?
- 技術架構是否有需要調整的地方?
- 測試清單是否有遺漏或需要刪減的項目?

歡迎提出任何建議或調整需求!
