# Design Tokens - 水球軟體學院 LMS 平台

本文件定義了整個學習平台的視覺設計系統，所有 UI 元件都應遵循這些設計規範。

## 顏色系統 (Color System)

### 主要顏色 (Primary Colors)
```css
--color-primary: #FFD700;          /* 主要黃色 - 按鈕、高亮、CTA */
--color-primary-dark: #FFC700;     /* 黃色 Hover 狀態 */
--color-primary-light: #FFED4E;    /* 黃色淺色變體 */
```

### 背景顏色 (Background Colors)
```css
--color-bg-primary: #1A1D2E;       /* 主背景 - 深藍色 */
--color-bg-secondary: #252838;     /* 卡片背景 */
--color-bg-tertiary: #2D3142;      /* 側邊欄、導航欄背景 */
--color-bg-hover: #3A3D52;         /* Hover 狀態背景 */
--color-bg-modal: rgba(0, 0, 0, 0.7); /* 遮罩背景 */
```

### 文字顏色 (Text Colors)
```css
--color-text-primary: #FFFFFF;     /* 主要文字 */
--color-text-secondary: #B8BACF;   /* 次要文字 */
--color-text-muted: #6B6D7F;       /* 灰色輔助文字 */
--color-text-disabled: #4A4C5E;    /* 禁用狀態文字 */
```

### 狀態顏色 (Status Colors)
```css
--color-success: #10B981;          /* 成功、已完成 (綠色) */
--color-warning: #F59E0B;          /* 警告、進行中 (橙色) */
--color-error: #EF4444;            /* 錯誤、失敗 (紅色) */
--color-info: #3B82F6;             /* 資訊 (藍色) */
--color-locked: #6B7280;           /* 鎖定、未開放 (灰色) */
```

### 邊框顏色 (Border Colors)
```css
--color-border-default: #3A3D52;   /* 預設邊框 */
--color-border-hover: #4A4D62;     /* Hover 狀態邊框 */
--color-border-focus: #FFD700;     /* Focus 狀態邊框 */
```

## Tailwind CSS 配置對照

在 `tailwind.config.ts` 中的對應配置：

```typescript
colors: {
  primary: {
    DEFAULT: '#FFD700',
    dark: '#FFC700',
    light: '#FFED4E',
  },
  background: {
    primary: '#1A1D2E',
    secondary: '#252838',
    tertiary: '#2D3142',
    hover: '#3A3D52',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B8BACF',
    muted: '#6B6D7F',
    disabled: '#4A4C5E',
  },
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    locked: '#6B7280',
  }
}
```

## 間距系統 (Spacing System)

基於 4px 基準單位的 8pt 網格系統：

```css
--spacing-unit: 4px;

--spacing-0: 0px;
--spacing-1: 4px;     /* 0.25rem */
--spacing-2: 8px;     /* 0.5rem */
--spacing-3: 12px;    /* 0.75rem */
--spacing-4: 16px;    /* 1rem */
--spacing-5: 20px;    /* 1.25rem */
--spacing-6: 24px;    /* 1.5rem */
--spacing-8: 32px;    /* 2rem */
--spacing-10: 40px;   /* 2.5rem */
--spacing-12: 48px;   /* 3rem */
--spacing-16: 64px;   /* 4rem */
--spacing-20: 80px;   /* 5rem */
--spacing-24: 96px;   /* 6rem */
```

### 語意化間距
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
--spacing-2xl: 48px;
--spacing-3xl: 64px;
```

## 字體系統 (Typography)

### 字體族 (Font Families)
```css
--font-heading: 'Inter', 'Noto Sans TC', sans-serif;
--font-body: 'Inter', 'Noto Sans TC', sans-serif;
--font-mono: 'JetBrains Mono', 'Courier New', monospace;
```

### 字體大小 (Font Sizes)
```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.25rem;      /* 20px */
--text-2xl: 1.5rem;      /* 24px */
--text-3xl: 1.875rem;    /* 30px */
--text-4xl: 2.25rem;     /* 36px */
--text-5xl: 3rem;        /* 48px */
```

### 字體粗細 (Font Weights)
```css
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### 行高 (Line Heights)
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

## 圓角系統 (Border Radius)

```css
--radius-none: 0px;
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;   /* 完全圓形 */
```

## 陰影系統 (Shadows)

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
             0 10px 10px -5px rgba(0, 0, 0, 0.04);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
```

## 動畫與過渡 (Transitions)

### 過渡時間 (Transition Duration)
```css
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
```

### 緩動函數 (Easing Functions)
```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### 常用過渡效果
```css
--transition-default: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-colors: color 150ms ease-in-out,
                     background-color 150ms ease-in-out,
                     border-color 150ms ease-in-out;
--transition-transform: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
```

## 斷點系統 (Breakpoints)

響應式設計斷點：

```css
--breakpoint-sm: 640px;     /* 手機橫屏 */
--breakpoint-md: 768px;     /* 平板 */
--breakpoint-lg: 1024px;    /* 小型桌面 */
--breakpoint-xl: 1280px;    /* 桌面 */
--breakpoint-2xl: 1920px;   /* 大型桌面 */
```

### 使用說明
- **Mobile First**: < 768px (手機版漢堡選單)
- **Tablet**: 768px - 1919px (可收合側邊欄)
- **Desktop**: ≥ 1920px (固定側邊欄)

## Z-Index 層級系統

```css
--z-base: 0;
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
```

## 元件特定設計規範

### 按鈕 (Buttons)

#### Primary Button
```css
background: var(--color-primary);
color: #1A1D2E;
padding: 12px 24px;
border-radius: var(--radius-lg);
font-weight: var(--font-semibold);
transition: var(--transition-colors);

hover: background: var(--color-primary-dark);
```

#### Secondary Button
```css
background: transparent;
color: var(--color-text-primary);
border: 1px solid var(--color-border-default);
padding: 12px 24px;
border-radius: var(--radius-lg);

hover: background: var(--color-bg-hover);
```

### 卡片 (Cards)
```css
background: var(--color-bg-secondary);
border-radius: var(--radius-xl);
padding: var(--spacing-6);
box-shadow: var(--shadow-md);
```

### 輸入框 (Input Fields)
```css
background: var(--color-bg-tertiary);
border: 1px solid var(--color-border-default);
border-radius: var(--radius-md);
padding: 12px 16px;
color: var(--color-text-primary);

focus: border-color: var(--color-border-focus);
       outline: none;
       box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
```

### 導航欄 (Navbar)
```css
height: 64px;
background: var(--color-bg-tertiary);
box-shadow: var(--shadow-sm);
position: sticky;
top: 0;
z-index: var(--z-sticky);
```

### 側邊欄 (Sidebar)
```css
width: 280px;  /* Desktop */
background: var(--color-bg-tertiary);
padding: var(--spacing-6);
overflow-y: auto;

/* Mobile drawer */
@media (max-width: 768px) {
  position: fixed;
  left: -100%;
  transition: left var(--duration-normal);

  &.open {
    left: 0;
  }
}
```

## 圖示系統 (Icons)

推薦使用 **Lucide React** 或 **Heroicons**

### 圖示尺寸
```css
--icon-xs: 12px;
--icon-sm: 16px;
--icon-md: 20px;
--icon-lg: 24px;
--icon-xl: 32px;
```

## 使用範例

### React 元件中使用
```tsx
<button className="
  bg-primary
  text-background-primary
  px-6 py-3
  rounded-lg
  font-semibold
  transition-colors
  hover:bg-primary-dark
">
  立即加入課程
</button>
```

### CSS Module 中使用
```css
.card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-6);
  box-shadow: var(--shadow-md);
}
```

## 無障礙設計 (Accessibility)

### 顏色對比
- 文字與背景的對比度應符合 WCAG AA 標準 (4.5:1)
- 大文字與背景的對比度應符合 WCAG AA 標準 (3:1)

### Focus 狀態
所有可互動元素都應有明顯的 focus 樣式：
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```
