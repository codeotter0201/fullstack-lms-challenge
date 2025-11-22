# 詳細頁面比較報告

**生成日期**: 2025-11-22
**目標網站**: https://world.waterballsa.tw/
**本地網站**: http://localhost:3003

---

## 執行摘要

### 完成度評估
- **整體相似度**: 25%
- **架構一致性**: 40%
- **視覺設計一致性**: 15%
- **功能完整性**: 30%

### 主要發現
1. 本地網站使用完全不同的設計系統（淺色主題 vs 深色主題）
2. 導航結構完全不同（左側邊欄 vs 頂部導航）
3. 課程卡片設計不符合目標網站
4. 排行榜頁面存在嚴重錯誤
5. 缺少關鍵頁面和組件

---

## 一、首頁比較

### 截圖路徑
- **目標網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/target-homepage-full.png`
- **本地網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/local-homepage-full.png`

### 1.1 佈局結構差異

#### 差異 #1: 導航結構完全不同
- **位置**: 全局導航
- **差異類型**: 🔴 高優先級 - 佈局結構
- **目標網站狀態**:
  - 左側垂直側邊欄（寬度約 280px）
  - Logo 在頂部
  - 導航項目垂直排列（首頁、課程、排行榜、所有單元、挑戰地圖、SOP 寶典）
  - 背景色: `#1A1D2E`（深色）
  - 選中項目有黃色背景 `#FFD700`
- **本地網站狀態**:
  - 左側垂直側邊欄（寬度約 200px）
  - Logo 樣式不同（"WaterBall ACADEMY" vs 水球圖標）
  - 導航項目相同但樣式不同
  - 背景色較淺
  - 選中項目黃色背景色調不同
- **修復建議**:
```tsx
// components/layout/Sidebar.tsx
// 修改側邊欄寬度和樣式
<aside className="w-[280px] bg-[#1A1D2E] min-h-screen fixed left-0 top-0">
  {/* Logo 區域 */}
  <div className="p-6">
    <Image src="/images/logo.png" alt="水球軟體學院" width={180} height={40} />
    <p className="text-white text-sm mt-2">WATERBALLSA.TW</p>
  </div>

  {/* 導航項目 */}
  <nav className="px-4">
    <NavItem
      href="/"
      icon="home"
      label="首頁"
      className="rounded-lg hover:bg-yellow-500 active:bg-yellow-500"
    />
    {/* ... 其他導航項 */}
  </nav>
</aside>
```

#### 差異 #2: 主內容區域配色方案
- **位置**: 主內容區
- **差異類型**: 🔴 高優先級 - 顏色
- **目標網站狀態**:
  - 背景色: `#0F1419`（極深藍黑色）
  - 主標題顏色: `#FFFFFF`
  - 副標題顏色: `#B8BACF`
  - 按鈕主色: `#FFD700`（金黃色）
  - 按鈕次要色: `transparent` with yellow border
- **本地網站狀態**:
  - 背景色: 較淺的深色
  - 主標題有黃色強調文字（"頂尖軟體工程師"）
  - 按鈕樣式不同
- **修復建議**:
```tsx
// tailwind.config.ts - 更新顏色系統
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#FFD700',
        dark: '#E6C200',
      },
      background: {
        primary: '#0F1419',
        secondary: '#1A1D2E',
        card: '#1E2330',
      },
      text: {
        primary: '#FFFFFF',
        secondary: '#B8BACF',
        muted: '#6B7280',
      }
    }
  }
}

// app/page.tsx - Hero Section
<section className="bg-background-primary py-20">
  <h1 className="text-5xl font-bold text-text-primary">
    歡迎來到水球軟體學院
  </h1>
  <p className="text-lg text-text-secondary mt-4">
    水球軟體學院提供最先進的軟體設計思路教材...
  </p>
</section>
```

#### 差異 #3: 頂部通知橫幅
- **位置**: 主內容區頂部
- **差異類型**: 🔴 高優先級 - 缺失元素
- **目標網站狀態**:
  - 橫幅位置: 緊接在頂部課程選擇器下方
  - 背景色: 深藍色 `#1E2330`
  - 文字: "將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！"
  - 按鈕: 黃色 "前往" 按鈕在右側
  - 有下劃線效果
- **本地網站狀態**:
  - 完全缺少此橫幅
- **修復建議**:
```tsx
// components/layout/PromoBanner.tsx
export function PromoBanner() {
  return (
    <div className="bg-[#1E2330] border-b-2 border-yellow-500 px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <p className="text-white text-base">
          將軟體設計精通之旅體驗課程的全部影片看完就可以獲得
          <span className="text-yellow-500 font-semibold"> 3000 元</span>
          課程折價券！
        </p>
        <button className="bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-400">
          前往
        </button>
      </div>
    </div>
  )
}
```

### 1.2 課程卡片差異

#### 差異 #4: 課程卡片設計完全不同
- **位置**: 首頁課程展示區
- **差異類型**: 🔴 高優先級 - 卡片設計
- **目標網站狀態**:
  - 卡片為橫向佈局（圖片在上，內容在下）
  - 兩個課程並排顯示
  - 第一個課程有黃色邊框高亮（已選中狀態）
  - 課程圖片佔卡片上半部（約 60%）
  - 課程標題: 白色，字體較大
  - 講師名稱: 黃色標籤 "水球潘"
  - 擁有狀態標籤: "尚未擁有"（灰色背景）
  - 課程描述: 灰白色文字
  - 底部特殊提示: 黃色背景 "你有一張 3,000 折價券"（僅第一個課程）
  - 雙按鈕設計: "試聽課程"（黃色實心） + "立刻購買"（黃色邊框）
- **本地網站狀態**:
  - 課程卡片完全缺失
  - 只有 "熱門課程" 標題和 "查看所有課程" 按鈕
  - 沒有實際的課程卡片展示
- **修復建議**:
```tsx
// components/course/CourseCardHero.tsx
interface CourseCardHeroProps {
  course: {
    id: string
    title: string
    instructor: string
    description: string
    imageUrl: string
    isOwned: boolean
    hasCoupon?: boolean
    couponAmount?: number
    canPreview?: boolean
  }
  isSelected?: boolean
}

export function CourseCardHero({ course, isSelected }: CourseCardHeroProps) {
  return (
    <div className={cn(
      "bg-[#1E2330] rounded-lg overflow-hidden transition-all",
      isSelected && "border-2 border-yellow-500"
    )}>
      {/* 課程圖片 */}
      <div className="relative h-[300px]">
        <Image
          src={course.imageUrl}
          alt={course.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 課程內容 */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-3">
          {course.title}
        </h3>

        <div className="flex items-center gap-3 mb-3">
          <span className="bg-yellow-500 text-black px-3 py-1 rounded text-sm font-semibold">
            {course.instructor}
          </span>
          <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded text-sm">
            {course.isOwned ? '已擁有' : '尚未擁有'}
          </span>
        </div>

        <p className="text-gray-400 mb-4">
          {course.description}
        </p>

        {/* 折價券提示 */}
        {course.hasCoupon && (
          <div className="bg-yellow-500 text-black px-4 py-2 rounded mb-4 font-semibold">
            你有一張 {course.couponAmount?.toLocaleString()} 折價券
          </div>
        )}

        {/* 按鈕組 */}
        <div className="flex gap-3">
          {course.canPreview && (
            <button className="flex-1 bg-yellow-500 text-black py-3 rounded font-semibold hover:bg-yellow-400">
              試聽課程
            </button>
          )}
          <button className="flex-1 border-2 border-yellow-500 text-yellow-500 py-3 rounded font-semibold hover:bg-yellow-500 hover:text-black">
            立刻購買
          </button>
        </div>
      </div>
    </div>
  )
}
```

#### 差異 #5: 功能區塊卡片
- **位置**: 首頁中段
- **差異類型**: 🟡 中優先級 - 內容差異
- **目標網站狀態**:
  - 4 個卡片橫向排列
  - 卡片標題: "軟體設計模式之旅課程", "水球潘的部落格", "直接與老師或是其他工程師交流", "技能評級及證書系統"
  - 每個卡片有圖標、標題、描述和 CTA 按鈕/連結
  - 背景色: 深色 `#1E2330`
  - 圓角設計
- **本地網站狀態**:
  - 4 個卡片也是橫向排列
  - 標題: "系統化課程", "實戰導向", "活躍社群", "成就認證"
  - 內容完全不同
  - 沒有 CTA 按鈕
- **修復建議**: 替換內容以匹配目標網站

#### 差異 #6: 講師介紹區塊
- **位置**: 首頁下方
- **差異類型**: 🟡 中優先級 - 內容和樣式
- **目標網站狀態**:
  - 左側: 大型講師照片（圓形或方形）
  - 右側:
    - 標題 "水球潘"
    - 描述文字
    - 5 個成就標籤，每個有圖標和文字，垂直排列
  - 背景色: 深色
- **本地網站狀態**:
  - 左側: 圓形頭像，黃色邊框，內有 "水" 字
  - 右側:
    - 標題 "水球潘"
    - 副標題 "水球軟體學院創辦人 & 資深架構師"
    - 描述文字不同
    - 4 個成就標籤橫向排列（不是垂直）
- **修復建議**: 調整佈局和內容以匹配目標

---

## 二、課程列表頁比較

### 截圖路徑
- **目標網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/target-courses-full.png`
- **本地網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/local-courses-full.png`

### 2.1 頁面結構差異

#### 差異 #7: 課程卡片佈局和設計
- **位置**: 課程列表主區域
- **差異類型**: 🔴 高優先級 - 卡片設計
- **目標網站狀態**:
  - 兩個課程卡片垂直排列（不是網格）
  - 卡片設計與首頁相同（橫向佈局）
  - 第一個課程:
    - 黃色邊框
    - 擁有狀態: "尚未擁有"
    - 折價券提示: "你有一張 3,000 折價券"
    - 雙按鈕: "試聽課程" + "立刻購買"
  - 第二個課程:
    - 無邊框
    - 擁有狀態: "尚未擁有"
    - 單按鈕: "僅限付費"（禁用） + "立刻購買"
- **本地網站狀態**:
  - 兩個課程卡片網格排列（2 列）
  - 卡片為垂直佈局
  - 標題: "物件導向設計模式", "Clean Code 整潔的程式碼"
  - 講師: "水球潘"（黃色標籤）
  - 描述文字較短
  - 單按鈕設計: "立刻購買" / "立刻購課"
  - 黃色邊框
  - 缺少擁有狀態和折價券信息
- **修復建議**:
```tsx
// app/courses/page.tsx
<div className="space-y-6"> {/* 垂直排列，不是 grid */}
  {courses.map(course => (
    <CourseCardHero key={course.id} course={course} />
  ))}
</div>
```

#### 差異 #8: 訂單記錄區塊
- **位置**: 課程列表頁底部
- **差異類型**: 🔴 高優先級 - 缺失功能
- **目標網站狀態**:
  - 在課程卡片下方有 "訂單紀錄" 區塊
  - 圖標: 收據圖標
  - 標題: "訂單紀錄"
  - 內容: "目前沒有訂單記錄"（空狀態）
  - 背景色: `#1E2330`
  - 圓角邊框
- **本地網站狀態**:
  - 完全缺少此區塊
- **修復建議**:
```tsx
// components/course/OrderHistory.tsx
export function OrderHistory() {
  return (
    <div className="bg-[#1E2330] rounded-lg p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <ReceiptIcon className="w-6 h-6 text-yellow-500" />
        <h3 className="text-xl font-bold text-white">訂單紀錄</h3>
      </div>
      <p className="text-gray-400 text-center py-8">
        目前沒有訂單記錄
      </p>
    </div>
  )
}
```

#### 差異 #9: 頁面標題和搜索欄
- **位置**: 頁面頂部
- **差異類型**: 🟡 中優先級 - UI 差異
- **目標網站狀態**:
  - 沒有頁面標題
  - 沒有搜索欄
  - 直接顯示課程卡片
- **本地網站狀態**:
  - 有白色背景區塊包含:
    - 副標題: "探索我們的課程，開始你的學習之旅"
    - 主標題: "所有課程"
    - 搜索框: "搜尋課程名稱、技能..."
  - 顯示 "共 2 門課程"
- **修復建議**: 移除標題區塊和搜索欄，直接顯示課程列表

---

## 三、排行榜頁比較

### 截圖路徑
- **目標網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/target-leaderboard-full.png`
- **本地網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/local-leaderboard-full.png`

### 3.1 嚴重錯誤

#### 差異 #10: 運行時錯誤
- **位置**: 排行榜頁面
- **差異類型**: 🔴 緊急 - 頁面崩潰
- **錯誤信息**:
  ```
  TypeError: entries.map is not a function
  at components/leaderboard/LeaderboardTable.tsx (85:22)
  ```
- **問題原因**: `entries` 不是數組，無法使用 `.map()` 方法
- **修復建議**:
```tsx
// components/leaderboard/LeaderboardTable.tsx
// 在使用 map 前檢查數據類型
{Array.isArray(entries) && entries.map((entry) => (
  <tr key={entry.userId}>
    {/* ... */}
  </tr>
))}

// 或者在數據獲取時確保返回數組
const entries = Array.isArray(data?.entries) ? data.entries : []
```

### 3.2 功能和設計差異

#### 差異 #11: Tab 切換設計
- **位置**: 排行榜頂部
- **差異類型**: 🟡 中優先級 - UI 設計
- **目標網站狀態**:
  - 兩個 Tab: "學習排行榜"（選中） 和 "本週成長榜"
  - Tab 樣式:
    - 選中: 黃色背景 `#FFD700`，黑色文字
    - 未選中: 透明背景，灰色文字
  - Tab 為圓角按鈕樣式
  - 橫向排列
- **本地網站狀態**:
  - 多個按鈕: "全球排行", "週排行", "月排行"
  - 另一組: "歷史", "經驗值"
  - 按鈕有圖標
  - 佈局不同
- **修復建議**: 簡化為兩個 Tab，使用黃色選中狀態

#### 差異 #12: 排行榜條目設計
- **位置**: 排行榜列表
- **差異類型**: 🔴 高優先級 - 卡片設計
- **目標網站狀態**:
  - 每個條目為深色卡片 `#1E2330`
  - 左側: 排名數字（大號白色）+ 用戶頭像（圓形）+ 用戶名（白色）+ 職稱（灰色小字）
  - 右側: 等級標籤（白色背景，如 "Lv.19"）+ 經驗值（大號白色數字）
  - 條目間有間距
  - 懸停效果
  - 前 30 名可見
  - 最底部有 "載入中..." 佔位符
- **本地網站狀態**:
  - 頁面崩潰，無法顯示
- **修復建議**: 修復數據結構並實現完整的卡片設計

---

## 四、課程詳情頁比較

### 截圖路徑
- **目標網站**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/target-journey-detail-full.png`

### 4.1 頁面結構

#### 差異 #13: 課程詳情頁完全缺失
- **位置**: `/journeys/[id]` 路由
- **差異類型**: 🔴 緊急 - 缺失頁面
- **目標網站狀態**:
  - URL: `/journeys/software-design-pattern`
  - 左側:
    - 課程標題: "軟體設計模式精通之旅"（大標題）
    - 課程描述: 三段文字介紹
    - 統計信息: "49 部影片" + "大量實戰題"
    - 雙按鈕: "立即加入課程" + "預約 1v1 諮詢"
    - 可摺疊的章節列表:
      - "課程介紹＆試聽"
      - "副本零：冒險者指引"
      - "副本一：行雲流水的設計底層思路"
      - "副本二：Christopher Alexander 設計模式"
      - "副本三：掌握所有複雜行為變動"
      - "副本四：規模化架構思維"
      - "副本五：生命週期及控制反轉"
  - 右側固定側邊欄:
    - 課程證書圖片
    - 標題: "課程證書"
    - "立即加入課程" 按鈕
    - 三個特性標籤:
      - 🌐 中文課程
      - 📱 支援行動裝置
      - 🎓 專業的完課認證
- **本地網站狀態**:
  - 此路由不存在
- **修復建議**: 創建完整的課程詳情頁面

```tsx
// app/journeys/[id]/page.tsx
export default function JourneyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex gap-8 max-w-7xl mx-auto py-8">
      {/* 左側主內容 */}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-white mb-4">
          軟體設計模式精通之旅
        </h1>

        {/* 描述段落 */}
        <div className="space-y-4 mb-6">
          <p className="text-gray-400">...</p>
        </div>

        {/* 統計信息 */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2">
            <VideoIcon />
            <span className="text-white">49 部影片</span>
          </div>
          <div className="flex items-center gap-2">
            <CodeIcon />
            <span className="text-white">大量實戰題</span>
          </div>
        </div>

        {/* 按鈕組 */}
        <div className="flex gap-4 mb-8">
          <button className="bg-yellow-500 text-black px-8 py-3 rounded-lg font-semibold">
            立即加入課程
          </button>
          <button className="border-2 border-yellow-500 text-yellow-500 px-8 py-3 rounded-lg font-semibold">
            預約 1v1 諮詢
          </button>
        </div>

        {/* 章節列表 */}
        <ChapterList chapters={chapters} />
      </div>

      {/* 右側側邊欄 */}
      <aside className="w-[400px]">
        <div className="bg-[#1E2330] rounded-lg p-6 sticky top-8">
          <Image
            src="/images/certificate.png"
            alt="Course Certificate"
            width={350}
            height={250}
            className="mb-4"
          />
          <h3 className="text-xl font-bold text-white mb-4">課程證書</h3>
          <button className="w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold mb-6">
            立即加入課程
          </button>

          <div className="space-y-3">
            <FeatureItem icon="🌐" text="中文課程" />
            <FeatureItem icon="📱" text="支援行動裝置" />
            <FeatureItem icon="🎓" text="專業的完課認證" />
          </div>
        </div>
      </aside>
    </div>
  )
}
```

---

## 五、共通元素比較

### 5.1 頂部導航欄

#### 差異 #14: 課程選擇器
- **位置**: 頂部中央
- **差異類型**: 🔴 高優先級 - 缺失組件
- **目標網站狀態**:
  - 下拉選擇器（combobox）
  - 顯示當前課程: "軟體設計模式精通之旅"
  - 有下拉箭頭圖標
  - 深色背景 `#1E2330`
  - 邊框樣式
  - 點擊可切換課程
- **本地網站狀態**:
  - 完全缺少
  - 頂部只有移動端的漢堡菜單按鈕
- **修復建議**:
```tsx
// components/layout/JourneySwitcher.tsx
<select className="bg-[#1E2330] text-white px-6 py-3 rounded-lg border border-gray-600 min-w-[300px]">
  <option value="software-design-pattern">軟體設計模式精通之旅</option>
  <option value="ai-bdd">AI x BDD：規格驅動全自動開發術</option>
</select>
```

#### 差異 #15: 登入按鈕
- **位置**: 頂部右側
- **差異類型**: 🟡 中優先級 - 樣式差異
- **目標網站狀態**:
  - 黃色背景按鈕 `#FFD700`
  - 黑色文字 "登入"
  - 圓角設計
  - 固定在右上角
- **本地網站狀態**:
  - 有類似按鈕但可能已登入狀態顯示 "登出"
- **修復建議**: 確保未登入時顯示黃色 "登入" 按鈕

### 5.2 Footer

#### 差異 #16: Footer 設計完全不同
- **位置**: 頁面底部
- **差異類型**: 🟡 中優先級 - 內容和設計
- **目標網站狀態**:
  - 極簡設計
  - 中央顯示 Logo
  - 社交媒體連結（Line, Facebook, Discord, Youtube, 社群卡片）橫向排列
  - 底部連結: "隱私權政策", "服務條款", 客服信箱
  - 版權信息: "© 2025 水球球特務有限公司"
  - 深色背景
- **本地網站狀態**:
  - 複雜的多列佈局
  - 左側: Logo + 描述 + 社交媒體圖標
  - 四列連結: "平台", "資源", "支援", "法律"
  - 每列多個連結
  - 底部: 版權信息 + 語言/地區選擇器
- **修復建議**: 簡化為目標網站的極簡設計

---

## 六、技術問題總結

### 6.1 數據結構問題
1. 排行榜數據不是數組格式
2. 課程數據結構可能不完整
3. Mock 數據與實際需求不匹配

### 6.2 路由問題
1. 缺少 `/journeys/[id]` 路由
2. 課程詳情頁面不存在

### 6.3 組件缺失
1. CourseCardHero（首頁課程卡片）
2. PromoBanner（折價券橫幅）
3. JourneySwitcher（課程選擇器）
4. OrderHistory（訂單記錄）
5. ChapterList（章節列表，可摺疊）
6. LeaderboardEntry（排行榜條目卡片）

---

## 七、優先級修復建議

### 🔴 緊急修復（1-2 天）
1. **修復排行榜頁面崩潰** - TypeError: entries.map is not a function
2. **創建課程詳情頁面** - `/journeys/[id]` 路由完全缺失
3. **修復配色方案** - 從淺色改為深色主題
4. **修復側邊欄樣式** - 寬度、Logo、選中狀態

### 🟡 高優先級修復（3-5 天）
5. **重新設計課程卡片** - 橫向佈局，雙按鈕，折價券提示
6. **添加頂部橫幅** - 折價券宣傳橫幅
7. **添加課程選擇器** - 頂部下拉選擇器
8. **添加訂單記錄區塊** - 課程頁底部
9. **修復排行榜 Tab 和條目設計**

### 🟢 中優先級修復（1 週）
10. **簡化 Footer** - 改為極簡設計
11. **調整功能區塊內容** - 首頁中段 4 個卡片
12. **優化講師介紹區塊** - 佈局和內容
13. **移除不必要的頁面標題** - 課程頁

---

## 八、設計規範文檔

### 8.1 顏色系統
```scss
// 主色調
$primary: #FFD700;        // 金黃色 - 按鈕、強調
$primary-dark: #E6C200;   // 深金黃 - hover 狀態

// 背景色
$bg-primary: #0F1419;     // 極深藍黑 - 主背景
$bg-secondary: #1A1D2E;   // 深藍 - 側邊欄
$bg-card: #1E2330;        // 深藍 - 卡片背景

// 文字色
$text-primary: #FFFFFF;   // 白色 - 主文字
$text-secondary: #B8BACF; // 灰白 - 副文字
$text-muted: #6B7280;     // 灰色 - 輔助文字

// 邊框色
$border-primary: #FFD700; // 黃色邊框
$border-secondary: #374151; // 灰色邊框
```

### 8.2 間距系統
```scss
// 卡片間距
$card-gap: 24px;          // 卡片之間的間距
$card-padding: 24px;      // 卡片內邊距

// 區塊間距
$section-gap: 64px;       // 大區塊間距
$section-padding-y: 48px; // 區塊上下內邊距

// 元素間距
$element-gap-sm: 8px;     // 小間距
$element-gap-md: 16px;    // 中間距
$element-gap-lg: 24px;    // 大間距
```

### 8.3 圓角系統
```scss
$radius-sm: 4px;          // 小圓角
$radius-md: 8px;          // 中圓角（按鈕）
$radius-lg: 12px;         // 大圓角（卡片）
$radius-xl: 16px;         // 超大圓角
$radius-full: 9999px;     // 完全圓形（頭像）
```

### 8.4 字體系統
```scss
// 標題
$font-size-h1: 36px;      // 主標題
$font-size-h2: 28px;      // 次標題
$font-size-h3: 24px;      // 三級標題

// 正文
$font-size-base: 16px;    // 正文
$font-size-sm: 14px;      // 小字
$font-size-xs: 12px;      // 極小字

// 字重
$font-weight-normal: 400;
$font-weight-semibold: 600;
$font-weight-bold: 700;
```

---

## 九、截圖索引

所有截圖保存在：`/Users/ender/workspace/fullstack-lms-challenge/frontend/.playwright-mcp/`

1. `target-homepage-full.png` - 目標網站首頁（完整頁面）
2. `local-homepage-full.png` - 本地網站首頁（完整頁面）
3. `target-courses-full.png` - 目標網站課程頁（完整頁面）
4. `local-courses-full.png` - 本地網站課程頁（完整頁面）
5. `target-leaderboard-full.png` - 目標網站排行榜（完整頁面）
6. `local-leaderboard-full.png` - 本地網站排行榜（錯誤頁面）
7. `target-journey-detail-full.png` - 目標網站課程詳情（完整頁面）

---

## 十、結論

### 主要問題
1. **設計系統不一致** - 顏色、間距、字體都與目標網站不符
2. **關鍵頁面缺失** - 課程詳情頁完全不存在
3. **嚴重錯誤** - 排行榜頁面崩潰
4. **組件設計錯誤** - 課程卡片、導航欄、Footer 都與目標不符

### 估算工作量
- **緊急修復**: 2 個工作日
- **高優先級修復**: 5 個工作日
- **中優先級修復**: 7 個工作日
- **總計**: 約 14 個工作日（約 2-3 週）

### 建議執行順序
1. Week 1: 修復崩潰和缺失頁面 + 配色系統
2. Week 2: 重新設計課程卡片和排行榜
3. Week 3: 優化細節和調整內容

---

**報告結束**
