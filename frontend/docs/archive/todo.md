# 水球軟體學院 UI 復刻 - 開發待辦清單

## 專案概述
完全復刻 https://world.waterballsa.tw/ 的 UI 介面，使用 Next.js 14 + TypeScript + Tailwind CSS。
所有程式碼將放在 `/frontend` 目錄下。

## 開發階段規劃

---

## Phase 0: 規劃與文檔 📋

### 0.1 需求分析與設計
- [x] 閱讀 Release 1 規劃文件
- [x] 使用 Playwright 調查目標網站 UI 結構
- [x] 擷取所有頁面截圖作為參考
- [x] 分析 API 文檔以了解資料結構

### 0.2 設計系統文檔
- [x] 建立 `docs/design-tokens.md` - 定義顏色、字體、間距等設計規範
- [x] 建立 `docs/component-specs.md` - UI 元件規格文檔
- [x] 建立 `docs/page-specifications.md` - 各頁面詳細規格
- [x] 建立 `docs/api-integration-plan.md` - API 整合接口預留計畫

### 0.3 專案規劃文檔
- [x] 建立 `docs/todo.md` (本文件) - 開發待辦清單
- [x] 建立 `docs/implementation-progress.md` - 實作進度追蹤
- [x] 建立 `docs/testing-checklist.md` - 測試檢查清單
- [x] 建立 `docs/component-library-guide.md` - 元件庫使用指南（NEW）

---

## Phase 1: 基礎架構建立 🏗️

### 1.1 Next.js 專案初始化
- [x] 初始化 Next.js 14 專案 (App Router)
- [x] 安裝必要依賴 (React 18, TypeScript, Tailwind CSS)
- [x] 建立 `tsconfig.json` - TypeScript 配置
- [x] 建立 `next.config.js` - Next.js 配置
- [x] 建立 `.eslintrc.json` - ESLint 配置

### 1.2 Tailwind CSS 配置
- [x] 建立 `tailwind.config.ts` - 根據 design-tokens.md 配置
- [x] 建立 `postcss.config.js` - PostCSS 配置
- [ ] 建立 `styles/globals.css` - 全域樣式與 CSS 變數
- [ ] 建立 `styles/design-tokens.css` - CSS 變數定義

### 1.3 專案結構建立
- [x] 建立 `/frontend/app` - Next.js App Router 目錄
- [x] 建立 `/frontend/components` - React 元件目錄
- [x] 建立 `/frontend/lib` - 工具函式與 API client
- [x] 建立 `/frontend/types` - TypeScript 型別定義
- [x] 建立 `/frontend/contexts` - React Context 目錄
- [x] 建立 `/frontend/hooks` - Custom Hooks 目錄
- [x] 建立 `/frontend/public` - 靜態資源目錟
- [ ] 建立 `.gitignore` - Git 忽略清單
- [ ] 建立 `README.md` - 專案說明文件

---

## Phase 2: TypeScript 型別定義 📝

### 2.1 核心資料型別
- [x] `types/user.ts` - 用戶相關型別
  - User, UserRole, UserPermission
  - AuthState, LoginCredentials
- [x] `types/journey.ts` - 課程相關型別
  - Journey, Chapter, Lesson
  - Skill, Reward
- [x] `types/lesson.ts` - 課程單元型別
  - LessonType (video, scroll, google-form)
  - LessonProgress, VideoProgress
- [x] `types/gym.ts` - 道館相關型別 (預留)
  - Gym, GymBadge, ChallengeRecord
- [x] `types/leaderboard.ts` - 排行榜型別
  - LeaderboardEntry, RankType

### 2.2 UI 元件型別
- [x] `types/ui.ts` - UI 元件通用型別
  - ButtonProps, CardProps, ModalProps
  - NavigationItem, DropdownItem

### 2.3 API 回應型別
- [x] `types/api.ts` - API 回應型別
  - ApiResponse<T>, ApiError
  - PaginatedResponse<T>

---

## Phase 3: Mock 資料建立 🗂️

### 3.1 用戶資料
- [x] `lib/mock/users.ts`
  - 免費學員資料 (student-free@example.com)
  - 付費學員資料 (student-paid@example.com)
  - 老師資料 (teacher@example.com)
  - 管理員資料 (admin@example.com)

### 3.2 課程資料
- [x] `lib/mock/journeys.ts`
  - 課程 1: 軟體設計模式精通之旅 (5個章節)
  - 課程 2: AI x BDD 規格驅動開發 (3個章節)
  - 每個課程包含: 章節、單元、影片、經驗值

### 3.3 排行榜資料
- [x] `lib/mock/leaderboard.ts`
  - 30 筆假用戶排行榜資料
  - 包含: 排名、用戶名、等級、經驗值、職業

### 3.4 進度資料
- [x] `lib/mock/progress.ts`
  - 課程觀看進度記錄
  - 單元完成狀態
  - 經驗值與等級資料

---

## Phase 4: 通用 UI 元件 🧩

### 4.1 基礎元件
- [x] `components/ui/Button.tsx` - 按鈕元件
- [x] `components/ui/Input.tsx` - 輸入框元件
- [x] `components/ui/Card.tsx` - 卡片元件
- [x] `components/ui/Badge.tsx` - 徽章元件
- [x] `components/ui/Avatar.tsx` - 頭像元件
- [x] `components/ui/Dropdown.tsx` - 下拉選單元件
- [x] `components/ui/Modal.tsx` - 彈窗元件
- [x] `components/ui/Toast.tsx` - 通知元件
- [x] `components/ui/ProgressBar.tsx` - 進度條元件
- [x] `components/ui/Tabs.tsx` - 分頁元件

### 4.2 表單元件
- [x] `components/ui/FormField.tsx` - 表單欄位容器
- [x] `components/ui/Checkbox.tsx` - 核取方塊
- [x] `components/ui/Select.tsx` - 選擇器

### 4.3 載入與狀態元件
- [x] `components/ui/Spinner.tsx` - 載入動畫
- [x] `components/ui/Skeleton.tsx` - 骨架屏
- [x] `components/ui/EmptyState.tsx` - 空狀態顯示

---

## Phase 5: Layout 佈局元件 🎨

### 5.1 導航元件
- [x] ⚠️ `components/layout/Navbar.tsx` - 頂部導航欄 **需要重構為左側垂直 Sidebar**
  - Logo 連結
  - 課程下拉選單
  - 通知鈴鐺 (僅外觀)
  - 用戶頭像下拉選單
- [x] ⚠️ `components/layout/Sidebar.tsx` - 側邊欄 **需要套用深色主題**
  - 課程章節導航
  - 單元列表 (影片、文章、測驗圖示)
  - 完成狀態標記 (○ / ✓)
- [x] `components/layout/MobileMenu.tsx` - 手機版漢堡選單（已整合在 Navbar）
- [ ] `components/layout/MobileDrawer.tsx` - 手機版側邊欄抽屜

### 5.2 佈局容器
- [x] `components/layout/MainLayout.tsx` - 主要佈局容器
- [ ] `components/layout/AuthLayout.tsx` - 認證頁面佈局
- [x] `components/layout/Footer.tsx` - 頁尾
  - 社群連結 (Line, Facebook, Discord, Youtube)
  - 隱私權政策、服務條款連結
  - 客服信箱

### 5.3 導航資料
- [x] `lib/navigation.ts` - 導航選單配置資料

---

## Phase 6: 課程相關元件 📚

### 6.1 課程卡片元件
- [x] ⚠️ `components/course/CourseCard.tsx` - 課程卡片 **需重新設計以符合目標網站**
  - 課程封面圖
  - 課程標題與描述
  - 作者資訊
  - 擁有狀態標記 **缺少**
  - CTA 按鈕 (試聽/購買) **缺少雙按鈕設計**

### 6.2 課程內容元件
- [x] `components/course/ChapterList.tsx` - 章節列表 (Accordion)
- [x] `components/course/LessonItem.tsx` - 單元項目
  - 單元圖示 (影片/文章/測驗)
  - 單元標題
  - 完成狀態 (○ 未交付 / ✓ 已交付)
  - 鎖定狀態 (付費課程)
- [x] `components/course/CourseHeader.tsx` - 課程資訊 Header
- [ ] `components/course/CourseCertificate.tsx` - 課程證書卡片 **缺少側邊欄證書設計**

### 6.3 影片播放元件
- [x] `components/course/VideoPlayer.tsx` - 影片播放器容器
  - YouTube IFrame 占位 (預留 API 整合)
  - 播放控制 UI (預留)
- [x] `components/course/VideoProgress.tsx` - 影片進度條
- [x] `components/course/LessonComplete.tsx` - 單元完成按鈕/小圈圈

### 6.4 付費鎖定元件
- [ ] `components/course/PaywallOverlay.tsx` - 付費內容鎖定遮罩
  - 鎖定圖示
  - 升級提示訊息
  - 升級 CTA 按鈕

---

## Phase 7: 排行榜元件 🏆

### 7.1 排行榜元件
- [x] ⚠️ `components/leaderboard/LeaderboardTable.tsx` - 排行榜表格 **需驗證設計符合目標**
- [x] ⚠️ `components/leaderboard/LeaderboardEntry.tsx` - 排行榜項目 **需驗證設計符合目標**
  - 排名顯示
  - 用戶頭像與名稱
  - 職業標籤
  - 等級與經驗值
- [x] `components/leaderboard/UserRankCard.tsx` - 當前用戶排名卡片 (底部固定)

---

## Phase 8: 用戶相關元件 👤

### 8.1 用戶資訊元件
- [x] `components/user/UserProfile.tsx` - 用戶個人檔案卡片
  - 頭像
  - 暱稱與職業
  - 等級與經驗值進度條
  - 等級計算邏輯
- [ ] `components/user/AccountBinding.tsx` - 帳號綁定卡片 **需實作完整 UI**
  - Discord 綁定狀態
  - GitHub 綁定狀態

### 8.2 登入元件
- [x] `components/auth/LoginForm.tsx` - 登入表單
  - Email 輸入框
  - Password 輸入框
  - 登入按鈕 (預留 OAuth)
  - 錯誤訊息顯示

---

## Phase 9: Context Providers 🔄

### 9.1 認證 Context
- [x] `contexts/AuthContext.tsx`
  - AuthProvider
  - useAuth hook
  - 登入/登出狀態管理 (localStorage token)
  - 用戶角色驗證

### 9.2 用戶 Context
- [x] `contexts/UserContext.tsx` (整合在 AuthContext)
  - UserProvider
  - useUser hook
  - 用戶資料管理
  - 等級與經驗值計算

### 9.3 課程 Context
- [x] `contexts/JourneyContext.tsx`
  - JourneyProvider
  - useJourney hook
  - 當前課程切換
  - 課程資料管理

---

## Phase 10: Custom Hooks 🎣

### 10.1 資料載入 Hooks
- [ ] `hooks/useJourneys.ts` - 課程列表資料
- [ ] `hooks/useJourney.ts` - 單一課程資料
- [ ] `hooks/useLesson.ts` - 單元資料
- [ ] `hooks/useLeaderboard.ts` - 排行榜資料

### 10.2 功能 Hooks
- [ ] `hooks/useProgress.ts` - 進度追蹤 (預留自動儲存邏輯)
- [ ] `hooks/useVideoPlayer.ts` - 影片播放器狀態
- [ ] `hooks/useLocalStorage.ts` - LocalStorage 操作
- [ ] `hooks/useMediaQuery.ts` - RWD 斷點偵測

---

## Phase 11: API Client 架構 🌐

### 11.1 API Client 基礎
- [ ] `lib/api/client.ts` - API Client 基礎設定
  - Fetch wrapper
  - 錯誤處理
  - Token 管理

### 11.2 API 端點 (預留接口)
- [ ] `lib/api/auth.ts` - 認證 API
  - login() - 預留
  - logout() - 預留
  - renewToken() - 預留
- [ ] `lib/api/journeys.ts` - 課程 API
  - getAll() - 預留
  - getById(id) - 預留
  - getBySlug(slug) - 預留
- [ ] `lib/api/lessons.ts` - 單元 API
  - getLesson(id) - 預留
  - updateProgress(id, progress) - 預留
  - deliverLesson(id) - 預留
- [ ] `lib/api/users.ts` - 用戶 API
  - getMe() - 預留
  - updateProfile() - 預留
- [ ] `lib/api/leaderboard.ts` - 排行榜 API
  - getLeaderboard() - 預留
  - getMyRank() - 預留

### 11.3 API 型別與文檔
- [ ] `lib/api/types.ts` - API 請求/回應型別
- [ ] `lib/api/README.md` - API 整合指南
  - 列出所有預留的 API 端點
  - 說明如何替換 mock 資料為真實 API

---

## Phase 12: 頁面實作 - 核心頁面 📄

### 12.1 首頁
- [ ] `app/page.tsx` - 首頁
  - 課程輪播/卡片區塊
  - 「歡迎來到水球軟體學院」文案
  - 水球潘介紹區塊
  - 社群與部落格連結
  - 技能評級系統介紹

### 12.2 登入頁
- [ ] `app/(auth)/sign-in/page.tsx` - 登入頁
  - LoginForm 元件
  - OAuth 按鈕占位 (Google, Facebook)

### 12.3 課程列表頁
- [ ] `app/(main)/courses/page.tsx` - 課程列表頁
  - CourseCard 網格佈局
  - 擁有狀態篩選
  - 訂單紀錄區塊 (假資料)

---

## Phase 13: 頁面實作 - 課程相關 📖

### 13.1 課程詳情頁
- [ ] `app/journeys/[journeySlug]/page.tsx` - 課程詳情頁 (所有單元)
  - CourseHeader
  - ChapterList (Accordion)
  - CourseCertificate 側欄
  - 課程資訊標籤 (中文、支援行動裝置、證書)

### 13.2 課程單元頁
- [ ] `app/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]/page.tsx` - 單元頁
  - VideoPlayer (YouTube 占位)
  - Sidebar (章節導航)
  - VideoProgress 進度條
  - LessonComplete 交付按鈕
  - PaywallOverlay (免費用戶視角)

### 13.3 其他課程頁面 (占位)
- [ ] `app/journeys/[journeySlug]/missions/page.tsx` - 獎勵任務 (即將推出)
- [ ] `app/journeys/[journeySlug]/roadmap/page.tsx` - 挑戰地圖 (即將推出)
- [ ] `app/journeys/[journeySlug]/sop/page.tsx` - SOP 寶典 (即將推出)

---

## Phase 14: 頁面實作 - 用戶相關 👥

### 14.1 排行榜頁
- [ ] `app/(main)/leaderboard/page.tsx` - 排行榜頁
  - Tabs (學習排行榜 / 本週成長榜)
  - LeaderboardTable (30筆假資料)
  - UserRankCard (底部固定)

### 14.2 個人檔案頁
- [ ] `app/(main)/users/me/profile/page.tsx` - 個人檔案頁
  - UserProfile 卡片
  - AccountBinding 卡片
  - 編輯功能 (UI only)

### 14.3 挑戰歷程頁
- [ ] `app/(main)/users/me/portfolio/page.tsx` - 挑戰歷程 (占位)
  - 「即將推出」訊息

---

## Phase 15: 全域樣式與主題 🎨

### 15.1 全域 CSS
- [ ] `styles/globals.css` - 全域樣式
  - Tailwind directives
  - 字體載入 (Inter, Noto Sans TC)
  - CSS Reset
  - 全域元素樣式

### 15.2 CSS 變數
- [ ] `styles/design-tokens.css` - CSS 變數
  - 根據 design-tokens.md 定義 CSS 變數
  - :root 顏色變數
  - 響應式字體大小

### 15.3 主題配置
- [ ] `app/layout.tsx` - Root Layout
  - HTML lang="zh-TW"
  - Metadata (title, description)
  - Google Fonts 載入
  - 全域樣式載入
  - Context Providers 包裝

---

## Phase 16: RWD 響應式實作 📱

### 16.1 斷點配置
- [ ] 驗證 Tailwind breakpoints 配置
  - Mobile: < 768px
  - Tablet: 768px - 1919px
  - Desktop: ≥ 1920px

### 16.2 Layout 響應式
- [ ] Navbar 響應式 (漢堡選單)
- [ ] Sidebar 響應式 (抽屜式側邊欄)
- [ ] Footer 響應式 (堆疊佈局)

### 16.3 元件響應式
- [ ] CourseCard 響應式網格
- [ ] VideoPlayer 響應式比例
- [ ] LeaderboardTable 響應式表格
- [ ] 所有頁面響應式測試

---

## Phase 17: 狀態管理整合 🔗

### 17.1 Context 整合
- [ ] 在 app/layout.tsx 整合所有 Providers
- [ ] 驗證 Context 資料流

### 17.2 Mock 資料整合
- [ ] 各頁面串接 mock 資料
- [ ] 驗證資料顯示正確

### 17.3 用戶角色切換
- [ ] 實作免費/付費用戶切換功能 (開發用)
- [ ] 驗證權限控制 UI 顯示

---

## Phase 18: 測試與除錯 🧪

### 18.1 功能測試
- [ ] 首頁載入測試
- [ ] 登入流程測試 (UI only)
- [ ] 課程瀏覽測試
- [ ] 影片播放器 UI 測試
- [ ] 排行榜顯示測試
- [ ] 個人檔案顯示測試

### 18.2 RWD 測試
- [ ] Mobile (375px, 414px) 測試
- [ ] Tablet (768px, 1024px) 測試
- [ ] Desktop (1920px, 2560px) 測試

### 18.3 瀏覽器測試
- [ ] Chrome 測試
- [ ] Firefox 測試
- [ ] Safari 測試
- [ ] Edge 測試

### 18.4 效能測試
- [ ] Lighthouse 分數檢查
- [ ] 載入速度優化

---

## Phase 19: 文檔與註解 📚

### 19.1 程式碼註解
- [ ] 為所有預留 API 接口添加 TODO 註解
- [ ] 為複雜邏輯添加說明註解
- [ ] 為 TypeScript 型別添加 JSDoc

### 19.2 README 文檔
- [ ] `frontend/README.md` - 專案說明
  - 專案介紹
  - 技術棧
  - 安裝與運行
  - 專案結構說明
  - API 整合指南
  - 開發注意事項

### 19.3 元件文檔
- [ ] 為關鍵元件撰寫使用範例
- [ ] 建立元件 Props 說明

---

## Phase 20: 部署準備 🚀

### 20.1 環境變數配置
- [ ] `.env.example` - 環境變數範本
  - NEXT_PUBLIC_API_BASE_URL
  - NEXT_PUBLIC_YOUTUBE_API_KEY (預留)

### 20.2 建構測試
- [ ] 執行 `npm run build` 測試
- [ ] 修正建構錯誤
- [ ] 驗證靜態資源正確載入

### 20.3 部署文檔
- [ ] 建立 Vercel 部署指南
- [ ] 建立環境變數設定說明

---

## Phase 21: 最終驗收 ✅

### 21.1 功能檢查
- [ ] 所有頁面可正常訪問
- [ ] 所有 UI 元件正常顯示
- [ ] RWD 在各尺寸正常運作
- [ ] Mock 資料正確顯示
- [ ] 用戶角色切換功能正常

### 21.2 程式碼品質
- [ ] ESLint 檢查通過
- [ ] TypeScript 編譯無錯誤
- [ ] 無 console.error 或 warning

### 21.3 文檔完整性
- [ ] README.md 完整
- [ ] API 整合指南完整
- [ ] 設計文檔完整
- [ ] 註解充足

### 21.4 與原網站對照
- [ ] UI 佈局符合原網站
- [ ] 顏色與字體符合設計規範
- [ ] 互動行為符合預期
- [ ] 響應式表現一致

---

## 開發注意事項

### 優先級
1. **核心功能優先**: 課程瀏覽、影片播放器、進度追蹤
2. **Layout 次之**: 導航欄、側邊欄、頁尾
3. **輔助頁面最後**: 排行榜、個人檔案、佔位頁面

### 開發原則
- **UI Only**: 本階段僅實作 UI，不實作後端邏輯
- **預留接口**: 所有 API 呼叫位置添加清楚的 TODO 註解
- **Mock 資料**: 使用假資料進行開發與測試
- **型別安全**: 確保所有資料都有完整的 TypeScript 型別定義
- **可維護性**: 元件拆分合理，程式碼清晰易讀

### 品質標準
- TypeScript 嚴格模式
- ESLint 規則遵循
- 元件可重用性
- 響應式設計完整
- 無障礙設計考量

---

## 預估時程

- **Phase 0-1**: 規劃與基礎架構 (1 天) ✅
- **Phase 2-3**: 型別與 Mock 資料 (1 天)
- **Phase 4-5**: 通用元件與 Layout (2 天)
- **Phase 6-8**: 專用元件 (2 天)
- **Phase 9-11**: Context 與 API (1 天)
- **Phase 12-14**: 頁面實作 (3 天)
- **Phase 15-16**: 樣式與 RWD (1 天)
- **Phase 17-21**: 整合、測試、文檔 (2 天)

**總計**: 約 13 天 (可依實際狀況調整)

---

---

## Phase 22: 設計系統對齊 ⚠️ **最高優先級**

> **重要**：經與目標網站 https://world.waterballsa.tw/ 比對後發現，當前實作的視覺設計與佈局結構與目標網站有重大差異，需要進行全面調整。

### 22.1 色彩方案修正 🎨
- [ ] 將所有頁面改為深色主題 (背景 #1A1D2E → #2D3142)
- [ ] 修正主色使用：金色 #FFD700 應用於重點元素（按鈕、標題、徽章）
- [ ] 更新文字顏色層級：主文字 #FFFFFF, 次要文字 #A0AEC0
- [ ] 更新所有 UI 元件的顏色變數引用
- [ ] 在 globals.css 中強制套用深色主題
- [ ] 移除淺色主題相關樣式

### 22.2 佈局架構重構 🏗️
- [ ] **關鍵**：將橫向 Navbar 重構為左側固定垂直 Sidebar
  - 深色背景 (#1A1D2E)
  - 垂直排列導航項目
  - Logo 置於頂部
  - 用戶資訊置於底部
- [ ] 新增頂部橫向工具列
  - 課程切換下拉選單 (JourneySwitcher)
  - 通知鈴鐺
  - 用戶頭像下拉選單
- [ ] 新增促銷橫幅組件 (3000元折價券)
- [ ] 調整 MainLayout 以支援新的佈局結構

### 22.3 字體與排版 📝
- [ ] 確認 Noto Sans TC 字體載入
- [ ] 更新中文字體權重設定 (Regular 400, Medium 500, Bold 700)
- [ ] 驗證所有標題大小符合目標網站
- [ ] 調整行高與字距以符合設計規範

---

## Phase 23: 缺少的元件實作 🆕

### 23.1 首頁專用元件
- [ ] `components/home/FounderProfile.tsx` - 創辦人水球潘介紹區塊
  - 大頭照
  - 個人簡介
  - 成就與認證展示
  - 社群媒體連結
- [ ] `components/home/FeatureCard.tsx` - 重新設計特色卡片
  - 符合目標網站的4個特色設計
  - 圖示 + 標題 + 描述
  - Hover 效果
- [ ] `components/home/FeaturedCourses.tsx` - 精選課程區塊
  - 僅顯示2個精選課程（軟體設計模式、AI x BDD）
  - 特殊卡片設計（不同於一般課程卡片）

### 23.2 課程相關新元件
- [ ] `components/course/JourneySwitcher.tsx` - 課程切換下拉選單
  - 顯示當前課程名稱
  - 下拉顯示所有擁有的課程
  - 快速切換功能
- [ ] `components/course/OwnershipBadge.tsx` - 擁有狀態徽章
  - "尚未擁有" 狀態（灰色）
  - "已擁有" 狀態（金色）
  - "付費專屬" 狀態（紫色）
- [ ] `components/course/CertificateCard.tsx` - 課程證書卡片
  - 右側邊欄展示
  - 證書預覽圖
  - 下載/分享功能預留
- [ ] `components/course/CourseInfoBadges.tsx` - 課程資訊徽章群組
  - 中文課程徽章
  - 支援行動裝置徽章
  - 專業完課認證徽章
- [ ] `components/course/ChapterAccordion.tsx` - 章節手風琴（副本設計）
  - "副本零"、"副本一" 命名風格
  - 可展開/收合
  - 顯示章節進度
  - 鎖定/解鎖狀態

### 23.3 購買與訂單元件
- [ ] `components/promotional/DiscountBanner.tsx` - 折價券橫幅
  - "你有一張 3,000 折價券" 提示
  - 黃色醒目設計
  - 點擊展開詳情
- [ ] `components/order/OrderHistory.tsx` - 訂單記錄表格
  - 訂單編號、日期、課程名稱
  - 付款狀態
  - 金額顯示
  - 查看詳情按鈕
- [ ] `components/order/OrderCard.tsx` - 單筆訂單卡片
  - 訂單摘要資訊
  - 課程縮圖
  - 訂單狀態標籤
- [ ] `components/purchase/PricingCard.tsx` - 課程定價卡片
  - 原價/優惠價顯示
  - 折扣百分比
  - 購買/試聽雙 CTA

### 23.4 用戶與帳號元件
- [ ] `components/user/AccountBinding.tsx` - 完整帳號綁定 UI
  - Discord 綁定狀態與按鈕
  - GitHub 綁定狀態與按鈕
  - LINE 帳號資訊
  - 綁定/解除綁定功能
- [ ] `components/user/SocialConnect.tsx` - 社群帳號管理
  - 連結各社群平台
  - 顯示綁定狀態
  - 權限說明

### 23.5 通知相關元件
- [ ] `components/notification/NotificationBell.tsx` - 通知鈴鐺
  - 未讀數量顯示
  - 點擊展開通知列表
  - 紅點提示
- [ ] `components/notification/NotificationList.tsx` - 通知清單
  - 通知項目列表
  - 已讀/未讀狀態
  - 通知類型圖示
  - 時間戳記

---

## Phase 24: 頁面重新設計與調整 ♻️

### 24.1 首頁全面改版
- [ ] 重新設計 Hero 區塊
  - 符合目標網站的「歡迎來到水球軟體學院」標題
  - 背景漸層效果
  - CTA 按鈕設計
- [ ] 精選課程區塊（僅2個課程）
  - 軟體設計模式精通之旅
  - AI x BDD 規格驅動開發
  - 使用特殊卡片設計
- [ ] 新增創辦人介紹區塊
  - 水球潘個人簡介
  - 教學理念
  - 成就展示
- [ ] 更新特色卡片內容
  - 4個核心特色
  - 符合目標網站文案
  - 圖示與排版

### 24.2 課程列表頁改版
- [ ] 課程卡片重新設計
  - 課程縮圖（16:9 比例）
  - 作者「水球潘」標註
  - 擁有狀態徽章（尚未擁有/已擁有）
  - 折價券提示橫幅
  - 雙 CTA 按鈕（試聽課程 + 立刻購買）
- [ ] 新增訂單記錄區塊
  - 位於課程列表下方
  - 顯示購買歷史
  - 訂單狀態篩選
- [ ] 移除/隱藏不必要的搜尋篩選 UI

### 24.3 課程詳情頁改版
- [ ] 左側導航欄重新設計
  - 深色主題
  - 章節列表（副本命名）
  - 當前章節高亮
- [ ] 主內容區調整
  - 課程標題與描述
  - 課程統計資訊（49部影片、大量實戰題）
  - 技能標籤展示
  - "立即加入課程" CTA
  - "預約 1v1 諮詢" CTA
- [ ] 右側邊欄證書區塊
  - 課程完課證書預覽
  - 證書圖片展示
  - 下載按鈕（預留）
- [ ] 課程資訊徽章
  - 中文課程
  - 支援行動裝置
  - 專業的完課認證

### 24.4 排行榜頁面優化
- [ ] 移除或重新設計篩選器 UI
  - 僅保留必要的篩選（學習/成長）
  - 簡化設計
- [ ] 調整 Tab 設計
  - "學習排行榜" / "本週成長榜"
  - 符合目標網站樣式
- [ ] 排行榜項目樣式調整
  - 排名數字樣式
  - 用戶資訊排版
  - 等級徽章設計
- [ ] 用戶排名卡片位置
  - 固定於底部
  - 懸浮效果

### 24.5 用戶個人資料頁
- [ ] 個人檔案 Tab 設計
  - 頭像編輯
  - 暱稱、職業編輯
  - 個人簡介編輯
- [ ] 帳號綁定 Tab
  - Discord、GitHub、LINE 綁定狀態
  - 綁定/解除按鈕
  - 隱私說明
- [ ] 設定 Tab
  - 通知偏好設定
  - 隱私設定
  - 語言設定

---

## Phase 25: 內容與文案更新 📝

### 25.1 文字內容對齊
- [ ] 首頁所有文案替換為目標網站確切文字
  - Hero 標題與副標題
  - 特色卡片描述
  - 創辦人簡介文字
- [ ] 課程名稱與描述更新
  - 確保與目標網站一致
  - 課程介紹文案
  - 章節命名（副本零、副本一...）
- [ ] 按鈕與 CTA 文字
  - "試聽課程" vs "立刻購買"
  - "立即加入課程"
  - "預約 1v1 諮詢"
- [ ] 系統訊息與提示文字
  - 成功/錯誤訊息
  - 表單驗證訊息
  - 載入提示文字

### 25.2 品牌素材整合
- [ ] Waterball 品牌 Logo
  - SVG 格式高清版本
  - 深色/淺色版本
- [ ] 課程縮圖圖片
  - 軟體設計模式精通之旅
  - AI x BDD 規格驅動開發
  - 其他課程縮圖
- [ ] 證書模板圖片
  - 完課證書設計稿
  - 不同課程的證書樣式
- [ ] 創辦人照片
  - 水球潘個人照
  - 高解析度版本
- [ ] 社群媒體圖示
  - LINE、Facebook、Discord、Youtube
  - 符合品牌色系的圖示設計

### 25.3 Mock 資料內容更新
- [ ] 更新課程 Mock 資料
  - 章節命名改為「副本」格式
  - 課程描述與目標網站一致
  - 作者統一為「水球潘」
- [ ] 更新用戶 Mock 資料
  - 更真實的中文姓名
  - 職業描述更細緻
- [ ] 新增訂單 Mock 資料
  - 訂單編號格式
  - 不同付款狀態
  - 真實的訂單時間

---

## Phase 26: 響應式設計修正 📱

### 26.1 行動版佈局調整
- [ ] 左側邊欄改為抽屜式設計
  - 預設隱藏
  - 漢堡選單觸發
  - 滑入/滑出動畫
- [ ] 頂部工具列行動版優化
  - 課程切換器簡化顯示
  - 通知與用戶選單整合
- [ ] 促銷橫幅響應式設計
  - 行動版文字簡化
  - 可收合設計

### 26.2 觸控優化
- [ ] 增大觸控目標（最小 44x44px）
- [ ] 手勢支援（滑動切換課程等）
- [ ] 避免 Hover 效果影響觸控體驗
- [ ] 下拉選單改為觸控友善設計

### 26.3 斷點驗證
- [ ] Mobile (< 768px) 完整測試
- [ ] Tablet (768px - 1919px) 完整測試
- [ ] Desktop (≥ 1920px) 完整測試
- [ ] 極大螢幕 (> 2560px) 最大寬度限制

---

## Phase 27: 功能補完與優化 ✨

### 27.1 購買流程 UI（預留 R2 整合）
- [ ] 課程購買 Modal
  - 課程資訊展示
  - 價格與優惠資訊
  - 付款方式選擇 UI（預留）
  - 折價券輸入
  - 確認購買按鈕
- [ ] 訂單確認頁面
  - 訂單摘要
  - 付款資訊
  - 下一步指引
- [ ] 1v1 諮詢預約表單
  - 時間選擇
  - 諮詢主題選擇
  - 聯絡方式輸入

### 27.2 通知系統
- [ ] 通知鈴鐺功能
  - 未讀數量即時更新（預留 WebSocket）
  - 點擊展開通知列表
  - 標記已讀功能
- [ ] 通知列表頁面
  - 所有通知歷史
  - 篩選與排序
  - 批次操作（全部已讀）
- [ ] Toast 通知整合
  - 系統重要通知
  - 操作成功/失敗提示
  - 自動消失時間設定

### 27.3 設定頁面完整實作
- [ ] 個人資料編輯
  - 表單驗證
  - 頭像上傳（預留）
  - 即時儲存提示
- [ ] 通知偏好設定
  - Email 通知開關
  - 瀏覽器推播開關
  - 通知類型選擇
- [ ] 帳號安全設定
  - 密碼修改（預留）
  - 登入歷史查看
  - 兩步驟驗證（預留）

### 27.4 效能與體驗優化
- [ ] 圖片懶載入優化
- [ ] 路由預載入設定
- [ ] 骨架屏載入狀態
- [ ] 錯誤邊界處理
- [ ] 無障礙 (A11y) 檢查
  - 鍵盤導航支援
  - ARIA 標籤完整性
  - 對比度符合 WCAG 標準

---

## 預估時程（更新）

- **Phase 0-1**: 規劃與基礎架構 (1 天) ✅
- **Phase 2-3**: 型別與 Mock 資料 (1 天) ✅
- **Phase 4-5**: 通用元件與 Layout (2 天) ✅
- **Phase 6-8**: 專用元件 (2 天) ⚠️ **需重新設計**
- **Phase 9-11**: Context 與 API (1 天) ✅
- **Phase 12-14**: 頁面實作 (3 天) ⚠️ **需調整**
- **Phase 15-16**: 樣式與 RWD (1 天) ❌ **未完成**
- **Phase 17-21**: 整合、測試、文檔 (2 天) ❌ **未完成**
- **Phase 22**: 設計系統對齊 (2-3 天) 🆕 **最高優先級**
- **Phase 23**: 缺少元件實作 (3-4 天) 🆕
- **Phase 24**: 頁面重新設計 (3-4 天) 🆕
- **Phase 25**: 內容與品牌 (1-2 天) 🆕
- **Phase 26**: 響應式修正 (1-2 天) 🆕
- **Phase 27**: 功能補完 (2-3 天) 🆕

**新總計**: 約 25-30 天（已完成約 40%，剩餘 15-18 天）

---

## 更新紀錄

- 2025-11-19: 建立 TODO 文件，完成 Phase 0-1
- 2025-11-22: 與目標網站比對後大幅更新
  - 標記 Phase 2-5, 9-10 為已完成
  - 為 Phase 6-8 添加設計警告標記
  - 新增 Phase 22-27（設計對齊、缺少元件、頁面重設計）
  - 更新預估時程：從 13 天調整為 25-30 天
