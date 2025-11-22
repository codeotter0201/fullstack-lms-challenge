# 未實作元件清單

**目標網站**: https://world.waterballsa.tw/

## 概述

本文檔列出系統需要的元件，按功能分類，標註優先級與預估工時。

---

## 優先級圖例

- 🔴 **P0 - 最高優先級**：影響核心功能或品牌識別
- 🟡 **P1 - 高優先級**：重要功能元件
- 🟢 **P2 - 中優先級**：增強功能元件
- ⚪ **P3 - 低優先級**：nice-to-have 元件

---

## 1. 佈局與導航元件

### 1.1 🔴 P0: VerticalSidebar.tsx
**路徑**：`components/layout/VerticalSidebar.tsx`

**功能**：
- 左側固定垂直側邊欄（替代當前的橫向 Navbar）
- 深色背景 (#1A1D2E)
- Logo 置於頂部
- 垂直排列導航項目
  - 首頁
  - 課程
  - 排行榜
  - 個人檔案
- 用戶資訊區塊置於底部
  - 用戶頭像
  - 暱稱
  - 等級與經驗值

**技術需求**：
- 固定定位 (fixed positioning)
- 滾動獨立於主內容
- 響應式：Desktop 顯示，Mobile 隱藏（轉為抽屜）
- 當前選中項目高亮

**預估工時**：4-6 小時

---

### 1.2 🔴 P0: TopBar.tsx
**路徑**：`components/layout/TopBar.tsx`

**功能**：
- 水平頂部工具列（位於主內容區上方）
- 包含三個主要區塊：
  1. **課程切換器** (JourneySwitcher)
  2. **通知鈴鐺** (NotificationBell)
  3. **用戶選單** (UserMenu)
- 背景色與主內容區一致
- 固定或粘性定位

**技術需求**：
- Flex 佈局
- 左對齊課程切換器
- 右對齊通知與用戶選單
- z-index 管理（確保下拉選單正確顯示）

**預估工時**：2-3 小時

---

### 1.3 🔴 P0: PromotionalBanner.tsx
**路徑**：`components/promotional/PromotionalBanner.tsx`

**功能**：
- 頁面最頂部的促銷橫幅
- 顯示文字：「看完試聽獲得3000元折價券」或其他促銷訊息
- 醒目的金色/黃色背景
- 可關閉功能（Cookie 記憶狀態）
- 點擊跳轉到相關頁面/展開詳情

**技術需求**：
- localStorage 記憶關閉狀態
- 動畫效果（滑入/滑出）
- 響應式文字大小

**預估工時**：2-3 小時

---

### 1.4 🟢 P2: MobileDrawer.tsx
**路徑**：`components/layout/MobileDrawer.tsx`

**功能**：
- 行動版側邊欄抽屜
- 從左側滑入
- 包含與 VerticalSidebar 相同的導航項目
- 遮罩層（點擊關閉）
- 滑動手勢支援

**技術需求**：
- CSS transitions/animations
- 觸控手勢處理
- Portal 渲染（避免 z-index 問題）
- 防止背景滾動（body overflow hidden）

**預估工時**：3-4 小時

---

## 2. 課程相關元件

### 2.1 🔴 P0: JourneySwitcher.tsx
**路徑**：`components/course/JourneySwitcher.tsx`

**功能**：
- 課程切換下拉選單（位於 TopBar）
- 顯示當前課程名稱與縮圖
- 下拉顯示所有已擁有的課程
- 點擊切換到另一課程
- 搜尋功能（如課程很多）

**UI 設計**：
```
┌────────────────────────────┐
│ [縮圖] 當前課程名稱  ▼     │  ← 觸發按鈕
└────────────────────────────┘
         ↓ 點擊後展開
┌────────────────────────────┐
│ [縮圖] 軟體設計模式精通之旅 │
│ [縮圖] AI x BDD 開發       │
│ [縮圖] 其他課程...         │
└────────────────────────────┘
```

**技術需求**：
- Dropdown 元件擴展
- JourneyContext 整合
- 路由跳轉邏輯
- 鍵盤導航支援

**預估工時**：3-4 小時

---

### 2.2 🔴 P0: OwnershipBadge.tsx
**路徑**：`components/course/OwnershipBadge.tsx`

**功能**：
- 顯示課程擁有狀態的徽章
- 三種狀態：
  - **尚未擁有**（灰色，半透明）
  - **已擁有**（金色，實心）
  - **付費專屬**（紫色，帶鎖頭圖示）
- 位置：課程卡片右上角或標題下方

**UI 變體**：
```tsx
<OwnershipBadge status="not-owned" />  // 尚未擁有
<OwnershipBadge status="owned" />      // 已擁有
<OwnershipBadge status="premium" />    // 付費專屬
```

**技術需求**：
- 根據 status prop 動態樣式
- 可選圖示（Lucide Icons）
- 不同尺寸變體 (small/medium/large)

**預估工時**：1-2 小時

---

### 2.3 🟡 P1: CertificateCard.tsx
**路徑**：`components/course/CertificateCard.tsx`

**功能**：
- 顯示課程完課證書
- 位於課程詳情頁右側邊欄
- 包含元素：
  - 證書預覽圖（縮圖）
  - 證書標題
  - 下載按鈕（預留 R2）
  - 分享按鈕（預留社群分享）
- 完課後才顯示，未完課顯示進度提示

**UI 設計**：
```
┌─────────────────────┐
│                     │
│  [證書預覽圖]        │
│                     │
├─────────────────────┤
│ 完課證書            │
│ 完成度：95%         │
│                     │
│ [下載證書]          │
│ [分享到社群]        │
└─────────────────────┘
```

**技術需求**：
- 條件渲染（完課 vs 未完課）
- 進度百分比計算
- 預留下載/分享功能接口

**預估工時**：3-4 小時

---

### 2.4 🟡 P1: CourseInfoBadges.tsx
**路徑**：`components/course/CourseInfoBadges.tsx`

**功能**：
- 課程資訊徽章群組
- 顯示課程特色標籤：
  - 🇹🇼 中文課程
  - 📱 支援行動裝置
  - 🎓 專業的完課認證
  - 其他課程特色
- 水平排列，換行顯示

**UI 設計**：
```tsx
<CourseInfoBadges
  badges={[
    { icon: '🇹🇼', label: '中文課程' },
    { icon: '📱', label: '支援行動裝置' },
    { icon: '🎓', label: '專業的完課認證' }
  ]}
/>
```

**技術需求**：
- Badge 元件的擴展應用
- 靈活的圖示系統（emoji 或 icon component）
- 響應式換行

**預估工時**：1-2 小時

---

### 2.5 🟡 P1: ChapterAccordion.tsx
**路徑**：`components/course/ChapterAccordion.tsx`

**功能**：
- 章節手風琴列表（替代或增強現有的 ChapterList）
- 特色命名：「副本零」、「副本一」、「副本二」...
- 每個章節可展開/收合
- 顯示章節資訊：
  - 章節序號與名稱
  - 完成進度（X/Y 已完成）
  - 鎖定狀態（付費章節顯示鎖圖示）
- 展開後顯示該章節的所有 Lesson

**UI 設計**：
```
▼ 副本一：行雲流水的設計底層思路  [15/23 已完成]
  ├─ 01. 設計的關鍵是：把無形變有形  ✓
  ├─ 02. UML 不是拿來寫文件用的  ✓
  ├─ 03. 行雲流水的 OOA | OOD | OOP  ○
  └─ ...

▶ 副本二：設計模式基礎  🔒 [需付費解鎖]
```

**技術需求**：
- 受控/非受控模式
- 多個手風琴同時展開支援
- 平滑動畫過渡
- 整合 LessonCard 元件

**預估工時**：4-5 小時

---

## 3. 促銷與訂單元件

### 3.1 🔴 P0: DiscountBanner.tsx
**路徑**：`components/promotional/DiscountBanner.tsx`

**功能**：
- 課程卡片上的折價券提示橫幅
- 顯示：「⚡ 你有一張 3,000 折價券」
- 醒目的黃色/金色背景
- 點擊可展開折價券詳情 Modal
- 與 CourseCard 元件整合

**UI 設計**：
```
┌────────────────────────────┐
│ ⚡ 你有一張 3,000 折價券     │  ← 點擊展開詳情
└────────────────────────────┘
```

**技術需求**：
- 條件渲染（用戶是否有折價券）
- Modal 觸發
- 折價券資料型別定義

**預估工時**：2-3 小時

---

### 3.2 🟡 P1: OrderHistory.tsx
**路徑**：`components/order/OrderHistory.tsx`

**功能**：
- 訂單記錄表格/列表
- 顯示於課程列表頁下方
- 欄位包含：
  - 訂單編號
  - 購買日期
  - 課程名稱與縮圖
  - 付款狀態（已付款/待付款/已退款）
  - 訂單金額
  - 操作按鈕（查看詳情）
- 分頁功能（如訂單很多）

**UI 設計**：
```
訂單紀錄
┌───────────────────────────────────────────────┐
│ #20250115001 | 2025-01-15 | 軟體設計模式... │
│ 已付款 | NT$ 6,000 | [查看詳情]               │
├───────────────────────────────────────────────┤
│ #20250110002 | 2025-01-10 | AI x BDD...     │
│ 已付款 | NT$ 5,000 | [查看詳情]               │
└───────────────────────────────────────────────┘
```

**技術需求**：
- 表格或卡片列表佈局（響應式）
- 分頁或無限滾動
- 訂單 Mock 資料
- 訂單型別定義

**預估工時**：4-5 小時

---

### 3.3 🟢 P2: OrderCard.tsx
**路徑**：`components/order/OrderCard.tsx`

**功能**：
- 單筆訂單的卡片展示（OrderHistory 的子元件）
- 包含：
  - 訂單編號
  - 課程縮圖
  - 課程名稱
  - 訂單金額
  - 付款狀態徽章
  - 操作按鈕

**技術需求**：
- Card 元件的擴展
- Status Badge 整合
- 響應式佈局

**預估工時**：2-3 小時

---

### 3.4 🟢 P2: PricingCard.tsx
**路徑**：`components/purchase/PricingCard.tsx`

**功能**：
- 課程定價展示卡片
- 顯示：
  - 原價（刪除線）
  - 優惠價（大字突出）
  - 折扣百分比徽章（如「-50%」）
  - 價格說明（如「限時優惠」）
  - 購買與試聽雙 CTA 按鈕

**UI 設計**：
```
┌────────────────────────┐
│        -50%  ←徽章     │
│                        │
│  NT$ 12,000  ←原價刪除  │
│  NT$  6,000  ←優惠價    │
│                        │
│  限時優惠至 2025/12/31  │
│                        │
│ [試聽課程] [立刻購買]   │
└────────────────────────┘
```

**技術需求**：
- 價格計算邏輯
- 倒數計時器（如限時優惠）
- CTA 按鈕整合

**預估工時**：3-4 小時

---

## 4. 首頁專用元件

### 4.1 🔴 P0: FounderProfile.tsx
**路徑**：`components/home/FounderProfile.tsx`

**功能**：
- 創辦人水球潘介紹區塊
- 包含元素：
  - 大頭照（圓形或方形，高品質）
  - 姓名與職稱
  - 個人簡介（2-3 段文字）
  - 成就與認證展示
  - 社群媒體連結（YouTube, Facebook, Blog...）
- 可能的佈局：左右分欄或上下堆疊

**UI 設計**：
```
┌───────────────────────────────────────┐
│                                       │
│  [大頭照]    水球潘                    │
│              軟體學院創辦人             │
│                                       │
│  個人簡介文字...                       │
│  教學理念...                          │
│  成就展示...                          │
│                                       │
│  [YouTube] [Facebook] [Blog]         │
│                                       │
└───────────────────────────────────────┘
```

**技術需求**：
- 圖片優化（Next.js Image）
- 社群圖示整合（Lucide Icons）
- 響應式佈局（Desktop 左右，Mobile 上下）

**預估工時**：3-4 小時

---

### 4.2 🟡 P1: FeaturedCourses.tsx
**路徑**：`components/home/FeaturedCourses.tsx`

**功能**：
- 首頁精選課程區塊（僅顯示 2 個課程）
- 特殊的課程卡片設計（比一般 CourseCard 更大、更詳細）
- 固定顯示：
  1. 軟體設計模式精通之旅
  2. AI x BDD 規格驅動開發
- 包含：
  - 大尺寸課程縮圖（可能 2:1 比例）
  - 課程名稱與完整描述
  - 作者資訊
  - 課程特色標籤
  - 醒目的 CTA 按鈕

**UI 設計**：
```
┌──────────────────┐  ┌──────────────────┐
│                  │  │                  │
│  [大縮圖]         │  │  [大縮圖]         │
│                  │  │                  │
│  課程1           │  │  課程2           │
│  詳細描述...      │  │  詳細描述...      │
│  [立即體驗]       │  │  [立即體驗]       │
│                  │  │                  │
└──────────────────┘  └──────────────────┘
```

**技術需求**：
- 硬編碼課程 ID 或 slug
- JourneyContext 整合獲取資料
- 特殊樣式（與一般 CourseCard 區分）

**預估工時**：2-3 小時

---

### 4.3 🟡 P1: FeatureCard.tsx (重新設計)
**路徑**：`components/home/FeatureCard.tsx`

**功能**：
- 首頁四大特色卡片（重新設計以符合目標網站）
- 4 張卡片內容：
  1. 系統化課程設計
  2. 實戰導向學習
  3. 活躍社群支援
  4. 技能評級系統
- 每張卡片包含：
  - 特色圖示（大尺寸）
  - 標題
  - 描述文字（2-3 行）
  - Hover 效果（卡片浮起或發光）

**UI 設計**：
```
┌────────────────┐
│                │
│     [圖示]      │
│                │
│   特色標題      │
│                │
│  描述文字...    │
│  描述文字...    │
│                │
└────────────────┘
```

**技術需求**：
- Card 元件擴展
- Hover 動畫效果
- 圖示系統（Lucide 或自訂 SVG）

**預估工時**：2-3 小時

---

## 5. 用戶與帳號元件

### 5.1 🟡 P1: AccountBinding.tsx (完整版)
**路徑**：`components/user/AccountBinding.tsx`

**功能**：
- 完整的帳號綁定管理 UI
- 支援的平台：
  - Discord（顯示用戶名與頭像）
  - GitHub（顯示用戶名與頭像）
  - LINE（主要登入帳號）
- 每個平台顯示：
  - 平台圖示
  - 綁定狀態（已綁定/未綁定）
  - 綁定的帳號資訊（如已綁定）
  - 綁定/解除綁定按鈕
- 權限與隱私說明

**UI 設計**：
```
帳號綁定
┌────────────────────────────────┐
│ Discord                         │
│ [Discord圖示] waterball#1234    │
│ 已綁定於 2025-01-15             │
│ [解除綁定]                      │
├────────────────────────────────┤
│ GitHub                          │
│ [GitHub圖示] 尚未綁定            │
│ [綁定 GitHub]                   │
├────────────────────────────────┤
│ LINE                            │
│ [LINE圖示] 水球潘               │
│ 主要登入帳號                    │
└────────────────────────────────┘
```

**技術需求**：
- OAuth 流程 UI（R2 預留整合）
- 綁定狀態管理（Context 或 API）
- 確認 Modal（解除綁定確認）

**預估工時**：4-5 小時

---

### 5.2 🟢 P2: SocialConnect.tsx
**路徑**：`components/user/SocialConnect.tsx`

**功能**：
- 社群帳號連結管理（可能與 AccountBinding 整合）
- 顯示所有已連結的社群平台
- 一鍵分享功能（分享學習成果到社群）

**技術需求**：
- 社群分享 API 整合（預留）
- 平台圖示庫

**預估工時**：2-3 小時

---

## 6. 通知系統元件

### 6.1 🟡 P1: NotificationBell.tsx
**路徑**：`components/notification/NotificationBell.tsx`

**功能**：
- 通知鈴鐺圖示（位於 TopBar）
- 顯示未讀通知數量（紅點徽章）
- 點擊展開通知下拉列表
- Hover 提示「通知」

**UI 設計**：
```
  🔔  ← 鈴鐺圖示
   3  ← 未讀數量紅點
```

點擊後：
```
┌────────────────────────────┐
│ 通知                    [全部已讀] │
├────────────────────────────┤
│ ● 你有新的課程更新          │
│   2 小時前                 │
├────────────────────────────┤
│ ○ 你完成了副本一            │
│   1 天前                   │
├────────────────────────────┤
│ [查看所有通知]              │
└────────────────────────────┘
```

**技術需求**：
- Dropdown 元件整合
- 未讀計數邏輯
- 點擊外部關閉

**預估工時**：3-4 小時

---

### 6.2 🟢 P2: NotificationList.tsx
**路徑**：`components/notification/NotificationList.tsx`

**功能**：
- 通知項目列表（NotificationBell 下拉內容）
- 每個通知項目包含：
  - 通知類型圖示（課程更新、成就獲得、系統通知...）
  - 通知標題與簡述
  - 時間戳記（相對時間：「2 小時前」）
  - 已讀/未讀狀態（視覺區分）
- 批次操作：
  - 全部已讀按鈕
  - 清除所有通知
- 查看所有通知連結（跳轉到通知頁面）

**技術需求**：
- 虛擬滾動（如通知很多）
- 已讀/未讀狀態管理
- 時間格式化（相對時間）

**預估工時**：3-4 小時

---

## 7. 其他輔助元件

### 7.1 🟢 P2: CoursePurchaseModal.tsx
**路徑**：`components/purchase/CoursePurchaseModal.tsx`

**功能**：
- 課程購買確認 Modal
- 顯示：
  - 課程資訊摘要
  - 定價資訊（原價、優惠價、折價券）
  - 付款方式選擇 UI（預留 R2 整合）
  - 折價券輸入框
  - 總金額計算
  - 確認購買按鈕
- 購買成功後跳轉到訂單確認頁

**UI 設計**：
```
課程購買
┌────────────────────────────┐
│ [縮圖] 軟體設計模式精通之旅   │
│                            │
│ 原價: NT$ 12,000           │
│ 優惠價: NT$ 6,000          │
│ 折價券: -NT$ 3,000         │
│ ───────────────────        │
│ 總計: NT$ 3,000            │
│                            │
│ 折價券碼: [________]  [套用] │
│                            │
│ 付款方式:                  │
│ ○ 信用卡                   │
│ ○ ATM 轉帳                 │
│                            │
│ [取消] [確認購買]           │
└────────────────────────────┘
```

**技術需求**：
- Modal 元件擴展
- 價格計算邏輯
- 折價券驗證（預留 API）
- 付款流程 UI（預留整合）

**預估工時**：5-6 小時

---

### 7.2 🟢 P2: ConsultationBookingForm.tsx
**路徑**：`components/booking/ConsultationBookingForm.tsx`

**功能**：
- 1v1 諮詢預約表單（課程詳情頁「預約 1v1 諮詢」按鈕觸發）
- 表單欄位：
  - 姓名（自動填入）
  - Email（自動填入）
  - 電話號碼
  - 希望諮詢時間（日期+時段選擇）
  - 諮詢主題（下拉選單）
  - 問題描述（文字框）
- 提交後顯示成功訊息

**技術需求**：
- 表單驗證（useForm hook）
- 日期時間選擇器
- API 提交接口（預留）

**預估工時**：4-5 小時

---

## 8. 元件優先級總結

### 第一週必做（P0 - 最高優先級）

| 元件 | 工時 | 累計 |
|------|------|------|
| VerticalSidebar.tsx | 4-6h | 6h |
| TopBar.tsx | 2-3h | 9h |
| PromotionalBanner.tsx | 2-3h | 12h |
| JourneySwitcher.tsx | 3-4h | 16h |
| OwnershipBadge.tsx | 1-2h | 18h |
| DiscountBanner.tsx | 2-3h | 21h |
| FounderProfile.tsx | 3-4h | 25h |

**小計**：25 小時（約 3-4 個工作天）

---

### 第二週建議（P1 - 高優先級）

| 元件 | 工時 | 累計 |
|------|------|------|
| CertificateCard.tsx | 3-4h | 4h |
| CourseInfoBadges.tsx | 1-2h | 6h |
| ChapterAccordion.tsx | 4-5h | 11h |
| OrderHistory.tsx | 4-5h | 16h |
| FeaturedCourses.tsx | 2-3h | 19h |
| FeatureCard.tsx | 2-3h | 22h |
| AccountBinding.tsx | 4-5h | 27h |
| NotificationBell.tsx | 3-4h | 31h |

**小計**：31 小時（約 4 個工作天）

---

### 第三週選做（P2 - 中優先級）

| 元件 | 工時 | 累計 |
|------|------|------|
| MobileDrawer.tsx | 3-4h | 4h |
| OrderCard.tsx | 2-3h | 7h |
| PricingCard.tsx | 3-4h | 11h |
| SocialConnect.tsx | 2-3h | 14h |
| NotificationList.tsx | 3-4h | 18h |
| CoursePurchaseModal.tsx | 5-6h | 24h |
| ConsultationBookingForm.tsx | 4-5h | 29h |

**小計**：29 小時（約 3-4 個工作天）

---

## 9. 實作檢查清單

完成每個元件後，請確認：

- [ ] 元件檔案已建立在正確路徑
- [ ] TypeScript 型別定義完整（Props, State）
- [ ] 響應式設計完成（Mobile, Tablet, Desktop）
- [ ] 符合目標網站的視覺設計
- [ ] 已整合到相關頁面
- [ ] 基本功能測試通過
- [ ] 無 TypeScript 編譯錯誤
- [ ] 無 ESLint 警告
- [ ] 已更新 TODO.md 完成狀態

---

## 10. 依賴關係

### 元件依賴圖

```
MainLayout
  ├─ PromotionalBanner
  ├─ VerticalSidebar
  ├─ TopBar
  │   ├─ JourneySwitcher
  │   ├─ NotificationBell
  │   │   └─ NotificationList
  │   └─ UserMenu
  └─ Footer

HomePage
  ├─ FeaturedCourses
  ├─ FeatureCard (x4)
  └─ FounderProfile

CourseCard
  ├─ OwnershipBadge
  ├─ DiscountBanner
  └─ PricingCard

CourseDetailPage
  ├─ ChapterAccordion
  ├─ CertificateCard
  ├─ CourseInfoBadges
  └─ ConsultationBookingForm

CoursesPage
  └─ OrderHistory
      └─ OrderCard

UserProfilePage
  └─ AccountBinding
      └─ SocialConnect
```

### 實作建議順序

1. **佈局優先**：VerticalSidebar, TopBar, PromotionalBanner
2. **核心業務元件**：JourneySwitcher, OwnershipBadge, DiscountBanner
3. **首頁元件**：FounderProfile, FeaturedCourses, FeatureCard
4. **課程增強**：CertificateCard, ChapterAccordion, CourseInfoBadges
5. **訂單系統**：OrderHistory, OrderCard, PricingCard
6. **通知系統**：NotificationBell, NotificationList
7. **其他功能**：AccountBinding, ConsultationBookingForm, CoursePurchaseModal
8. **行動版**：MobileDrawer

---

## 總計

- **元件總數**：20 個
- **預估總工時**：85-110 小時
