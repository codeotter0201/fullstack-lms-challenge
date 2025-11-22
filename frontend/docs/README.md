# 前端文檔

水球軟體學院 LMS 前端開發文檔

**目標網站**: https://world.waterballsa.tw/
**技術棧**: Next.js 14 + TypeScript + Tailwind CSS

---

## 🚀 快速開始

### 新成員入門
1. 閱讀 [`design-requirements.md`](design-requirements.md) - 了解目標設計規格
2. 閱讀 [`component-library-guide.md`](component-library-guide.md) - 元件庫使用指南
3. 閱讀 [`STATE-MANAGEMENT.md`](STATE-MANAGEMENT.md) - 狀態管理架構

### 開發人員必讀
- [`design-requirements.md`](design-requirements.md) - **設計規格需求**
- [`missing-components.md`](missing-components.md) - **未實作元件清單**
- [`component-library-guide.md`](component-library-guide.md) - 元件庫使用指南
- [`api-integration-plan.md`](api-integration-plan.md) - API 整合計畫

---

## 📂 文檔導覽

### 🎨 設計規範
| 文檔 | 說明 |
|------|------|
| [`design-requirements.md`](design-requirements.md) | **設計規格需求** - 色彩方案、佈局架構、字體排版、互動設計 |
| [`design-tokens.md`](design-tokens.md) | 設計 Token - 顏色、字體、間距變數定義 |
| [`missing-components.md`](missing-components.md) | **未實作元件清單** - 需實作元件的詳細規格 |
| [`component-library-guide.md`](component-library-guide.md) | 元件庫使用指南 - 現有元件的使用方式與 Props |
| [`page-specifications.md`](page-specifications.md) | 頁面規格定義 - 各頁面的結構與內容規格 |

### 🔧 技術文檔
| 文檔 | 說明 |
|------|------|
| [`api-integration-plan.md`](api-integration-plan.md) | API 整合計畫 - Mock 資料與未來 API 整合指南 |
| [`STATE-MANAGEMENT.md`](STATE-MANAGEMENT.md) | 狀態管理架構 - Context 與 Hooks 使用說明 |
| [`RWD-GUIDE.md`](RWD-GUIDE.md) | 響應式設計指南 - 斷點、佈局、元件響應式實作 |
| [`testing-checklist.md`](testing-checklist.md) | 測試檢查清單 - 功能、RWD、瀏覽器測試清單 |

### 📦 歷史文檔
| 目錄 | 說明 |
|------|------|
| [`archive/`](archive/) | 歷史文檔存檔（分析報告、階段性計畫等） |

---

## 🎯 系統架構

### 技術架構
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript (嚴格模式)
- **樣式**: Tailwind CSS
- **狀態管理**: React Context + Custom Hooks
- **資料來源**: Mock Data (lib/mock/)

### 已實作功能
- ✅ 認證系統 (AuthContext + localStorage)
- ✅ 課程瀏覽與詳情頁
- ✅ 用戶個人檔案
- ✅ 排行榜系統
- ✅ 響應式導航
- ✅ Toast 通知系統

### 元件庫
- 40+ UI 元件 (詳見 `component-library-guide.md`)
- 佈局元件 (Navbar, Footer, Sidebar)
- 課程元件 (CourseCard, JourneyHero, MissionList)
- 用戶元件 (UserProfile, UserStats, UserCourseList)

---

## 📖 使用指南

### 開始新功能開發
1. 查看 [`design-requirements.md`](design-requirements.md) → 了解設計規格
2. 查看 [`missing-components.md`](missing-components.md) → 確認需要開發的元件詳細規格
3. 參考 [`component-library-guide.md`](component-library-guide.md) → 使用現有元件
4. 參考 [`STATE-MANAGEMENT.md`](STATE-MANAGEMENT.md) → 了解狀態管理模式

### 實作元件
1. 參考 [`design-requirements.md`](design-requirements.md) → 色彩、佈局、字體規範
2. 參考 [`design-tokens.md`](design-tokens.md) → 使用統一的設計 Token
3. 參考 [`component-library-guide.md`](component-library-guide.md) → 了解現有元件
4. 參考 [`RWD-GUIDE.md`](RWD-GUIDE.md) → 實作響應式設計

### API 整合（R2）
1. 參考 [`api-integration-plan.md`](api-integration-plan.md) → 了解 API 端點與整合方式
2. 參考 [`STATE-MANAGEMENT.md`](STATE-MANAGEMENT.md) → 了解狀態管理架構

### 測試
1. 使用 [`testing-checklist.md`](testing-checklist.md) → 完整的測試檢查清單

### 追蹤進度
1. 查看 [`current-status.md`](current-status.md) → 當前完成度與已完成項目
2. 更新 [`next-steps.md`](next-steps.md) 中的核取方塊

---

## 🎓 關鍵概念

### 設計系統
- **深色主題**: 背景 #1A1D2E，卡片 #2D3142
- **主色**: 金色 #FFD700（按鈕、標題、強調）
- **佈局**: 左側垂直 Sidebar（240px）+ 頂部工具列（64px）

### 技術架構
- **Next.js 14**: App Router
- **TypeScript**: 完整型別定義（7 個型別檔案）
- **Tailwind CSS**: 自訂主題配置
- **狀態管理**: Context API（4 個 Context）

### 元件庫
- **41 個現有元件**: 基礎、佈局、課程、排行榜、用戶
- **20+ 個待實作**: 詳見 [`missing-components.md`](missing-components.md)

### Mock 資料驅動
- **R1 階段**: 使用 Mock 資料（當前）
- **R2 階段**: 整合真實 API（未來）

---

## 🔄 文檔維護

### 維護原則
1. **最新狀態優先** - 只保留當前狀態與未來計畫，不記錄歷史
2. **單一事實來源** - 每個主題只有一份權威文檔
3. **及時更新** - 完成任務後立即更新相關文檔
4. **交叉引用** - 避免內容重複，善用文檔間連結

### 更新頻率
- `current-status.md` - 每週更新或重大進展時更新
- `next-steps.md` - 每完成一個 Phase 更新核取方塊
- `design-requirements.md` - 發現設計規格變更時更新
- `missing-components.md` - 完成元件時移除該項目

### 歸檔規則
過時或被取代的文檔移至 `archive/`，不刪除，保留歷史參考。

---

**維護者**: Claude Code
**建立日期**: 2025-11-22
