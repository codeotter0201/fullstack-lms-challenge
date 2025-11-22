# 元件庫使用指南

本文件提供完整的元件庫使用說明，幫助開發團隊統一使用現有元件，避免重複開發。

**最後更新**: 2025-11-21

---

## 📋 目錄

1. [元件庫概覽](#元件庫概覽)
2. [通用 UI 元件](#通用-ui-元件)
3. [Layout 佈局元件](#layout-佈局元件)
4. [課程相關元件](#課程相關元件)
5. [排行榜元件](#排行榜元件)
6. [用戶相關元件](#用戶相關元件)
7. [使用原則](#使用原則)
8. [擴展指南](#擴展指南)
9. [常見問題](#常見問題)

---

## 元件庫概覽

### 已實作元件總覽

| 分類 | 元件數量 | 狀態 |
|------|---------|------|
| 通用 UI 元件 | 16 個 | ✅ 已完成 |
| Layout 佈局元件 | 9 個 | ✅ 已完成 |
| 課程相關元件 | 6 個 | ✅ 已完成 |
| 排行榜元件 | 4 個 | ✅ 已完成 |
| 用戶相關元件 | 5 個 | ✅ 已完成 |
| **總計** | **40 個** | **✅ 已完成** |

### 設計系統

請參考 `docs/design-tokens.md` 了解完整的設計系統規範，包括：
- 色彩系統
- 字體系統
- 間距系統
- 陰影與圓角
- 動畫規範

---

## 通用 UI 元件

路徑: `components/ui/`

### 1. Button 按鈕

**用途**: 所有按鈕操作

**引入方式**:
```tsx
import { Button } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger' \| 'success'` | `'primary'` | 按鈕樣式 |
| size | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 按鈕尺寸 |
| disabled | `boolean` | `false` | 是否禁用 |
| loading | `boolean` | `false` | 載入狀態 |
| fullWidth | `boolean` | `false` | 是否全寬 |
| icon | `ReactNode` | - | 圖示 |
| iconPosition | `'left' \| 'right'` | `'left'` | 圖示位置 |
| onClick | `() => void` | - | 點擊事件 |

**使用範例**:
```tsx
// 基本使用
<Button onClick={() => console.log('clicked')}>
  點擊我
</Button>

// 不同變體
<Button variant="primary">主要按鈕</Button>
<Button variant="secondary">次要按鈕</Button>
<Button variant="outline">外框按鈕</Button>
<Button variant="ghost">幽靈按鈕</Button>
<Button variant="danger">危險按鈕</Button>

// 不同尺寸
<Button size="sm">小按鈕</Button>
<Button size="md">中按鈕</Button>
<Button size="lg">大按鈕</Button>

// 載入狀態
<Button loading>載入中...</Button>

// 帶圖示
<Button icon={<Plus className="w-4 h-4" />}>
  新增
</Button>

// 全寬按鈕
<Button fullWidth>全寬按鈕</Button>
```

---

### 2. Input 輸入框

**用途**: 文字輸入、表單欄位

**引入方式**:
```tsx
import { Input } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| type | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url'` | `'text'` | 輸入類型 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 輸入框尺寸 |
| placeholder | `string` | - | 佔位文字 |
| value | `string` | - | 受控值 |
| error | `string` | - | 錯誤訊息 |
| helperText | `string` | - | 輔助文字 |
| icon | `ReactNode` | - | 前置圖示 |
| suffix | `ReactNode` | - | 後置元素 |
| disabled | `boolean` | `false` | 是否禁用 |
| fullWidth | `boolean` | `false` | 是否全寬 |
| onChange | `(value: string) => void` | - | 變更事件 |

**使用範例**:
```tsx
// 基本使用
<Input
  placeholder="請輸入..."
  onChange={(value) => console.log(value)}
/>

// 帶錯誤訊息
<Input
  value={email}
  error="請輸入有效的 Email"
  onChange={setEmail}
/>

// 帶前置圖示
<Input
  icon={<Search className="w-4 h-4" />}
  placeholder="搜尋..."
/>

// 帶後置元素
<Input
  suffix={<X className="w-4 h-4 cursor-pointer" />}
  placeholder="可清除的輸入框"
/>

// 密碼輸入
<Input
  type="password"
  placeholder="請輸入密碼"
/>
```

---

### 3. Card 卡片

**用途**: 內容容器、課程卡片、用戶資訊卡片

**引入方式**:
```tsx
import { Card } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| variant | `'default' \| 'elevated' \| 'outline' \| 'flat'` | `'default'` | 卡片樣式 |
| hoverable | `boolean` | `false` | Hover 效果 |
| clickable | `boolean` | `false` | 可點擊 |
| padding | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 內距 |
| onClick | `() => void` | - | 點擊事件 |

**使用範例**:
```tsx
// 基本卡片
<Card>
  <h3>卡片標題</h3>
  <p>卡片內容</p>
</Card>

// 可點擊的卡片
<Card clickable hoverable onClick={() => navigate('/course/1')}>
  <h3>課程名稱</h3>
</Card>

// 不同樣式
<Card variant="elevated">浮起效果</Card>
<Card variant="outline">外框樣式</Card>
<Card variant="flat">扁平樣式</Card>
```

---

### 4. Badge 徽章

**用途**: 狀態標籤、數量標記

**引入方式**:
```tsx
import { Badge } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| variant | `'default' \| 'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | `'default'` | 徽章樣式 |
| size | `'sm' \| 'md' \| 'lg'` | `'md'` | 徽章尺寸 |
| rounded | `boolean` | `false` | 是否圓形 |

**使用範例**:
```tsx
// 不同狀態
<Badge variant="success">已完成</Badge>
<Badge variant="warning">進行中</Badge>
<Badge variant="danger">未開始</Badge>

// 圓形徽章（適合數字）
<Badge variant="primary" rounded>5</Badge>

// 不同尺寸
<Badge size="sm">小</Badge>
<Badge size="md">中</Badge>
<Badge size="lg">大</Badge>
```

---

### 5. Avatar 頭像

**用途**: 用戶頭像、課程作者頭像

**引入方式**:
```tsx
import { Avatar } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| src | `string` | - | 頭像 URL |
| alt | `string` | - | 替代文字 |
| size | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl'` | `'md'` | 頭像尺寸 |
| rounded | `boolean` | `true` | 是否圓形 |
| badge | `ReactNode` | - | 角標內容 |
| onClick | `() => void` | - | 點擊事件 |

**使用範例**:
```tsx
// 基本使用
<Avatar
  src={user.pictureUrl}
  alt={user.name}
/>

// 帶等級角標
<Avatar
  src={user.pictureUrl}
  alt={user.name}
  badge={<span className="text-xs">{user.level}</span>}
/>

// 不同尺寸
<Avatar src={url} alt="user" size="sm" />
<Avatar src={url} alt="user" size="lg" />
<Avatar src={url} alt="user" size="2xl" />
```

---

### 6. Modal 彈窗

**用途**: 對話框、確認框、表單彈窗

**引入方式**:
```tsx
import { Modal } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| open | `boolean` | - | 是否開啟 |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | `'md'` | 彈窗尺寸 |
| title | `string` | - | 標題 |
| closable | `boolean` | `true` | 顯示關閉按鈕 |
| maskClosable | `boolean` | `true` | 點擊遮罩關閉 |
| footer | `ReactNode` | - | 自訂 Footer |
| onClose | `() => void` | - | 關閉事件 |

**使用範例**:
```tsx
const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="確認刪除"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>
        取消
      </Button>
      <Button variant="danger" onClick={handleDelete}>
        刪除
      </Button>
    </>
  }
>
  <p>確定要刪除這個項目嗎？此操作無法復原。</p>
</Modal>
```

---

### 7. Dropdown 下拉選單

**用途**: 操作選單、用戶選單

**引入方式**:
```tsx
import { Dropdown } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| items | `DropdownItem[]` | - | 選單項目 |
| placement | `'bottom-start' \| 'bottom' \| 'bottom-end' \| 'top-start' \| 'top' \| 'top-end'` | `'bottom-start'` | 位置 |
| trigger | `'click' \| 'hover'` | `'click'` | 觸發方式 |

**使用範例**:
```tsx
const menuItems = [
  {
    key: 'edit',
    label: '編輯',
    icon: <Edit className="w-4 h-4" />,
    onClick: () => handleEdit(),
  },
  {
    key: 'delete',
    label: '刪除',
    danger: true,
    onClick: () => handleDelete(),
  },
]

<Dropdown items={menuItems}>
  <Button>操作</Button>
</Dropdown>
```

---

### 8. Toast 通知

**用途**: 操作回饋、錯誤提示

**引入方式**:
```tsx
import { Toast, ToastContainer } from '@/components/ui'
```

**使用方式**:
```tsx
// 1. 在 App 根組件加入 ToastContainer
<ToastContainer toasts={toasts} onRemove={removeToast} />

// 2. 使用 Toast Context (待實作) 或狀態管理
const showToast = (type, message) => {
  addToast({
    id: generateId(),
    type,
    message,
    duration: 3000,
  })
}

// 3. 呼叫
showToast('success', '儲存成功！')
showToast('error', '發生錯誤，請稍後再試')
```

---

### 9. ProgressBar 進度條

**用途**: 載入進度、完成度、經驗值

**引入方式**:
```tsx
import { ProgressBar } from '@/components/ui'
```

**Props**:
| 屬性 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| percentage | `number` | - | 百分比 (0-100) |
| showLabel | `boolean` | `false` | 顯示標籤 |
| color | `string` | - | 自訂顏色 |
| height | `number` | `8` | 高度 (px) |
| animated | `boolean` | `false` | 動畫效果 |
| striped | `boolean` | `false` | 條紋效果 |

**使用範例**:
```tsx
// 課程完成度
<ProgressBar percentage={75} showLabel />

// 經驗值條
<ProgressBar
  percentage={(currentExp / nextLevelExp) * 100}
  color="bg-gradient-to-r from-yellow-400 to-orange-500"
  height={12}
/>
```

---

### 10. Tabs 分頁

**用途**: 內容切換、分類顯示

**引入方式**:
```tsx
import { Tabs } from '@/components/ui'
```

**使用範例**:
```tsx
const tabs = [
  {
    key: 'overview',
    label: '概覽',
    content: <OverviewContent />,
  },
  {
    key: 'lessons',
    label: '課程內容',
    content: <LessonsContent />,
  },
  {
    key: 'reviews',
    label: '評價',
    content: <ReviewsContent />,
  },
]

<Tabs items={tabs} type="line" />
```

---

### 11. Select 下拉選擇

**用途**: 表單選擇、篩選器

**引入方式**:
```tsx
import { Select } from '@/components/ui'
```

**使用範例**:
```tsx
const options = [
  { value: 'all', label: '全部課程' },
  { value: 'free', label: '免費課程' },
  { value: 'premium', label: '付費課程' },
]

<Select
  options={options}
  placeholder="選擇課程類型"
  onChange={(value) => setFilter(value)}
  searchable
  clearable
/>
```

---

### 12. Checkbox 複選框

**用途**: 多選、同意條款

**引入方式**:
```tsx
import { Checkbox } from '@/components/ui'
```

**使用範例**:
```tsx
<Checkbox
  checked={agreed}
  onChange={setAgreed}
  label="我同意服務條款"
/>
```

---

### 13. FormField 表單欄位

**用途**: 包裝表單元件，提供標籤和錯誤提示

**引入方式**:
```tsx
import { FormField, Input } from '@/components/ui'
```

**使用範例**:
```tsx
<FormField
  label="Email"
  required
  error={errors.email}
  helperText="我們不會分享您的 Email"
>
  <Input
    type="email"
    value={email}
    onChange={setEmail}
  />
</FormField>
```

---

### 14. Spinner 載入動畫

**用途**: 載入狀態

**引入方式**:
```tsx
import { Spinner } from '@/components/ui'
```

**使用範例**:
```tsx
// 頁面載入
{loading && (
  <div className="flex justify-center py-12">
    <Spinner size="lg" />
  </div>
)}
```

---

### 15. Skeleton 骨架屏

**用途**: 內容載入佔位

**引入方式**:
```tsx
import { Skeleton } from '@/components/ui'
```

**使用範例**:
```tsx
<Skeleton
  loading={loading}
  avatar
  title
  rows={3}
>
  <UserProfile user={user} />
</Skeleton>
```

---

### 16. EmptyState 空狀態

**用途**: 無資料、404、空列表

**引入方式**:
```tsx
import { EmptyState } from '@/components/ui'
```

**使用範例**:
```tsx
<EmptyState
  icon={<Inbox className="w-16 h-16" />}
  title="還沒有課程"
  description="開始探索我們的課程，開啟學習之旅！"
  action={
    <Button onClick={() => navigate('/journeys')}>
      瀏覽課程
    </Button>
  }
/>
```

---

## Layout 佈局元件

路徑: `components/layout/`

### 1. MainLayout 主佈局

**用途**: 所有頁面的基礎佈局

**引入方式**:
```tsx
import { MainLayout } from '@/components/layout'
```

**使用範例**:
```tsx
export default function Page() {
  return (
    <MainLayout>
      {/* 頁面內容 */}
    </MainLayout>
  )
}

// 不顯示 Footer
<MainLayout showFooter={false}>
  {/* 內容 */}
</MainLayout>
```

---

### 2. Container 容器

**用途**: 限制內容寬度

**引入方式**:
```tsx
import { Container } from '@/components/layout'
```

**使用範例**:
```tsx
<Container size="lg">
  {/* 內容會被限制在 max-w-7xl */}
</Container>

// 不同尺寸
<Container size="sm">窄容器</Container>
<Container size="md">中容器</Container>
<Container size="lg">寬容器</Container>
<Container size="xl">超寬容器</Container>
<Container size="full">全寬</Container>
```

---

### 3. PageHeader 頁面標題

**用途**: 頁面頂部標題區

**引入方式**:
```tsx
import { PageHeader } from '@/components/layout'
```

**使用範例**:
```tsx
<PageHeader
  title="軟體設計模式"
  subtitle="課程"
  description="學習經典的軟體設計模式，提升你的物件導向設計能力"
  breadcrumb={[
    { label: '課程', href: '/journeys' },
    { label: '軟體設計模式' },
  ]}
  actions={
    <Button variant="primary">
      開始學習
    </Button>
  }
/>
```

---

### 4. Section 區塊

**用途**: 組織頁面內容區塊

**引入方式**:
```tsx
import { Section } from '@/components/layout'
```

**使用範例**:
```tsx
<Section
  title="熱門課程"
  subtitle="最多人學習"
  action={
    <Button variant="ghost">查看全部</Button>
  }
  spacing="lg"
  background="white"
>
  <CourseList courses={popularCourses} />
</Section>
```

---

### 5. Breadcrumb 麵包屑

**用途**: 導航路徑

**引入方式**:
```tsx
import { Breadcrumb } from '@/components/layout'
```

**使用範例**:
```tsx
<Breadcrumb
  items={[
    { label: '課程', href: '/journeys' },
    { label: '軟體設計模式', href: '/journeys/1' },
    { label: '單元 1' },
  ]}
/>
```

---

### 6. Sidebar 側邊欄

**用途**: 課程章節列表、導航選單

**引入方式**:
```tsx
import { Sidebar } from '@/components/layout'
```

**使用範例**:
```tsx
const sidebarItems = [
  {
    id: 1,
    label: '第一章：創建型模式',
    active: true,
    children: [
      {
        id: 1,
        label: '單例模式',
        completed: true,
      },
      {
        id: 2,
        label: '工廠模式',
        active: true,
      },
      {
        id: 3,
        label: '建造者模式',
        locked: true,
      },
    ],
  },
]

<Sidebar items={sidebarItems} />
```

---

### 7. Logo 標誌

**用途**: 品牌標誌

**引入方式**:
```tsx
import { Logo } from '@/components/layout'
```

**使用範例**:
```tsx
<Logo size="md" showText />
```

---

### 8. Navbar 導航列

**用途**: 頂部導航（自動包含在 MainLayout 中）

**說明**: 通常不需要單獨使用，已整合在 MainLayout 中

---

### 9. Footer 頁腳

**用途**: 頁面底部（自動包含在 MainLayout 中）

**說明**: 通常不需要單獨使用，已整合在 MainLayout 中

---

## 使用原則

### 1. 優先使用現有元件

**❌ 錯誤做法**:
```tsx
// 不要自己寫按鈕樣式
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  點擊我
</button>
```

**✅ 正確做法**:
```tsx
// 使用元件庫的 Button
import { Button } from '@/components/ui'

<Button variant="primary">點擊我</Button>
```

### 2. 使用設計系統的顏色

**❌ 錯誤做法**:
```tsx
<div className="bg-blue-500 text-white">
```

**✅ 正確做法**:
```tsx
<div className="bg-primary-500 text-white">
```

### 3. 保持一致的間距

**使用設計 Token**:
- `space-1` = 4px
- `space-2` = 8px
- `space-3` = 12px
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px

### 4. 響應式優先

**所有元件都應考慮行動版**:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 內容 */}
</div>
```

### 5. 無障礙性

- 使用語義化 HTML
- 提供 alt 文字
- 支援鍵盤導航
- 適當的 ARIA 標籤

---

## 擴展指南

### 何時需要建立新元件？

在以下情況考慮建立新元件：

1. **現有元件無法滿足需求**
   - 檢查是否可以透過組合現有元件實現
   - 檢查是否可以透過 props 擴展現有元件

2. **元件會被重複使用 3 次以上**
   - 一次性的 UI 不需要抽象成元件

3. **元件有獨立的業務邏輯**
   - 例如：CourseCard、LessonCard

### 建立新元件的步驟

1. **查看規範**
   - 檢查 `docs/component-specs.md`
   - 確認設計規範

2. **決定元件位置**
   - 通用元件 → `components/ui/`
   - 佈局元件 → `components/layout/`
   - 業務元件 → `components/course/`、`components/user/` 等

3. **定義 TypeScript 類型**
   - 在 `types/ui.ts` 或相應檔案定義 Props 介面

4. **實作元件**
   - 使用 `cn()` 合併 className
   - 支援 `className` prop 以便擴展
   - 添加適當的註解

5. **更新文檔**
   - 更新本文檔
   - 更新 `docs/component-specs.md`

6. **加入導出索引**
   - 在對應的 `index.ts` 導出新元件

### 元件開發範例

```tsx
/**
 * MyComponent 元件
 *
 * 元件用途說明
 */

import { cn } from '@/lib/utils'

interface MyComponentProps {
  // Props 定義
  title: string
  variant?: 'default' | 'primary'
  className?: string
  children?: ReactNode
}

export default function MyComponent({
  title,
  variant = 'default',
  className,
  children,
}: MyComponentProps) {
  return (
    <div
      className={cn(
        // 基礎樣式
        'rounded-lg p-4',

        // 變體樣式
        variant === 'primary' && 'bg-primary-500 text-white',
        variant === 'default' && 'bg-gray-100',

        // 自訂樣式
        className
      )}
    >
      <h3>{title}</h3>
      {children}
    </div>
  )
}
```

---

## 常見問題

### Q1: 為什麼我的 Tailwind CSS 樣式沒有作用？

**A**: 確保你的元件檔案在 `tailwind.config.ts` 的 `content` 路徑中：
```ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
]
```

### Q2: 如何自訂元件樣式？

**A**: 所有元件都接受 `className` prop：
```tsx
<Button className="mt-4 shadow-xl">
  自訂樣式按鈕
</Button>
```

### Q3: 如何在元件中使用圖示？

**A**: 專案使用 `lucide-react`：
```tsx
import { Search, User, Settings } from 'lucide-react'

<Button icon={<Search className="w-4 h-4" />}>
  搜尋
</Button>
```

### Q4: 元件的預設樣式可以修改嗎？

**A**: 可以，但建議：
1. 先檢查是否有對應的 props
2. 如果需要全域修改，更新元件檔案
3. 如果只是個別使用，使用 `className` 覆蓋

### Q5: 如何處理表單驗證？

**A**: 使用 Input 的 `error` prop：
```tsx
<Input
  value={email}
  onChange={setEmail}
  error={errors.email}
/>
```

表單驗證邏輯建議放在 Custom Hook 中（Phase 10）。

### Q6: Modal 如何管理開關狀態？

**A**: 使用 React state：
```tsx
const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>開啟</Button>

<Modal
  open={isOpen}
  onClose={() => setIsOpen(false)}
>
  內容
</Modal>
```

建議在 Context Providers 中統一管理全域 Modal。

### Q7: 如何實作 Toast 通知？

**A**: 使用 ToastContext 來管理全域通知：
```tsx
import { useToast } from '@/contexts/ToastContext'

const { showToast } = useToast()

showToast('success', '儲存成功！')
```

### Q8: 元件是否支援 Dark Mode？

**A**: 所有元件使用設計 Token，支援透過更新 `tailwind.config.ts` 中的顏色定義來切換主題。

---

## 工具函式

路徑: `lib/utils.ts`

### cn() - className 合併

```tsx
import { cn } from '@/lib/utils'

// 合併多個 className
cn('base-class', isActive && 'active-class', className)

// 物件形式
cn({
  'base-class': true,
  'active-class': isActive,
  'disabled-class': disabled,
})
```

### 格式化函式

```tsx
import {
  formatNumber,      // 1000 → "1,000"
  formatDuration,    // 125 → "2:05"
  formatDate,        // timestamp → "2025-11-19"
  formatRelativeTime, // timestamp → "2 天前"
  truncate,          // "Long text..." → "Long te..."
} from '@/lib/utils'
```

---

## 聯絡與支援

如有任何問題或建議：
1. 查看 `docs/page-specifications.md` 詳細規範
2. 查看 `docs/design-tokens.md` 設計系統
3. 查看 `docs/missing-components.md` 未實作元件清單

---

## 課程相關元件

路徑: `components/course/`

### CourseCard - 課程卡片

顯示課程縮圖、標題、技能標籤等資訊。

```tsx
import { CourseCard } from '@/components/course'

<CourseCard course={journey} />
```

### LessonCard - 課程單元卡片

顯示單元類型、進度、經驗值獎勵。

```tsx
import { LessonCard } from '@/components/course'

<LessonCard
  lesson={lesson}
  progress={progressMap[lesson.id]}
  locked={false}
/>
```

### ChapterList - 章節列表

可展開/收合的章節列表,支援密碼解鎖。

```tsx
import { ChapterList } from '@/components/course'

<ChapterList
  chapters={course.chapters}
  progressMap={progressMap}
/>
```

### SkillTag - 技能標籤

顯示課程相關技能標籤。

```tsx
import { SkillTag } from '@/components/course'

<SkillTag skill="TypeScript" />
```

### CourseProgress - 課程進度

圓形進度條顯示課程完成度。

```tsx
import { CourseProgress } from '@/components/course'

<CourseProgress percentage={75} size="lg" />
```

### VideoPlayer - 影片播放器

YouTube iframe 整合（R2 將加入完整 API）。

```tsx
import { VideoPlayer } from '@/components/course'

<VideoPlayer
  videoId={lesson.videoUrl}
  onProgress={(progress) => saveProgress(progress)}
  onComplete={() => handleComplete()}
/>
```

---

## 排行榜元件

路徑: `components/leaderboard/`

### LeaderboardTable - 排行榜表格

響應式排行榜（桌面：表格，行動：卡片）。

```tsx
import { LeaderboardTable } from '@/components/leaderboard'

<LeaderboardTable
  entries={leaderboardEntries}
  showStats={true}
  highlightCurrentUser={true}
/>
```

### RankCard - 排名卡片

單一用戶排名卡片。

```tsx
import { RankCard } from '@/components/leaderboard'

<RankCard
  entry={userRankEntry}
  showStats={true}
  highlighted={true}
/>
```

### TopRankers - 前三名領獎台

特殊的前三名展示（領獎台樣式）。

```tsx
import { TopRankers } from '@/components/leaderboard'

<TopRankers topThree={entries.slice(0, 3)} />
```

### LeaderboardFilter - 排行榜篩選器

排行榜類型、時間範圍、排序切換。

```tsx
import { LeaderboardFilter } from '@/components/leaderboard'

<LeaderboardFilter
  type={LeaderboardType.GLOBAL}
  timeRange={LeaderboardTimeRange.ALL_TIME}
  sortBy={LeaderboardSortBy.EXP}
  onTypeChange={setType}
  onTimeRangeChange={setTimeRange}
  onSortByChange={setSortBy}
/>
```

---

## 用戶相關元件

路徑: `components/user/`

### LevelBadge - 等級徽章

顯示用戶等級徽章。

```tsx
import { LevelBadge } from '@/components/user'

<LevelBadge
  level={user.level}
  size="md"
  variant="gradient"
  showIcon={false}
/>
```

**Props**:
- `level`: 用戶等級
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `variant`: 'default' | 'gradient' | 'outline'
- `showIcon`: 是否顯示星星圖標

### ExpBar - 經驗值條

顯示經驗值進度到下一等級。

```tsx
import { ExpBar } from '@/components/user'

<ExpBar
  currentExp={user.exp}
  nextLevelExp={user.nextLevelExp}
  level={user.level}
  showLabel={true}
  showLevel={true}
  size="md"
/>
```

**Props**:
- `currentExp`: 當前經驗值
- `nextLevelExp`: 升級所需經驗值
- `level`: 當前等級
- `showLabel`: 是否顯示「經驗值」標籤
- `showLevel`: 是否顯示等級轉換 (Lv.X → Lv.X+1)
- `size`: 'sm' | 'md' | 'lg'

### UserProfile - 用戶個人資料卡

完整的用戶資料展示卡片。

```tsx
import { UserProfile } from '@/components/user'

<UserProfile
  user={user}
  showExpBar={true}
  showStats={true}
  variant="card"
/>
```

**Props**:
- `user`: 用戶物件
- `showExpBar`: 是否顯示經驗值條
- `showStats`: 是否顯示統計資訊
- `variant`: 'card' | 'inline'

### UserStats - 用戶統計資訊

詳細的學習統計數據（9 項指標）。

```tsx
import { UserStats } from '@/components/user'

<UserStats
  stats={{
    totalExp: 5000,
    level: 12,
    lessonsCompleted: 45,
    lessonsInProgress: 3,
    gymsPassed: 8,
    gymsAttempted: 10,
    badges: 15,
    studyStreak: 7,
    totalStudyTime: 1250,
    avgLessonScore: 85,
    lastActive: Date.now(),
  }}
  layout="grid"
/>
```

**Props**:
- `stats`: 統計資料物件
- `layout`: 'grid' | 'list'

### AchievementCard - 成就卡片

顯示成就/徽章，支援稀有度、進度、鎖定狀態。

```tsx
import { AchievementCard, Achievement } from '@/components/user'

const achievement: Achievement = {
  id: '1',
  type: 'first_lesson',
  name: '初試啼聲',
  description: '完成第一個課程單元',
  rarity: 'common',
  earnedAt: Date.now(),
}

<AchievementCard
  achievement={achievement}
  size="md"
  locked={false}
  showProgress={true}
/>
```

**Props**:
- `achievement`: 成就物件
- `size`: 'sm' | 'md' | 'lg'
- `locked`: 是否鎖定（未解鎖）
- `showProgress`: 是否顯示進度條

**成就稀有度**:
- `common`: 普通（灰色）
- `rare`: 稀有（藍色）
- `epic`: 史詩（紫色）
- `legendary`: 傳說（金色）

