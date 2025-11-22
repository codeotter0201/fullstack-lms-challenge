# UI 元件規格文檔

本文件詳細定義所有 UI 元件的規格、Props、使用方式與視覺呈現。

---

## 目錄

1. [基礎 UI 元件](#基礎-ui-元件)
2. [Layout 佈局元件](#layout-佈局元件)
3. [課程相關元件](#課程相關元件)
4. [用戶相關元件](#用戶相關元件)
5. [排行榜元件](#排行榜元件)

---

## 基礎 UI 元件

### Button (按鈕)

**檔案路徑**: `components/ui/Button.tsx`

**用途**: 通用按鈕元件，支援多種樣式變體

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: ReactNode
}
```

**變體樣式**:

1. **Primary** (主要按鈕)
   - 背景: `bg-primary` (#FFD700)
   - 文字: `text-background-primary` (#1A1D2E)
   - Hover: `hover:bg-primary-dark`
   - 用途: 主要 CTA 按鈕 (立即加入、立刻購買)

2. **Secondary** (次要按鈕)
   - 背景: `bg-background-tertiary`
   - 文字: `text-text-primary`
   - Hover: `hover:bg-background-hover`
   - 用途: 次要操作 (預約諮詢、試聽課程)

3. **Outline** (外框按鈕)
   - 背景: 透明
   - 邊框: `border border-border-default`
   - 文字: `text-text-primary`
   - Hover: `hover:bg-background-hover`

4. **Ghost** (幽靈按鈕)
   - 背景: 透明
   - 文字: `text-text-secondary`
   - Hover: `hover:bg-background-hover`

**尺寸**:
- `sm`: padding `8px 16px`, text `text-sm`
- `md`: padding `12px 24px`, text `text-base`
- `lg`: padding `16px 32px`, text `text-lg`

**使用範例**:
```tsx
<Button variant="primary" size="lg" fullWidth>
  立即加入課程
</Button>

<Button variant="secondary" leftIcon={<CalendarIcon />}>
  預約 1v1 諮詢
</Button>
```

---

### Input (輸入框)

**檔案路徑**: `components/ui/Input.tsx`

**Props**:
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: string
  label?: string
  required?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}
```

**樣式規範**:
- 背景: `bg-background-tertiary`
- 邊框: `border border-border-default`
- 圓角: `rounded-md` (8px)
- Padding: `12px 16px`
- Focus: `focus:border-primary focus:ring-2 focus:ring-primary/20`

**錯誤狀態**:
- 邊框: `border-status-error`
- 錯誤訊息: 紅色文字顯示於輸入框下方

---

### Card (卡片)

**檔案路徑**: `components/ui/Card.tsx`

**Props**:
```typescript
interface CardProps {
  children: ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
}
```

**樣式規範**:
- 背景: `bg-background-secondary`
- 圓角: `rounded-xl` (16px)
- 陰影: `shadow-md`
- Hover (可選): `hover:shadow-lg hover:scale-[1.02] transition-all`

---

### Badge (徽章)

**檔案路徑**: `components/ui/Badge.tsx`

**Props**:
```typescript
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default'
  size?: 'sm' | 'md'
  children: ReactNode
}
```

**用途**: 狀態標籤、角色標籤、課程標籤

**變體樣式**:
- `success`: 綠色背景 `bg-status-success/20 text-status-success`
- `warning`: 橘色背景 `bg-status-warning/20 text-status-warning`
- `error`: 紅色背景 `bg-status-error/20 text-status-error`
- `info`: 藍色背景 `bg-status-info/20 text-status-info`

---

### Avatar (頭像)

**檔案路徑**: `components/ui/Avatar.tsx`

**Props**:
```typescript
interface AvatarProps {
  src?: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallback?: string  // 顯示首字母
}
```

**尺寸**:
- `xs`: 24px
- `sm`: 32px
- `md`: 40px
- `lg`: 48px
- `xl`: 64px

**樣式**: 圓形 `rounded-full`，有邊框 `border-2 border-background-tertiary`

---

### Dropdown (下拉選單)

**檔案路徑**: `components/ui/Dropdown.tsx`

**Props**:
```typescript
interface DropdownProps {
  trigger: ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

interface DropdownItem {
  label: string
  icon?: ReactNode
  onClick?: () => void
  href?: string
  divider?: boolean
}
```

**樣式規範**:
- 背景: `bg-background-secondary`
- 邊框: `border border-border-default`
- 圓角: `rounded-lg`
- 陰影: `shadow-lg`
- 項目 Hover: `hover:bg-background-hover`

**使用範例**:
```tsx
<Dropdown
  trigger={<Avatar src={user.pictureUrl} />}
  align="right"
  items={[
    { label: '個人檔案', icon: <UserIcon />, href: '/users/me/profile' },
    { label: '設定', icon: <SettingsIcon />, href: '/settings' },
    { divider: true },
    { label: '登出', icon: <LogoutIcon />, onClick: handleLogout },
  ]}
/>
```

---

### Modal (彈窗)

**檔案路徑**: `components/ui/Modal.tsx`

**Props**:
```typescript
interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnOverlayClick?: boolean
}
```

**樣式規範**:
- 遮罩: `bg-background-modal` (半透明黑色)
- 內容: `bg-background-secondary rounded-2xl`
- 動畫: Fade in/out, Scale up/down
- Z-Index: `z-modal` (1050)

---

### Toast (通知)

**檔案路徑**: `components/ui/Toast.tsx`

**Props**:
```typescript
interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number  // 毫秒
  onClose?: () => void
}
```

**使用場景**:
- 交付單元成功: "獲得 200 EXP!"
- 升級通知: "恭喜升級！現在是 Lv.5"
- 錯誤訊息: "操作失敗，請稍後再試"

**位置**: 畫面右上角，`position: fixed; top: 80px; right: 24px;`

---

### ProgressBar (進度條)

**檔案路徑**: `components/ui/ProgressBar.tsx`

**Props**:
```typescript
interface ProgressBarProps {
  value: number  // 0-100
  max?: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'success'
}
```

**樣式規範**:
- 背景: `bg-background-tertiary`
- 進度: `bg-primary` 或 `bg-status-success`
- 圓角: `rounded-full`
- 高度: sm(4px), md(8px), lg(12px)

**使用範例**:
```tsx
<ProgressBar value={75} showLabel color="primary" />
```

---

### Tabs (分頁)

**檔案路徑**: `components/ui/Tabs.tsx`

**Props**:
```typescript
interface TabsProps {
  items: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
}

interface TabItem {
  id: string
  label: string
  icon?: ReactNode
}
```

**樣式規範**:
- 未選中: `text-text-secondary`
- 選中: `text-primary border-b-2 border-primary`
- Hover: `hover:text-text-primary`

**使用場景**: 排行榜頁 (學習排行榜 / 本週成長榜)

---

## Layout 佈局元件

### Navbar (導航欄)

**檔案路徑**: `components/layout/Navbar.tsx`

**結構**:
```
[Logo] [課程下拉選單] [...] [前往挑戰] [通知] [用戶頭像]
```

**Props**:
```typescript
interface NavbarProps {
  user?: User | null
}
```

**樣式規範**:
- 高度: `64px`
- 背景: `bg-background-tertiary`
- 陰影: `shadow-sm`
- Position: `sticky top-0`
- Z-Index: `z-sticky`

**子元件**:

1. **Logo**
   - 圖片 + 文字 "水球軟體學院"
   - 連結到首頁 `/`

2. **課程下拉選單**
   - Combobox 顯示當前課程名稱
   - 下拉顯示所有課程列表
   - 點擊切換課程

3. **前往挑戰按鈕**
   - 藍色外框按鈕
   - 圖示 + 文字
   - 連結到 `/journeys/[slug]/roadmap`

4. **通知鈴鐺** (R1 僅外觀)
   - Icon button
   - 有紅點時顯示未讀數量
   - 點擊無反應 (R4 實作)

5. **用戶頭像下拉選單**
   - Avatar 元件
   - Dropdown 選單:
     - 個人檔案
     - 登出

**RWD 行為**:
- Desktop (≥1920px): 完整顯示所有項目
- Tablet/Mobile (<1920px): 隱藏部分項目，顯示漢堡選單

---

### Sidebar (側邊欄)

**檔案路徑**: `components/layout/Sidebar.tsx`

**用途**: 顯示課程章節與單元導航

**Props**:
```typescript
interface SidebarProps {
  journey: Journey
  currentLessonId?: number
}
```

**結構**:
- 章節列表 (Accordion)
  - 章節標題 + 展開/收合圖示
  - 單元列表
    - 單元圖示 (影片/文章/測驗)
    - 單元標題
    - 完成狀態 (○ / ✓)
    - 鎖定圖示 (付費課程)

**樣式規範**:
- 寬度: `280px` (Desktop)
- 背景: `bg-background-tertiary`
- Padding: `24px`
- Overflow: `overflow-y-auto`

**單元項目狀態**:
1. **未完成**: 無標記
2. **已完成未交付**: 可點擊的小圈圈 ○
3. **已交付**: ✓ 圖示 (綠色)
4. **鎖定**: 🔒 圖示 (灰色)

**RWD 行為**:
- Desktop: 固定在左側
- Tablet: 可透過按鈕切換顯示/隱藏
- Mobile: 抽屜式側邊欄，從左側滑入

---

### Footer (頁尾)

**檔案路徑**: `components/layout/Footer.tsx`

**結構**:
```
[社群連結] [隱私權政策 | 服務條款] [客服信箱]
[Logo + 公司名稱]
[版權聲明]
```

**社群連結**:
- Line
- Facebook
- Discord
- Youtube
- 社群卡片

**樣式規範**:
- 背景: `bg-background-tertiary`
- Padding: `48px 24px`
- 文字: `text-text-secondary`

**RWD 行為**: 堆疊佈局 (由左右排列變成上下排列)

---

### MobileDrawer (手機抽屜)

**檔案路徑**: `components/layout/MobileDrawer.tsx`

**Props**:
```typescript
interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}
```

**樣式規範**:
- 從左側滑入動畫
- 遮罩背景
- 寬度: `280px` 或 `80vw` (取較小值)
- Z-Index: `z-modal`

---

## 課程相關元件

### CourseCard (課程卡片)

**檔案路徑**: `components/course/CourseCard.tsx`

**Props**:
```typescript
interface CourseCardProps {
  journey: Journey
  owned: boolean
  onTrial?: () => void
  onPurchase?: () => void
}
```

**結構**:
```
[課程封面圖]
[課程標題]
[作者: 水球潘]
[課程描述]
[擁有狀態標籤 / 折價券提示]
[試聽按鈕 | 立刻購買按鈕]
```

**樣式規範**:
- Card 元件為基礎
- Hover 效果: `hover:scale-[1.02] transition-transform`
- 封面圖比例: `16:9`
- 黃色邊框高亮 (有折價券時)

**狀態顯示**:
- 尚未擁有: 黃色標籤 "尚未擁有"
- 已擁有: 無標籤
- 有折價券: 黃色背景區塊 "你有一張 3,000 折價券"

---

### ChapterList (章節列表)

**檔案路徑**: `components/course/ChapterList.tsx`

**Props**:
```typescript
interface ChapterListProps {
  chapters: Chapter[]
  journeySlug: string
  expandedChapters?: number[]
}
```

**功能**: Accordion 可展開/收合的章節列表

**樣式規範**:
- 章節標題: `text-lg font-semibold`
- 背景: `bg-background-secondary`
- 圓角: `rounded-lg`
- 展開動畫: Height transition

---

### LessonItem (課程單元項目)

**檔案路徑**: `components/course/LessonItem.tsx`

**Props**:
```typescript
interface LessonItemProps {
  lesson: Lesson
  journeySlug: string
  chapterId: number
  completed: boolean
  delivered: boolean
  locked: boolean
  active?: boolean
}
```

**結構**:
```
[單元圖示] [單元標題] [影片時長] [完成狀態] [鎖定圖示]
```

**單元圖示**:
- 影片: 播放圖示
- 文章: 文件圖示
- 測驗: 問號圖示

**完成狀態**:
- 未完成: 無標記
- 已完成未交付: ○ (可點擊的空心圓)
- 已交付: ✓ (實心綠色勾勾)

**樣式規範**:
- Hover: `hover:bg-background-hover`
- Active (當前單元): `bg-background-hover border-l-4 border-primary`
- Locked: `opacity-50 cursor-not-allowed`

---

### VideoPlayer (影片播放器)

**檔案路徑**: `components/course/VideoPlayer.tsx`

**Props**:
```typescript
interface VideoPlayerProps {
  videoUrl?: string
  youtubeId?: string
  onProgressUpdate?: (progress: number) => void
  initialProgress?: number
}
```

**功能** (R1 預留):
- YouTube IFrame 容器
- 播放控制 UI (預留)
- 進度追蹤 (預留每 10 秒更新)
- 斷點續播 (預留)

**樣式規範**:
- 比例: `16:9`
- 圓角: `rounded-lg`
- 背景: 黑色占位 `bg-black`

**R1 實作**: 僅顯示占位區域，標示「影片播放器 (預留 YouTube IFrame API 整合)」

---

### PaywallOverlay (付費鎖定遮罩)

**檔案路徑**: `components/course/PaywallOverlay.tsx`

**Props**:
```typescript
interface PaywallOverlayProps {
  show: boolean
  onUpgrade: () => void
}
```

**結構**:
```
[半透明黑色遮罩]
  [鎖定圖示]
  [標題: "此為付費課程"]
  [描述: "升級為付費會員即可觀看"]
  [升級按鈕]
```

**樣式規範**:
- 覆蓋整個影片區域
- 背景: `bg-black/70`
- 內容: 垂直置中
- 鎖定圖示: 大尺寸，黃色

---

### LessonComplete (單元完成按鈕)

**檔案路徑**: `components/course/LessonComplete.tsx`

**Props**:
```typescript
interface LessonCompleteProps {
  completed: boolean
  delivered: boolean
  onDeliver: () => void
  expReward: number
}
```

**狀態**:
1. **未完成** (progress < 100%): 不顯示
2. **已完成未交付**: 顯示可點擊的空心圓 ○
3. **已交付**: 顯示實心綠色勾勾 ✓，不可點擊

**點擊行為** (R1 預留):
- 顯示 Toast: "獲得 {expReward} EXP!"
- 更新用戶經驗值
- 檢查是否升級

---

## 用戶相關元件

### UserProfile (用戶檔案卡片)

**檔案路徑**: `components/user/UserProfile.tsx`

**Props**:
```typescript
interface UserProfileProps {
  user: User
  editable?: boolean
}
```

**結構**:
```
[頭像 (大)]
[暱稱]
[職業標籤]
[等級: Lv.{level}]
[經驗值進度條]
[{currentExp} / {nextLevelExp} EXP]
```

**樣式規範**:
- Card 元件為基礎
- 頭像: 64px, 置中
- 進度條: 顯示到下一級的進度

**編輯模式** (R1 僅 UI):
- 顯示編輯按鈕
- 點擊無反應 (R2 實作)

---

### AccountBinding (帳號綁定卡片)

**檔案路徑**: `components/user/AccountBinding.tsx`

**Props**:
```typescript
interface AccountBindingProps {
  discordBound: boolean
  githubBound: boolean
  onBindDiscord?: () => void
  onBindGithub?: () => void
}
```

**結構**:
```
[Discord]
  [圖示] [已綁定 / 未綁定]
  [解除綁定 / 立即綁定 按鈕]

[GitHub]
  [圖示] [已綁定 / 未綁定]
  [解除綁定 / 立即綁定 按鈕]
```

**樣式規範**:
- Card 元件為基礎
- 綁定狀態: 綠色文字 + 勾勾圖示
- 未綁定: 灰色文字

**R1 實作**: 僅顯示狀態，按鈕無功能

---

### LoginForm (登入表單)

**檔案路徑**: `components/auth/LoginForm.tsx`

**Props**:
```typescript
interface LoginFormProps {
  onSubmit: (credentials: LoginCredentials) => void
  loading?: boolean
  error?: string
}
```

**結構**:
```
[標題: 登入]
[Email 輸入框]
[Password 輸入框]
[忘記密碼連結]
[登入按鈕]
[分隔線]
[使用 Google 登入按鈕] (R1 僅 UI)
[使用 Facebook 登入按鈕] (R1 僅 UI)
```

**樣式規範**:
- Card 元件為基礎
- 最大寬度: `400px`
- 置中顯示

**R1 實作**: 僅 UI，按鈕無實際認證功能

---

## 排行榜元件

### LeaderboardTable (排行榜表格)

**檔案路徑**: `components/leaderboard/LeaderboardTable.tsx`

**Props**:
```typescript
interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  loading?: boolean
}
```

**結構**: 30 筆 LeaderboardEntry 元件的列表

**樣式規範**:
- 背景: `bg-background-secondary`
- 圓角: `rounded-lg`
- 項目間隔: `gap-2`

---

### LeaderboardEntry (排行榜項目)

**檔案路徑**: `components/leaderboard/LeaderboardEntry.tsx`

**Props**:
```typescript
interface LeaderboardEntryProps {
  entry: LeaderboardEntry
  rank: number
  isCurrentUser?: boolean
}
```

**結構**:
```
[排名] [頭像] [用戶名 + 職業] [...] [等級 Lv.{level}] [經驗值]
```

**排名樣式**:
- 前三名: 特殊樣式 (金銀銅色)
- 其他: 普通文字

**當前用戶**: 背景高亮 `bg-primary/10`

**樣式規範**:
- Hover: `hover:bg-background-hover`
- Padding: `16px`
- Cursor: `cursor-pointer`

---

### UserRankCard (當前用戶排名)

**檔案路徑**: `components/leaderboard/UserRankCard.tsx`

**Props**:
```typescript
interface UserRankCardProps {
  user: User
  rank: number
}
```

**位置**: 畫面底部固定

**結構**:
```
[你的排名: #{rank}] [頭像] [用戶名] [...] [Lv.{level}] [經驗值]
```

**樣式規範**:
- Position: `fixed bottom-0`
- 背景: `bg-background-tertiary`
- 寬度: 與 LeaderboardTable 相同
- 陰影: `shadow-lg`

---

## 元件開發優先級

1. **高優先級** (Phase 4-5):
   - Button, Input, Card, Avatar
   - Navbar, Sidebar, Footer

2. **中優先級** (Phase 6-8):
   - CourseCard, ChapterList, LessonItem
   - VideoPlayer, PaywallOverlay
   - UserProfile, LoginForm

3. **低優先級** (視時間而定):
   - Badge, Dropdown, Modal, Toast
   - LeaderboardTable, LeaderboardEntry
   - AccountBinding

---

## 注意事項

1. **元件可重用性**: 所有元件都應該是可重用的，避免硬編碼資料
2. **Props 型別**: 確保所有 Props 都有完整的 TypeScript 型別定義
3. **無障礙設計**: 使用語意化 HTML，添加適當的 ARIA 屬性
4. **RWD 考量**: 元件應在不同螢幕尺寸下正常顯示
5. **預留接口**: 需要後端整合的功能添加清楚的 TODO 註解

---

## 更新紀錄

- 2025-11-19: 建立元件規格文檔
