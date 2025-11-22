# 前端開發計畫

**最後更新**: 2025-11-22
**當前完成度**: 45%（與目標網站相似度）
**參考文檔**: [`UI-COMPARISON-REPORT.md`](../UI-COMPARISON-REPORT.md)

---

## 🎯 開發狀態

基於與目標網站 (https://world.waterballsa.tw/) 的詳細 UI 比較，當前相似度為 **45%**。

### 已完成項目 ✅

**技術架構**（95%）:
- ✅ Next.js 14 App Router
- ✅ TypeScript 型別系統完整
- ✅ Tailwind CSS 配置
- ✅ 63 個 UI 元件
- ✅ 5 個 Context Providers
- ✅ 8 個 Custom Hooks
- ✅ Mock 資料系統
- ✅ 響應式設計基礎

### 需要修復的關鍵差異 ❌

**佈局架構差異**（60%）:
- ❌ 存在額外的獨立頂部 Navbar（目標網站無此設計）
- ❌ Sidebar 導航結構不符（扁平列表 vs 分組顯示）
- ⚠️ Sidebar 寬度：240px vs 230px
- ⚠️ Sidebar 背景色：#2D3142 vs #171923

**色彩系統差異**（40%）:
- ❌ 缺乏統一金色主題（#FFD700）
- ❌ 按鈕顏色不一致（多種顏色 vs 統一金色）
- ⚠️ 背景色：#1A1D2E vs #171923

**組件設計差異**（30%）:
- ❌ 課程卡片設計完全不符（資訊展示型 vs 視覺衝擊型）
- ❌ 按鈕樣式不統一（圓角 8px vs 6px，字重不一致）
- ❌ 缺少黃色邊框設計
- ❌ 缺少黃色優惠區塊

---

## 📋 修復計劃（15-20 小時）

### 🔴 第一階段：核心架構修復（6-9 小時）

#### 1. 移除獨立頂部 Navbar（3-4 小時）

**目標**：將頂部功能區整合到主內容區

**檔案修改**：
- `components/layout/MainLayout.tsx` - 移除 TopBar 元件使用
- `components/layout/TopBar.tsx` - 標記為棄用或移除
- `app/page.tsx` 及其他頁面 - 在頁面頂部加入選課下拉 + 登入按鈕

**具體步驟**：
```tsx
// 在每個頁面頂部加入
<div className="flex justify-between items-center mb-6">
  <JourneySwitcher /> {/* 左側 */}
  <Button variant="primary">登入</Button> {/* 右側 */}
</div>
```

**驗證**：
- ✅ 沒有獨立的 sticky header
- ✅ 選課下拉和登入按鈕在主內容區頂部
- ✅ 通知、設定圖標已移除（除非目標網站有）

---

#### 2. 調整 Sidebar 設計（2-3 小時）

**目標**：符合目標網站的 Sidebar 規格

**檔案修改**：
- `components/layout/VerticalSidebar.tsx`
- `app/globals.css`（調整 Sidebar 相關樣式）

**具體修改**：

**尺寸與色彩**：
```tsx
// VerticalSidebar.tsx
<aside className="
  fixed left-0 top-0 bottom-0
  w-[230px]              // 從 240px 改為 230px
  bg-[#171923]           // 從 #2D3142 改為 #171923
  p-[15px]               // 內部 padding 15px
">
```

**導航結構**（分組顯示）：
```tsx
<nav>
  {/* 主導航組 */}
  <div className="mb-4">
    <NavItem icon={Home} label="首頁" />
    <NavItem icon={Book} label="課程" />
  </div>

  {/* 排行榜組 */}
  <div className="mb-4">
    <NavItem icon={Trophy} label="排行榜" />
  </div>

  {/* 旅程相關組 */}
  <div>
    <NavItem icon={List} label="所有單元" />
    <NavItem icon={Map} label="挑戰地圖" />
    <NavItem icon={Book} label="SOP 寶典" />
  </div>
</nav>
```

**高亮樣式**：
```tsx
// 選中狀態
className="
  bg-primary              // 金色背景 #FFD700
  text-[rgb(23,25,35)]    // 深色文字
  rounded-md              // 圓角
  px-3 py-2
"
```

**驗證**：
- ✅ 寬度 230px
- ✅ 背景色 #171923
- ✅ 導航項目分組顯示
- ✅ 選中項目金色背景
- ✅ 內部 padding 15px

---

#### 3. 統一金色主題（2-3 小時）

**目標**：所有按鈕和 CTA 元素使用統一金色

**檔案修改**：
- `app/globals.css` - 更新 CSS 變數
- `tailwind.config.ts` - 更新主色配置
- `components/ui/Button.tsx` - 更新按鈕樣式

**CSS 變數更新**：
```css
/* app/globals.css */
:root {
  --background: #171923;           /* 從 #1A1D2E 改為 #171923 */
  --background-secondary: #2D3142;
  --primary: #FFD700;
  --primary-hover: #E6C200;
  --button-text: rgb(23, 25, 35);
  --text-primary: #F3F4F6;
  --text-secondary: #A0AEC0;
}
```

**Tailwind 配置**：
```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#FFD700',
      'primary-hover': '#E6C200',
      background: '#171923',
      // ...
    }
  }
}
```

**按鈕元件**：
```tsx
// Button.tsx - Primary variant
variant === 'primary' && `
  bg-primary
  text-[rgb(23,25,35)]
  hover:bg-primary-hover
  rounded-md              // 6px 圓角
  font-medium             // 字重 500
`
```

**全局搜尋替換**：
- 搜尋所有 `bg-blue-` → 改為 `bg-primary`
- 搜尋所有 `bg-green-` → 改為 `bg-primary`（如果是主要 CTA）
- 搜尋所有 `rounded-lg` → 改為 `rounded-md`（6px）
- 搜尋所有 `font-semibold`（按鈕） → 改為 `font-medium`

**驗證**：
- ✅ 所有主要按鈕金色背景 + 深色文字
- ✅ Sidebar 高亮項目金色背景
- ✅ 按鈕圓角 6px
- ✅ 按鈕字重 500（medium）
- ✅ 背景色 #171923

---

### 🔴 第二階段：課程卡片重構（4-5 小時）

#### 4. 重構課程卡片設計（4-5 小時）

**目標**：完全符合目標網站的課程卡片設計

**檔案修改**：
- `components/course/CourseCard.tsx`
- 創建新的課程卡片樣式（或重構現有）

**首頁課程卡片**：
```tsx
<div className="
  border-2 border-primary     // 整體黃色邊框
  rounded-md                  // 6px 圓角
  overflow-hidden
  hover:shadow-xl
  transition-all duration-300
">
  {/* 課程封面 - 大圖，16:9 */}
  <div className="relative aspect-video border-t-4 border-primary">
    <Image src={course.coverImage} fill alt={course.title} />
  </div>

  {/* 內容區 */}
  <div className="p-4">
    <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
    <p className="text-primary text-sm mb-2">{course.instructor}</p>
    <p className="text-sm text-secondary line-clamp-2 mb-4">
      {course.description}
    </p>

    {/* 底部優惠區 + CTA */}
    <div className="flex items-center gap-3">
      {/* 優惠訊息 */}
      <div className="bg-primary text-[rgb(23,25,35)] px-3 py-2 rounded-md text-sm font-medium flex-1">
        限時優惠 NT$ {course.price}
      </div>
      {/* CTA 按鈕 */}
      <Button variant="primary" size="md">
        立刻體驗
      </Button>
    </div>
  </div>
</div>
```

**課程頁課程卡片**：
```tsx
<div className="
  border-2 border-primary
  rounded-md
  overflow-hidden
  p-4
">
  {/* 課程封面 */}
  <div className="relative aspect-video border-t-4 border-primary mb-4">
    <Image src={course.coverImage} fill alt={course.title} />
  </div>

  {/* 課程資訊 */}
  <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
  <p className="text-primary text-sm mb-2">{course.instructor}</p>
  <OwnershipBadge status={course.ownershipStatus} />

  <p className="text-sm text-secondary mb-4">{course.description}</p>

  {/* 優惠區塊 */}
  {course.discount && (
    <div className="bg-primary text-[rgb(23,25,35)] p-3 rounded-md mb-4">
      {course.discount.message}
    </div>
  )}

  {/* 雙 CTA 按鈕 */}
  <div className="flex gap-3">
    <Button variant="primary" className="flex-1">試聽課程</Button>
    <Button variant="primary" className="flex-1">立刻購買</Button>
  </div>
</div>
```

**關鍵修改點**：
- ✅ 整體黃色邊框（`border-2 border-primary`）
- ✅ 大圖封面（`aspect-video`），不是小圖標
- ✅ 講師名稱金色（`text-primary`）
- ✅ 優惠區塊金色背景（`bg-primary`）
- ✅ 雙按鈕均為金色
- ❌ 移除白色卡片背景
- ❌ 移除學員數、評分等統計資訊（首頁卡片）

**驗證**：
- ✅ 卡片有黃色邊框
- ✅ 封面圖片是大圖（16:9 比例）
- ✅ 底部有黃色優惠區塊
- ✅ 按鈕統一金色
- ✅ 視覺風格符合目標網站

---

### 🟡 第三階段：細節優化（3-4 小時）

#### 5. 統一按鈕設計系統（2 小時）

**全局按鈕檢查**：
- 搜尋所有 `<Button` 使用
- 確保主要 CTA 使用 `variant="primary"`
- 確保樣式一致（圓角 6px，字重 500）

**Button 元件優化**：
```tsx
// 確保 Primary 按鈕樣式
const primaryStyles = `
  bg-primary
  text-[rgb(23,25,35)]
  hover:bg-primary-hover
  rounded-md
  px-4 py-2
  font-medium
  transition-colors duration-200
`
```

---

#### 6. 調整字體樣式（1-2 小時）

**字體權重檢查**：
- 按鈕：確保使用 `font-medium`（500）
- H1：確保使用 `font-bold`（700）
- H2, H3：確保使用 `font-semibold`（600）

**字體家族檢查**：
- 確保全局使用 `Inter` + `Noto Sans TC`

---

### 🟢 第四階段：最終驗證（1-2 小時）

#### 7. 全面測試與調整（1-2 小時）

**測試檢查清單**：
- [ ] 首頁與目標網站對比（截圖比較）
- [ ] 課程列表頁對比
- [ ] 課程詳情頁對比
- [ ] Sidebar 導航結構正確
- [ ] 所有按鈕統一金色
- [ ] 課程卡片黃色邊框
- [ ] 無獨立頂部 Navbar
- [ ] 響應式設計正常（Mobile、Tablet、Desktop）

**工具**：
- 使用 Playwright 截圖對比
- Chrome DevTools 測量尺寸
- 色彩選擇器驗證顏色

---

## 📊 完成度評估

### 修復前（當前）
- 佈局架構：60%
- 色彩系統：40%
- 組件設計：30%
- 字體排版：70%
- **整體：45%**

### 修復後（預期）
- 佈局架構：95%（移除 Navbar + 調整 Sidebar）
- 色彩系統：95%（統一金色主題）
- 組件設計：90%（重構課程卡片 + 統一按鈕）
- 字體排版：85%（調整字重）
- **整體：90%+**

---

## 🗓️ 時間規劃

### 建議工作分配（3 個工作日）

**Day 1**（6-8 小時）:
- ✅ 移除獨立頂部 Navbar（3-4 小時）
- ✅ 調整 Sidebar 設計（2-3 小時）

**Day 2**（5-6 小時）:
- ✅ 統一金色主題（2-3 小時）
- ✅ 重構課程卡片設計（開始，3-4 小時）

**Day 3**（4-5 小時）:
- ✅ 完成課程卡片重構（1-2 小時）
- ✅ 統一按鈕設計系統（2 小時）
- ✅ 調整字體樣式（1 小時）
- ✅ 全面測試與調整（1-2 小時）

**總計**：15-20 小時（約 3 個工作日）

---

## 📄 參考文檔

開發時請參考：

1. **[`UI-COMPARISON-REPORT.md`](../UI-COMPARISON-REPORT.md)**
   - 完整的 UI 差異分析
   - 截圖對比
   - 詳細數值測量

2. **[`design-requirements.md`](design-requirements.md)**
   - 更新後的設計規格
   - CSS 變數配置
   - 組件設計指南

3. **[`current-status.md`](current-status.md)**
   - 當前完成狀態
   - 關鍵差異總結
   - 已完成項目清單

4. **截圖路徑**：
   - `.playwright-mcp/target-homepage-full.png`
   - `.playwright-mcp/target-courses-page.png`
   - `.playwright-mcp/local-homepage-full.png`
   - `.playwright-mcp/local-courses-page.png`

---

## 🎯 成功標準

修復完成後，應達到：

✅ **佈局一致**：
- 無獨立頂部 Navbar
- Sidebar 230px 寬，分組導航
- 主內容區功能區正確

✅ **色彩一致**：
- 背景 #171923
- 所有按鈕金色 (#FFD700)
- Sidebar 高亮金色

✅ **組件一致**：
- 課程卡片黃色邊框
- 大圖封面（16:9）
- 黃色優惠區塊
- 雙金色 CTA

✅ **細節一致**：
- 按鈕圓角 6px
- 按鈕字重 500
- 整體視覺風格與目標網站高度相似

**目標相似度**：90%+
