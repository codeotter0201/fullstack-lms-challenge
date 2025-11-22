# RWD 響應式設計指南

本文件詳細說明 Release 1 的響應式設計實作與測試要點。

---

## 📐 設計斷點

遵循 Tailwind CSS 的標準斷點系統：

```css
/* Mobile First 設計 */
默認樣式:        < 640px   (Mobile)
sm:             ≥ 640px   (Large Mobile)
md:             ≥ 768px   (Tablet)
lg:             ≥ 1024px  (Desktop)
xl:             ≥ 1280px  (Large Desktop)
2xl:            ≥ 1536px  (Extra Large)
```

### 專案主要斷點

基於測試文件，專案主要關注三個斷點：

- **Mobile**: < 768px
- **Tablet**: 768px - 1919px
- **Desktop**: ≥ 1920px

---

## 🎨 響應式設計原則

### 1. Mobile First 設計

所有元件預設為移動端優化，使用 Tailwind 的響應式前綴向上擴展：

```tsx
// ✅ 正確：Mobile First
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

// ❌ 錯誤：Desktop First
<div className="grid grid-cols-3 md:grid-cols-2 grid-cols-1">
```

### 2. 觸控友善

- 最小可觸控區域：44x44px (iOS) / 48x48px (Android)
- 按鈕間距：至少 8px
- 使用 `py-3` 或以上確保足夠的點擊區域

```tsx
// ✅ 觸控友善的按鈕
<button className="px-6 py-3 rounded-lg">點擊我</button>

// ❌ 太小的按鈕
<button className="px-2 py-1 text-xs">點擊我</button>
```

### 3. 內容優先

行動版隱藏次要內容，保留核心功能：

```tsx
{/* 桌面版顯示詳細資訊 */}
<div className="hidden lg:block">
  <UserDetailInfo />
</div>

{/* 行動版只顯示核心資訊 */}
<div className="lg:hidden">
  <UserBasicInfo />
</div>
```

---

## 📱 元件響應式實作

### Navbar (導航列)

**Desktop (≥ md)**
- 水平導航連結
- 用戶選單在右側
- 通知與設定圖標

**Mobile (< md)**
- 漢堡選單按鈕
- 全螢幕下拉選單
- 用戶資訊在選單頂部

```tsx
{/* 桌面版導航 */}
<div className="hidden md:flex items-center gap-1">
  {navLinks.map(...)}
</div>

{/* 行動版選單按鈕 */}
<button className="md:hidden p-2">
  <Menu />
</button>

{/* 行動版選單內容 */}
{mobileMenuOpen && (
  <div className="md:hidden border-t">
    {/* 選單內容 */}
  </div>
)}
```

**檔案位置**: `frontend/components/layout/Navbar.tsx:64-225`

---

### Grid 網格佈局

**課程卡片網格**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map(course => <CourseCard key={course.id} course={course} />)}
</div>
```

- Mobile: 1 欄
- Tablet: 2 欄
- Desktop: 3 欄

**特色區塊網格**

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
  {features.map(...)}
</div>
```

- Mobile: 1 欄
- Tablet: 2 欄
- Desktop: 4 欄

---

### 排行榜 (Leaderboard)

**前三名領獎台**

- **Desktop**: 領獎台樣式（1st 居中最高，2nd 左側，3rd 右側）
- **Mobile**: 卡片樣式（垂直排列 1, 2, 3）

```tsx
{/* 桌面版領獎台 */}
<div className="hidden md:flex items-end justify-center gap-4">
  <PodiumPosition rank={2} />
  <PodiumPosition rank={1} />
  <PodiumPosition rank={3} />
</div>

{/* 行動版卡片 */}
<div className="md:hidden space-y-4">
  {topThree.map((entry, index) => (
    <RankCard key={entry.userId} entry={entry} rank={index + 1} />
  ))}
</div>
```

**排行榜表格**

- **Desktop**: 表格樣式 (table)
- **Mobile**: 卡片樣式 (stacked cards)

```tsx
{/* 桌面版表格 */}
<table className="hidden md:table w-full">
  <thead>...</thead>
  <tbody>...</tbody>
</table>

{/* 行動版卡片 */}
<div className="md:hidden space-y-3">
  {entries.map(entry => (
    <RankCard key={entry.userId} entry={entry} />
  ))}
</div>
```

**檔案位置**: `frontend/components/leaderboard/TopRankers.tsx`, `LeaderboardTable.tsx`

---

### 課程詳情頁

**佈局切換**

```tsx
<div className="flex flex-col lg:flex-row gap-8">
  {/* 左側：課程內容 */}
  <div className="flex-1">
    <ChapterList />
  </div>

  {/* 右側：進度卡片 (桌面版固定，行動版不固定) */}
  <div className="lg:w-80">
    <div className="lg:sticky lg:top-24">
      <CourseProgress />
    </div>
  </div>
</div>
```

- Mobile: 垂直堆疊
- Desktop: 左右分欄，右側固定

**檔案位置**: `frontend/app/journeys/[journeySlug]/page.tsx:91-236`

---

### 單元頁面

**影片播放器**

```tsx
<div className="flex flex-col lg:flex-row gap-8">
  {/* 左側：影片 */}
  <div className="flex-1">
    <VideoPlayer />
  </div>

  {/* 右側：資訊卡片 */}
  <div className="lg:w-80">
    <Card className="lg:sticky lg:top-24">
      <LessonInfo />
    </Card>
  </div>
</div>
```

**檔案位置**: `frontend/app/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]/page.tsx:155-282`

---

### 個人檔案頁

**Tab 切換**

```tsx
{/* 桌面版：水平 Tab */}
<Tabs
  items={tabs}
  activeKey={activeTab}
  onChange={setActiveTab}
  type="card"
/>
```

Tabs 元件內部處理響應式：
- Mobile: 垂直堆疊或可滾動
- Desktop: 水平排列

**檔案位置**: `frontend/app/users/me/profile/page.tsx:182-187`

---

## 🎯 常見響應式模式

### 1. 條件渲染

```tsx
{/* 只在桌面版顯示 */}
<div className="hidden lg:block">Desktop Content</div>

{/* 只在行動版顯示 */}
<div className="lg:hidden">Mobile Content</div>

{/* 平板以上顯示 */}
<div className="hidden md:block">Tablet+ Content</div>
```

### 2. Flexbox 方向切換

```tsx
<div className="flex flex-col lg:flex-row gap-4">
  <div>左側/上方</div>
  <div>右側/下方</div>
</div>
```

### 3. 文字大小調整

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl">
  標題會隨螢幕變大
</h1>
```

### 4. 間距調整

```tsx
<Section className="py-8 md:py-12 lg:py-16">
  {/* 內容 */}
</Section>
```

### 5. 網格欄數

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Grid 項目 */}
</div>
```

---

## 🧪 測試檢查清單

### 裝置測試

- [ ] **iPhone SE (375px)** - 最小行動裝置
- [ ] **iPhone 12/13 (390px)** - 標準行動裝置
- [ ] **iPhone 14 Pro Max (430px)** - 大型行動裝置
- [ ] **iPad Mini (768px)** - 小平板
- [ ] **iPad Pro (1024px)** - 大平板
- [ ] **MacBook Air (1280px)** - 小筆電
- [ ] **Desktop 1920px** - 標準桌機
- [ ] **Desktop 2560px+** - 大螢幕

### 功能測試

#### Navbar
- [ ] Mobile 漢堡選單可開關
- [ ] Mobile 選單項目完整顯示
- [ ] Desktop 水平導航正確
- [ ] 點擊連結後選單自動關閉

#### Grid 佈局
- [ ] 課程卡片在各斷點正確顯示（1/2/3 欄）
- [ ] 特色區塊在各斷點正確顯示（1/2/4 欄）
- [ ] 卡片間距一致
- [ ] 無橫向滾動條

#### 排行榜
- [ ] 桌面版領獎台正確顯示
- [ ] 行動版切換為卡片樣式
- [ ] 表格在行動版切換為卡片
- [ ] 所有資訊正確顯示

#### 課程詳情頁
- [ ] 行動版垂直堆疊
- [ ] 桌面版左右分欄
- [ ] 進度卡片桌面版固定
- [ ] 章節列表正確展開/收合

#### 單元頁面
- [ ] 影片播放器正確縮放
- [ ] 行動版資訊卡片在下方
- [ ] 桌面版資訊卡片固定在右側
- [ ] 按鈕在行動版正確堆疊

#### 個人檔案
- [ ] Tab 切換正確運作
- [ ] 統計資料網格響應式
- [ ] 頭像與徽章正確顯示
- [ ] 表單元素在行動版可用

### UI/UX 測試

- [ ] 所有按鈕可觸控（≥ 44px 高度）
- [ ] 文字大小在行動版可讀（≥ 14px）
- [ ] 間距在行動版足夠
- [ ] 無內容被截斷
- [ ] 圖片正確縮放
- [ ] 表單輸入框大小適當
- [ ] Modal/Dropdown 在行動版可用
- [ ] Toast 通知在行動版正確顯示

### 效能測試

- [ ] 圖片使用 lazy loading
- [ ] 無不必要的重渲染
- [ ] Tailwind 只包含使用的類別
- [ ] 動畫流暢（60fps）
- [ ] 無 layout shift

---

## 🔧 自訂 Hook 支援

### useMediaQuery

檢測螢幕尺寸：

```tsx
import { useIsMobile, useIsTablet, useIsDesktop } from '@/hooks/useMediaQuery'

function MyComponent() {
  const isMobile = useIsMobile()   // < 768px
  const isTablet = useIsTablet()   // 768px - 1023px
  const isDesktop = useIsDesktop() // ≥ 1024px

  return (
    <div>
      {isMobile && <MobileView />}
      {isTablet && <TabletView />}
      {isDesktop && <DesktopView />}
    </div>
  )
}
```

**檔案位置**: `frontend/hooks/useMediaQuery.ts`

---

## 📦 Tailwind 配置

### 斷點設定

```js
// tailwind.config.ts
module.exports = {
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  }
}
```

### 自訂工具類

```css
/* globals.css */

/* 容器最大寬度 */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* 卡片懸停效果 */
.card-hover {
  @apply transition-all duration-200 hover:shadow-lg hover:-translate-y-1;
}
```

**檔案位置**: `frontend/app/globals.css:119-133`

---

## 🐛 常見問題與解決方案

### 1. 橫向滾動條

**問題**: 在行動版出現橫向滾動條

**解決方案**:
```tsx
// ✅ 使用 max-w-full 或 w-full
<img src="..." className="w-full h-auto" />

// ✅ 確保 container 有正確 padding
<div className="px-4 sm:px-6 lg:px-8">

// ❌ 避免固定寬度超過螢幕
<div className="w-[500px]"> {/* 可能太寬 */}
```

### 2. 文字太小

**問題**: 行動版文字太小難以閱讀

**解決方案**:
```tsx
// ✅ 使用響應式文字大小
<p className="text-sm md:text-base">內容</p>

// ❌ 避免太小的文字
<p className="text-xs">重要內容</p>
```

### 3. 觸控區域太小

**問題**: 按鈕或連結太小難以點擊

**解決方案**:
```tsx
// ✅ 確保足夠的 padding
<button className="px-6 py-3">按鈕</button>

// ✅ 或使用 size prop
<Button size="lg">按鈕</Button>

// ❌ 太小的按鈕
<button className="px-2 py-1 text-xs">按鈕</button>
```

### 4. Modal 在行動版溢出

**問題**: Modal 內容超出螢幕

**解決方案**:
```tsx
// ✅ 設定 max-height 和 overflow
<div className="max-h-[80vh] overflow-y-auto p-6">
  {content}
</div>

// ✅ 使用 vh 單位
<div className="h-screen overflow-y-auto">
```

### 5. Fixed 定位問題

**問題**: 固定定位元素在行動版擋住內容

**解決方案**:
```tsx
// ✅ 只在桌面版使用 sticky
<div className="lg:sticky lg:top-24">
  <SidebarCard />
</div>

// ❌ 在行動版也使用 sticky
<div className="sticky top-24">
```

---

## ✅ 最佳實踐

1. **始終使用 Mobile First**: 預設樣式為行動版，向上擴展
2. **測試真實裝置**: 瀏覽器開發工具只能作為參考
3. **觸控友善**: 按鈕至少 44x44px
4. **避免橫向滾動**: 使用 `max-w-full` 限制寬度
5. **合理的間距**: 行動版使用較小間距節省空間
6. **可讀的文字**: 最小 14px，行高至少 1.5
7. **效能優先**: 行動裝置資源有限，優化載入速度
8. **測試各種尺寸**: 不只測試標準尺寸，也測試極端尺寸

---

## 📚 相關文件

- [Component Library Guide](./component-library-guide.md) - 元件庫文檔
- [Testing Checklist](./testing-checklist.md) - 測試檢查清單
