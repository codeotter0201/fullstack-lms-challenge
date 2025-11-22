# Waterball LMS Frontend

> **Release 1 (MVP)** - 完整的 UI 實作，使用 Mock 資料

Waterball 學院前端專案 - 基於 Next.js 14 + TypeScript + Tailwind CSS 打造的現代化學習管理系統。

---

## 🚀 快速開始

### 前置需求

- **Node.js**: >= 18.x
- **npm**: >= 9.x

### 安裝與執行

```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 瀏覽器訪問
# http://localhost:3000
```

### 測試帳號登入

訪問 `/sign-in` 頁面，點擊「使用測試帳號登入」即可體驗完整功能。

### 其他指令

```bash
# 建置 Production
npm run build

# 啟動 Production Server
npm start

# 型別檢查
npm run type-check

# Linting
npm run lint
```

---

## 📦 專案結構

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根佈局
│   ├── page.tsx           # 首頁
│   ├── sign-in/           # 登入頁
│   ├── courses/           # 課程列表
│   ├── journeys/          # 課程詳情
│   ├── leaderboard/       # 排行榜
│   └── users/             # 用戶相關
│
├── components/            # React 元件
│   ├── ui/               # UI 元件 (Button, Card, etc.)
│   ├── layout/           # 佈局元件 (Navbar, Footer, etc.)
│   ├── course/           # 課程元件
│   ├── leaderboard/      # 排行榜元件
│   └── user/             # 用戶元件
│
├── contexts/             # React Context (狀態管理)
│   ├── AuthContext.tsx
│   ├── JourneyContext.tsx
│   ├── LeaderboardContext.tsx
│   └── ToastContext.tsx
│
├── hooks/                # Custom React Hooks
├── lib/                  # 工具與設定
│   ├── api/             # API Client
│   ├── mock/            # Mock 資料
│   └── utils.ts         # 工具函數
│
├── types/                # TypeScript 型別定義
└── docs/                 # 專案文檔
```

---

## 🎯 功能特色

### Release 1 (當前版本)

#### ✅ 認證系統
- 測試帳號登入
- LINE Login UI (R2 整合)
- localStorage 狀態持久化

#### ✅ 課程系統
- 課程列表與搜尋
- 課程詳情頁
- 章節與單元管理
- 影片播放器
- 進度追蹤
- 單元繳交

#### ✅ 排行榜系統
- 全球/週/月排行榜
- 前三名領獎台
- 搜尋與篩選
- 當前用戶排名

#### ✅ 用戶系統
- 個人檔案
- 學習統計
- 等級與經驗值
- Premium 會員標記

#### ✅ 響應式設計
- Mobile (<768px)
- Tablet (768-1919px)
- Desktop (≥1920px)

---

## 🛠️ 技術棧

### 核心框架

- **Next.js 14** - React 框架 (App Router)
- **TypeScript 5.x** - 類型安全
- **React 18** - UI 函式庫
- **Tailwind CSS 3.x** - CSS 框架

### 狀態管理

- **React Context API** - 全域狀態管理
- **localStorage** - 資料持久化

### UI 元件

- **Lucide React** - 圖標系統
- **自訂元件庫** - 40 個可重用元件

### 開發工具

- **ESLint** - 代碼檢查
- **TypeScript** - 型別檢查

---

## 📱 頁面清單

| 頁面 | 路徑 | 說明 |
|-----|------|------|
| 首頁 | `/` | Hero、特色、精選課程 |
| 登入頁 | `/sign-in` | LINE Login + 測試登入 |
| 課程列表 | `/courses` | 所有課程 + 搜尋 |
| 課程詳情 | `/journeys/[id]` | 章節列表、進度卡片 |
| 單元頁面 | `/journeys/[id]/chapters/[id]/missions/[id]` | 影片播放、進度追蹤 |
| 排行榜 | `/leaderboard` | 全球排名、篩選 |
| 個人檔案 | `/users/me/profile` | 個人資訊、統計 |

---

## 🎨 設計系統

### 色彩

```css
/* 主色調 */
--color-primary-500: #3b82f6    /* 藍色 */

/* 狀態色 */
--color-success: #10b981         /* 綠色 */
--color-warning: #f59e0b         /* 橙色 */
--color-danger: #ef4444          /* 紅色 */
--color-info: #06b6d4            /* 青色 */

/* 中性色 */
--color-gray-50 to 900           /* 灰階 */
```

### 字體

- **主要**: Inter
- **標題**: Inter
- **程式碼**: JetBrains Mono

### 斷點

- **Mobile**: < 768px
- **Tablet**: 768px - 1919px
- **Desktop**: ≥ 1920px

---

## 🔌 API 整合

### R1 (當前) - Mock 資料

所有 API 目前使用 Mock 資料：

```typescript
// 範例: 登入 API (Mock)
export async function login(lineToken: string) {
  await delay(500)
  return {
    success: true,
    data: {
      user: mockUser,
      accessToken: 'mock-token-' + Date.now()
    }
  }
}
```

### R2 (準備中) - 真實 API

所有 API 端點已預留 R2 註解：

```typescript
// R2 TODO: 實作真實 API
export async function login(lineToken: string) {
  return apiClient.post<LoginResponse>('/auth/line', {
    token: lineToken
  })
}
```

### API 模組

- `auth.ts` - 認證 API
- `journeys.ts` - 課程 API
- `lessons.ts` - 單元 API
- `users.ts` - 用戶 API
- `leaderboard.ts` - 排行榜 API

詳細文檔: [`lib/api/README.md`](lib/api/README.md)

---

## 📊 狀態管理

### Context 架構

```
ToastProvider (全域通知)
  └── AuthProvider (認證)
      └── JourneyProvider (課程)
          └── LeaderboardProvider (排行榜)
              └── App
```

### 使用範例

```typescript
// 認證
const { user, isAuthenticated, login, logout } = useAuth()

// 課程
const { journeys, loadJourneys, updateProgress } = useJourney()

// 排行榜
const { entries, topThree, userRank } = useLeaderboard()

// 通知
const { success, error } = useToast()
```

詳細文檔: [`docs/STATE-MANAGEMENT.md`](../docs/STATE-MANAGEMENT.md)

---

## 🧩 元件庫

### UI 元件 (10 個)

- Button, Card, Badge, Avatar
- Input, Spinner, Modal, Dropdown
- Tabs, EmptyState

### Layout 元件 (7 個)

- MainLayout, Navbar, Footer
- Container, Section, Logo
- Breadcrumb, PageHeader

### 專業元件 (23 個)

- **Course**: CourseCard, ChapterList, VideoPlayer...
- **Leaderboard**: LeaderboardTable, TopRankers...
- **User**: UserProfile, UserStats, ExpBar...

詳細文檔: [`docs/component-library-guide.md`](../docs/component-library-guide.md)

---

## 🧪 測試

### 手動測試

完整的測試檢查清單:

```bash
# 開啟測試文檔
open docs/TESTING.md
```

包含 400+ 測試項目:
- ✅ 功能測試 (7 個主要功能)
- ✅ RWD 測試 (3 種裝置)
- ✅ 瀏覽器兼容性
- ✅ 效能測試

### R2 自動化測試 (計畫)

- Jest - 單元測試
- React Testing Library - 元件測試
- Cypress/Playwright - E2E 測試

---

## 📚 文檔

### 核心文檔

| 文檔 | 說明 |
|-----|------|
| [Component Library](../docs/component-library-guide.md) | 40 個元件完整文檔 |
| [State Management](../docs/STATE-MANAGEMENT.md) | Context 狀態管理 |
| [API Client](lib/api/README.md) | API 整合指南 |
| [Testing](../docs/TESTING.md) | 測試檢查清單 |
| [RWD Guide](../docs/RWD-GUIDE.md) | 響應式設計指南 |
| [Release 1 Summary](../docs/RELEASE-1-SUMMARY.md) | R1 完整總結 |

### 設計文檔

| 文檔 | 說明 |
|-----|------|
| [Component Specs](../docs/component-specs.md) | 元件規格 |
| [Design Tokens](../docs/design-tokens.md) | 設計 Token |
| [Page Specifications](../docs/page-specifications.md) | 頁面規格 |

---

## 🔐 環境變數

### R1 (當前)

R1 不需要環境變數，所有資料使用 Mock。

### R2 (準備)

```bash
# .env.local (範例)

# API Base URL
NEXT_PUBLIC_API_URL=https://api.waterballsa.tw

# LINE Login
NEXT_PUBLIC_LINE_CLIENT_ID=your_client_id
LINE_CLIENT_SECRET=your_client_secret

# 其他設定
NEXT_PUBLIC_ENV=production
```

---

## 🚀 部署

### Vercel (推薦)

```bash
# 安裝 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### 其他平台

- **Netlify**: 支援 Next.js
- **AWS Amplify**: 支援 SSR
- **Self-hosted**: 使用 `npm run build && npm start`

---

## 🔧 故障排除

### 常見問題

**Q: 編譯警告 "Attempted import error"**
- A: 這些是 R1 Mock 資料的型別警告，不影響運作

**Q: 頁面空白**
- A: 檢查 localStorage 是否被禁用，R1 需要 localStorage

**Q: 登入後沒反應**
- A: 清除 localStorage 並重新登入

**Q: 圖片無法顯示**
- A: R1 使用 placeholder 圖片，確保網路連接正常

### 重置應用狀態

```javascript
// 在瀏覽器 Console 執行
localStorage.clear()
location.reload()
```

---

## 📈 專案統計

### 代碼統計 (Release 1)

- **總檔案數**: 100+ 個
- **代碼行數**: 10,000+ 行
- **元件數量**: 40 個
- **頁面數量**: 9 個
- **Context 數量**: 4 個
- **Hooks 數量**: 8 個
- **文檔頁數**: 11 份

### 完成度

- **Phase 完成**: 17/20 (85%)
- **核心功能**: 100%
- **UI 實作**: 100%
- **文檔完整度**: 95%

---

## 🗺️ Roadmap

### Release 2 (計畫中)

#### 必須項目

- [ ] LINE Login 整合
- [ ] 後端 API 整合
- [ ] JWT 認證機制
- [ ] 圖片上傳功能
- [ ] 即時同步 (WebSocket)

#### 增強項目

- [ ] 搜尋優化 (後端)
- [ ] 瀏覽器推播通知
- [ ] 留言系統
- [ ] 討論區
- [ ] 成就系統

### Release 3+ (未來)

- [ ] 道館系統
- [ ] 任務系統
- [ ] 社群功能
- [ ] 直播功能
- [ ] 手機 App

---

## 🤝 貢獻

目前為內部專案，暫不開放外部貢獻。

---

## 📄 授權

Copyright © 2025 Waterball Academy. All rights reserved.

---

## 📞 聯絡資訊

- **專案**: Waterball LMS Frontend
- **Release**: R1 (MVP)
- **狀態**: 開發完成，準備測試

---

## 🙏 致謝

- **Next.js Team** - 優秀的 React 框架
- **Tailwind CSS** - 強大的 CSS 框架
- **Lucide Icons** - 美觀的圖標庫

---

**🎉 Built with ❤️ by Waterball Academy Team**

---

## 📝 更新日誌

### v1.0.0 (2025-01-22)

- ✅ 完成所有核心功能
- ✅ 完成 40 個元件
- ✅ 完成 9 個頁面
- ✅ 完成響應式設計
- ✅ 完成狀態管理
- ✅ 完成完整文檔
- ✅ TypeScript 編譯無錯誤
- ✅ Production Build 成功

**Release 1 MVP - 準備交付！** 🚀
