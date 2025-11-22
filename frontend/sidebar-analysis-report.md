# 水球軟體學院 Sidebar 詳細分析報告

## 目錄
1. [目標網站 Sidebar 分析](#1-目標網站-sidebar-分析)
2. [圖示分析](#2-圖示分析)
3. [選單結構](#3-選單結構)
4. [樣式規格](#4-樣式規格)
5. [互動效果](#5-互動效果)
6. [與本地網站比對](#6-與本地網站比對建議)

---

## 1. 目標網站 Sidebar 分析

### 1.1 整體布局
- **位置**: 固定在視窗左側
- **寬度**: 約 235px
- **背景色**: 深色主題 (接近 `#1A1D2E` 或 `rgb(26, 29, 46)`)
- **結構**: Logo 區域 + 三組選單

### 1.2 Logo 區域
- **圖片來源**: `https://world.waterballsa.tw/world/logo.png`
- **尺寸**: 235x64px
- **Alt 文字**: "水球軟體學院"
- **下方文字**: "WATERBALLSA.TW" (小字，白色)
- **連結**: 指向首頁 `/`

---

## 2. 圖示分析

### 2.1 圖示類型
**關鍵發現**: 目標網站使用的是 **SVG 內聯圖示**（Lucide React 圖示庫），而非圖片檔案。

### 2.2 圖示詳細資訊

| 選單項目 | 圖示名稱 (Lucide) | SVG 路徑特徵 |
|---------|------------------|-------------|
| 首頁 | `lucide-house` | 包含房屋形狀的 path 元素 |
| 課程 | `lucide-layout-dashboard` | 包含多個 rect 元素組成的儀表板布局 |
| 個人檔案 | `lucide-user-round-pen` | 圓形用戶頭像 + 編輯筆圖示 |
| 排行榜 | `lucide-trophy` | 獎盃形狀 |
| 獎勵任務 | `lucide-gift` | 禮物盒形狀 |
| 挑戰歷程 | `lucide-square-chart-gantt` | 甘特圖樣式 |
| 所有單元 | `lucide-album` | 相簿/書籍圖示 |
| 挑戰地圖 | `lucide-map` | 地圖形狀 |
| SOP 寶典 | `lucide-book-text` | 書本 + 文字線條 |

### 2.3 圖示樣式規格
```css
svg {
  width: 24px;
  height: 24px;
  stroke: currentColor;  /* 繼承文字顏色 */
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;  /* 線條風格，無填充 */
}
```

---

## 3. 選單結構

### 3.1 選單分組

目標網站的選單分為 **3 個群組**（視登入狀態可能顯示 2-3 組）：

#### **第一組：核心功能**（總是顯示）
1. 首頁 (`/`)
2. 課程 (`/courses`)
3. 個人檔案 (`/users/me/profile`)

#### **第二組：社群功能**（登入後顯示）
1. 排行榜 (`/leaderboard`)
2. 獎勵任務 (`/journeys/software-design-pattern/missions`)
3. 挑戰歷程 (`/users/me/portfolio`)

#### **第三組：課程相關**（選擇課程後顯示）
1. 所有單元 (`/journeys/software-design-pattern`)
2. 挑戰地圖 (`/journeys/software-design-pattern/roadmap`)
3. SOP 寶典 (`/journeys/software-design-pattern/sop`)

### 3.2 選單項目順序對比

**目標網站**:
```
首頁 → 課程 → 個人檔案
排行榜 → 獎勵任務 → 挑戰歷程
所有單元 → 挑戰地圖 → SOP 寶典
```

**本地網站（需檢查）**:
（待訪問 localhost:3001 後補充）

---

## 4. 樣式規格

### 4.1 選單項目樣式

#### **預設狀態**（未選中）
```css
a {
  display: flex;
  align-items: center;
  gap: 12px;  /* 圖示與文字間距 */
  padding: 12px 10px;
  border-radius: 20px;
  background-color: transparent;
  color: rgb(244, 244, 245);  /* 淺灰白色 */
  font-size: 14px;
  font-weight: 400;
  transition: background-color 0.2s;
}
```

#### **選中狀態**（Active）
```css
a.active {
  background-color: rgb(255, 215, 0);  /* 金黃色 #FFD700 */
  color: rgb(23, 25, 35);  /* 深色文字 */
  font-weight: 500;
}
```

#### **Hover 狀態**
```css
a:hover {
  background-color: rgb(255, 215, 0);  /* 與選中狀態相同 */
  color: rgb(23, 25, 35);
}
```

### 4.2 群組間距
- 每個 `<ul>` 之間沒有明顯的 margin/padding
- 視覺上透過自然間距區隔（可能是 Logo 下方或群組內的間距實現）

### 4.3 Sidebar 容器樣式
```css
.sidebar-container {
  position: fixed;  /* 或 sticky */
  top: 0;
  left: 0;
  width: 235px;
  height: 100vh;
  background-color: rgb(26, 29, 46);  /* 深色背景 */
  padding: 20px 16px;  /* 上下左右內距 */
  overflow-y: auto;
}
```

---

## 5. 互動效果

### 5.1 Hover 動畫
- **效果**: 滑鼠移入時，背景色從透明變為金黃色
- **過渡時間**: 約 0.2s
- **顏色變化**:
  - 背景: `transparent` → `rgb(255, 215, 0)`
  - 文字: `rgb(244, 244, 245)` → `rgb(23, 25, 35)`
  - 圖示: 繼承文字顏色變化

### 5.2 點擊效果
- **路由切換**: 無頁面刷新（使用 Next.js Link）
- **視覺回饋**: 點擊後立即顯示 active 狀態
- **無額外動畫**: 沒有按下動畫或漣漪效果

### 5.3 選中狀態邏輯
- 根據當前 URL 判斷 active 狀態
- 可能使用 `router.pathname` 或 `aria-current="page"`

---

## 6. 與本地網站比對（建議）

### 6.1 預期差異（基於文檔）

根據 `docs/design-gaps.md`，本地網站可能存在以下問題：

#### **A. 布局結構差異**
- **目標**: 左側固定 Sidebar（垂直布局）
- **本地**: 可能是頂部 Navbar（水平布局）
- **需修改**: 整個布局架構需重構

#### **B. 顏色主題差異**
- **目標**: 深色主題（背景 `#1A1D2E`，選中 `#FFD700`）
- **本地**: 可能是淺色主題
- **需修改**: 整套色彩系統

#### **C. 圖示實現差異**
- **目標**: Lucide React SVG 圖示
- **本地**: 可能使用其他圖示庫或圖片
- **需安裝**: `npm install lucide-react`

### 6.2 建議優先修改項目

#### **優先級 1: 圖示替換**
1. 安裝 Lucide React: `npm install lucide-react`
2. 替換所有選單項目的圖示為對應的 Lucide 組件
3. 確保圖示尺寸為 24x24px

#### **優先級 2: 樣式對齊**
1. 選中狀態背景色改為 `#FFD700`
2. 文字顏色調整為白色（預設）和深色（選中）
3. Border-radius 設定為 `20px`
4. Padding 調整為 `12px 10px`

#### **優先級 3: 選單順序**
1. 檢查選單項目順序是否與目標網站一致
2. 確認動態顯示邏輯（登入狀態、課程選擇）

#### **優先級 4: 互動效果**
1. 實現 0.2s 的 hover 過渡動畫
2. 確保 active 狀態正確切換

### 6.3 檢查清單

待本地伺服器啟動後，需檢查：

- [ ] Sidebar 是否為左側垂直布局？
- [ ] Logo 圖片來源是否正確？
- [ ] 選單項目順序是否正確？
- [ ] 圖示類型（SVG/圖片/Icon Font）？
- [ ] 選中狀態背景色是否為金黃色？
- [ ] Hover 效果是否存在？
- [ ] 是否有動態顯示邏輯（登入/未登入）？
- [ ] 選單分組是否清晰？

---

## 7. 圖示資源清單

### 7.1 Lucide React 安裝指令
```bash
npm install lucide-react
```

### 7.2 圖示引入範例
```typescript
import {
  House,           // 首頁
  LayoutDashboard, // 課程
  UserRoundPen,    // 個人檔案
  Trophy,          // 排行榜
  Gift,            // 獎勵任務
  SquareChartGantt,// 挑戰歷程
  Album,           // 所有單元
  Map,             // 挑戰地圖
  BookText         // SOP 寶典
} from 'lucide-react';

// 使用範例
<House size={24} strokeWidth={2} />
```

### 7.3 圖示對應表（Lucide React）

| 文字 | 組件名稱 | 引入路徑 |
|------|---------|---------|
| 首頁 | `House` | `lucide-react` |
| 課程 | `LayoutDashboard` | `lucide-react` |
| 個人檔案 | `UserRoundPen` | `lucide-react` |
| 排行榜 | `Trophy` | `lucide-react` |
| 獎勵任務 | `Gift` | `lucide-react` |
| 挑戰歷程 | `SquareChartGantt` | `lucide-react` |
| 所有單元 | `Album` | `lucide-react` |
| 挑戰地圖 | `Map` | `lucide-react` |
| SOP 寶典 | `BookText` | `lucide-react` |

---

## 8. 技術建議

### 8.1 組件實現建議

```typescript
// components/layout/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, LayoutDashboard, UserRoundPen, Trophy } from 'lucide-react';

const menuItems = [
  { text: '首頁', href: '/', icon: House },
  { text: '課程', href: '/courses', icon: LayoutDashboard },
  // ... 其他項目
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-[235px] bg-[#1A1D2E] p-4">
      {/* Logo */}
      <Link href="/">
        <img src="https://world.waterballsa.tw/world/logo.png" alt="水球軟體學院" />
      </Link>

      {/* Menu */}
      <nav className="mt-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 rounded-[20px] px-2.5 py-3
                    text-sm transition-colors duration-200
                    ${isActive
                      ? 'bg-[#FFD700] text-[#171923] font-medium'
                      : 'text-white hover:bg-[#FFD700] hover:text-[#171923]'
                    }
                  `}
                >
                  <Icon size={24} strokeWidth={2} />
                  <span>{item.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
```

### 8.2 Tailwind 配置建議

確保 `tailwind.config.ts` 包含以下顏色：

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#FFD700',      // 金黃色（選中狀態）
        background: '#1A1D2E',   // 深色背景
        textPrimary: '#F4F4F5',  // 淺色文字（預設）
        textDark: '#171923',     // 深色文字（選中）
      },
    },
  },
};
```

---

## 9. 截圖參考

本次分析已擷取以下截圖：

1. **target-sidebar.png**: 目標網站 Sidebar 完整截圖
2. **target-sidebar-hover.png**: 顯示 hover 效果的截圖

截圖位置: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/`

---

## 10. 後續步驟

1. **啟動本地伺服器**: `npm run dev` (port 3001)
2. **比對本地網站**: 訪問 `http://localhost:3001` 並擷取截圖
3. **記錄差異**: 列出所有視覺和功能差異
4. **制定修改計劃**: 根據優先級逐步修改
5. **驗證結果**: 逐項檢查是否符合目標網站

---

## 附錄：完整選單路由表

| 選單項目 | 路由路徑 | 顯示條件 |
|---------|---------|---------|
| 首頁 | `/` | 總是顯示 |
| 課程 | `/courses` | 總是顯示 |
| 個人檔案 | `/users/me/profile` | 總是顯示 |
| 排行榜 | `/leaderboard` | 登入後顯示 |
| 獎勵任務 | `/journeys/software-design-pattern/missions` | 選擇課程後顯示 |
| 挑戰歷程 | `/users/me/portfolio` | 登入後顯示 |
| 所有單元 | `/journeys/software-design-pattern` | 選擇課程後顯示 |
| 挑戰地圖 | `/journeys/software-design-pattern/roadmap` | 選擇課程後顯示 |
| SOP 寶典 | `/journeys/software-design-pattern/sop` | 選擇課程後顯示 |

---

**報告生成時間**: 2025-11-22
**分析工具**: Playwright MCP + Browser Automation
**目標網站**: https://world.waterballsa.tw/
**本地網站**: http://localhost:3001 (待檢查)
