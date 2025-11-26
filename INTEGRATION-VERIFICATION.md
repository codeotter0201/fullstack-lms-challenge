# Frontend-Backend Integration Verification

## 驗證日期
2025-11-23

---

## ✅ 資料流程驗證

### 1. 首頁 (Homepage) - `/`
**檔案**: `frontend/app/page.tsx`

#### 資料來源驗證
```typescript
✅ Line 16: import { useJourney, useAuth } from '@/contexts'
✅ Line 23: const { journeys, loadJourneys } = useJourney()
✅ Line 27: loadJourneys() // 在 useEffect 中呼叫

✅ Line 36-49: 使用 journeys 資料渲染課程卡片
   - journeys.slice(0, 2) // 取前兩個課程
   - journey.id, journey.slug, journey.name, journey.description
```

#### 資料流程
```
用戶訪問首頁 (/)
    ↓
HomePage useEffect 觸發
    ↓
loadJourneys() 從 JourneyContext
    ↓
API: GET /api/courses
    ↓
Backend 回傳: CourseDTO[]
    ↓
transformCourseToJourney() 轉換
    ↓
更新 journeys state
    ↓
首頁重新渲染，顯示後端課程資料 ✅
```

#### 顯示內容
- ✅ 課程卡片 (前 2 個課程)
- ✅ 課程名稱 (`journey.name`)
- ✅ 課程描述 (`journey.description`)
- ✅ 課程圖片 (硬編碼路徑 + fallback)
- ✅ 課程連結 (`/journeys/${course.slug}`)

---

### 2. 課程列表頁 (Courses Page) - `/courses`
**檔案**: `frontend/app/courses/page.tsx`

#### 資料來源驗證
```typescript
✅ Line 13: import { useJourney } from '@/contexts'
✅ Line 16: const { journeys, loadJourneys, ownedJourneys } = useJourney()
✅ Line 19: loadJourneys() // 在 useEffect 中呼叫

✅ Line 23-35: 轉換所有 journeys 為 featuredCourses 格式
   - 使用完整的 journeys 陣列 (非 mock)
   - 檢查 ownedJourneys 決定 isOwned 狀態
```

#### 資料流程
```
用戶訪問課程列表頁 (/courses)
    ↓
CoursesPage useEffect 觸發
    ↓
loadJourneys() 從 JourneyContext
    ↓
API 1: GET /api/courses (獲取所有課程)
    ↓
API 2: GET /api/purchases/my-purchases (獲取購買記錄)
    ↓
計算 ownedJourneys (免費課程 + 已購買課程)
    ↓
更新 journeys 和 ownedJourneys state
    ↓
頁面重新渲染，顯示所有課程 + 擁有狀態 ✅
```

#### 顯示內容
- ✅ 所有課程卡片 (FeaturedCourses component)
- ✅ 課程名稱、描述、圖片
- ✅ 擁有狀態標記 (`isOwned`)
- ✅ 價格資訊 (硬編碼，待後端整合)
- ⚠️  訂單歷史 (Line 38: mockOrders = [] - 空陣列)

---

### 3. 課程詳情頁 (Journey Detail) - `/journeys/[slug]`
**檔案**: `frontend/app/journeys/[journeySlug]/page.tsx`

**需要檢查**: 此頁面是否正確使用 `loadJourney()` 而非 mock data

讓我檢查...

---

## 🔍 型別定義完整性驗證

### Journey Type
**檔案**: `frontend/types/journey.ts`

```typescript
✅ 新增欄位:
   - title?: string          // 後端主要欄位
   - name: string            // 向下兼容 (等同 title)
   - price?: number          // 後端價格
   - displayOrder?: number   // 後端排序
   - totalLessons?: number   // 後端單元數 (等同 videoCount)

✅ 支援向下兼容:
   - 現有 components 使用 journey.name ✓
   - 新 components 可使用 journey.title ✓
```

### Lesson Type
**檔案**: `frontend/types/journey.ts`

```typescript
✅ 新增欄位:
   - courseId?: number         // 後端課程 ID
   - title?: string            // 後端標題
   - experienceReward?: number // 後端經驗值
   - videoDuration?: number    // 後端時長 (秒)
   - displayOrder?: number     // 後端排序
   - content?: string          // 後端內容

✅ Progress 欄位 (from backend):
   - progressPercentage?: number
   - lastPosition?: number
   - isCompleted?: boolean
   - isSubmitted?: boolean

✅ 支援向下兼容:
   - journeyId (legacy) + courseId (new)
   - name (legacy) + title (new)
   - order (legacy) + displayOrder (new)
   - reward (object, legacy) + experienceReward (number, new)
   - videoLength (formatted) + videoDuration (seconds)
```

---

## 🧪 API 整合驗證

### JourneyContext API Calls
**檔案**: `frontend/contexts/JourneyContext.tsx`

#### loadJourneys()
```typescript
✅ Line 53: const response = await getJourneys()
✅ Line 68: const purchasesResponse = await getMyPurchases()
✅ Line 76-78: 計算 owned = 免費 + 已購買
✅ 移除所有 mock imports 和 setTimeout
```

**API 呼叫**:
- `GET /api/courses` ✅
- `GET /api/purchases/my-purchases` ✅

#### loadJourney(journeyId)
```typescript
✅ Line 106: const journeyResponse = await getJourney(journeyId)
✅ Line 118: const progressResponse = await getJourneyProgress(journeyId, user.id)
✅ 自動生成 chapters from lessons
```

**API 呼叫**:
- `GET /api/courses/{id}` ✅
- `GET /api/courses/{id}/lessons` ✅

---

## 🎯 Transformer 驗證

### Course Transformer
**檔案**: `frontend/lib/api/transformers/course.ts`

```typescript
✅ Line 17-46: transformCourseToJourney()
   - 設定 title 和 name (向下兼容)
   - 如有 lessons，自動生成 chapters
   - 使用 generateChaptersFromLessons()

✅ Line 53-54: transformLessonDTO()
   - 委託給 convertLessonDTOToLesson()
   - 統一使用 utility function
```

### Lesson Converter
**檔案**: `frontend/lib/utils/lessonConverter.ts`

```typescript
✅ convertLessonDTOToLesson() 完整實作
   - 欄位映射: title→name, courseId→journeyId
   - 格式轉換: videoDuration(秒)→videoLength("MM:SS")
   - 物件包裝: experienceReward→reward object
   - Progress 欄位直接保留

✅ formatVideoDuration() - 秒數轉 "MM:SS"
✅ extractYouTubeId() - URL→ID
✅ buildYouTubeUrl() - ID→URL
```

### Chapter Grouping
**檔案**: `frontend/lib/utils/chapterGrouping.ts`

```typescript
✅ generateChaptersFromLessons() 三種策略
   - fixed-size: 每 10 個 lessons 一章 (預設) ✓
   - smart: 根據標題前綴分組
   - single: 單一章節

✅ 虛擬 Chapter ID 生成
   - ID = courseId * 1000 + chapterNumber
   - 避免與真實 ID 衝突
```

---

## 📊 資料對照檢查

### Backend CourseDTO → Frontend Journey

| Backend 欄位 | Frontend 欄位 | 狀態 |
|-------------|--------------|------|
| `id` | `id` | ✅ 直接映射 |
| `title` | `title`, `name` | ✅ 雙欄位 |
| `description` | `description` | ✅ 直接映射 |
| `thumbnailUrl` | `thumbnailUrl`, `imageUrl` | ✅ 雙欄位 |
| `isPremium` | `isPremium` | ✅ 直接映射 |
| `totalLessons` | `totalLessons`, `videoCount` | ✅ 雙欄位 |
| `displayOrder` | `displayOrder` | ✅ 直接映射 |
| `price` | `price` | ✅ 新增欄位 |

### Backend LessonDTO → Frontend Lesson

| Backend 欄位 | Frontend 欄位 | 狀態 |
|-------------|--------------|------|
| `id` | `id` | ✅ 直接映射 |
| `courseId` | `courseId`, `journeyId` | ✅ 雙欄位 |
| `title` | `title`, `name` | ✅ 雙欄位 |
| `type` | `type` | ✅ 轉小寫 |
| `videoUrl` | `videoUrl` | ✅ 直接映射 |
| `videoDuration` | `videoDuration`, `videoLength` | ✅ 保留數字+格式化 |
| `experienceReward` | `experienceReward`, `reward` | ✅ 數字+物件 |
| `displayOrder` | `displayOrder`, `order` | ✅ 雙欄位 |
| `progressPercentage` | `progressPercentage` | ✅ 直接映射 |
| `lastPosition` | `lastPosition` | ✅ 直接映射 |
| `isCompleted` | `isCompleted` | ✅ 直接映射 |
| `isSubmitted` | `isSubmitted` | ✅ 直接映射 |

---

## ⚠️  需要進一步檢查的項目

### 1. 課程詳情頁資料來源
**檔案**: `frontend/app/journeys/[journeySlug]/page.tsx`

- [ ] 檢查是否使用 `loadJourney(journeyId)`
- [ ] 檢查是否移除 mock data imports
- [ ] 驗證 chapters 正確生成
- [ ] 驗證 lessons 正確顯示

### 2. 單元詳情頁
**檔案**: `frontend/app/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]/page.tsx`

- [ ] 檢查是否從 context 獲取 lesson 資料
- [ ] 檢查 video URL 來源
- [ ] 驗證 progress tracking

### 3. 圖片 URL 處理
**目前狀態**:
- 首頁使用硬編碼圖片路徑 (Line 31-34)
- 課程列表頁使用 `journey.imageUrl` (可能為空)

**建議**:
- [ ] 設定預設 placeholder 圖片
- [ ] 或使用後端 `thumbnailUrl` (如果有提供)

### 4. 訂單歷史整合
**檔案**: `frontend/app/courses/page.tsx`

```typescript
⚠️  Line 38: const mockOrders = []
```

**待整合**:
- [ ] 使用 `getMyPurchases()` 獲取真實訂單
- [ ] 轉換 PurchaseDTO 為 Order 格式
- [ ] 傳遞給 OrderHistory component

---

## ✅ 已驗證項目總結

### 資料來源
- ✅ 首頁使用 `useJourney` context
- ✅ 課程列表頁使用 `useJourney` context
- ✅ 移除 mock data imports (在 Context 層)
- ✅ 所有課程資料來自後端 API

### 型別定義
- ✅ Journey 型別支援後端欄位
- ✅ Lesson 型別支援後端欄位
- ✅ 向下兼容舊欄位名稱
- ✅ Progress 欄位完整定義

### API 整合
- ✅ JourneyContext 整合真實 API
- ✅ 自動 Bearer token 注入
- ✅ Purchase API 完整實作
- ✅ Transformer 使用 utility functions

### 資料轉換
- ✅ CourseDTO → Journey 轉換
- ✅ LessonDTO → Lesson 轉換
- ✅ Chapter 自動生成 (from flat lessons)
- ✅ 欄位映射完整 (title↔name, etc.)

---

## 🚀 測試建議

### 功能測試
1. **首頁顯示**
   ```bash
   1. 訪問 http://localhost:3000
   2. 確認顯示 2 個課程卡片
   3. 確認課程名稱來自後端
   4. 點擊課程卡片，導向正確的 /journeys/[slug]
   ```

2. **課程列表頁**
   ```bash
   1. 訪問 http://localhost:3000/courses
   2. 確認顯示所有課程
   3. 登入後確認 isOwned 狀態正確
   4. 確認免費課程和付費課程有區分
   ```

3. **購買流程** (如果實作)
   ```bash
   1. 登入用戶
   2. 訪問付費課程
   3. 點擊購買按鈕
   4. 確認購買成功後可存取課程
   ```

### API 測試
```bash
# 1. 測試 courses API
curl http://localhost:8080/api/courses | jq

# 2. 測試單一課程
curl http://localhost:8080/api/courses/1 | jq

# 3. 測試 lessons
curl http://localhost:8080/api/courses/1/lessons | jq

# 4. 測試購買記錄 (需 token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8080/api/purchases/my-purchases | jq
```

---

## 📝 待辦事項

### 高優先級
- [ ] 檢查課程詳情頁資料來源
- [ ] 檢查單元詳情頁資料來源
- [ ] 整合訂單歷史 (使用 getMyPurchases)
- [ ] 設定課程圖片 fallback

### 中優先級
- [ ] 完整 E2E 測試
- [ ] 錯誤處理 UI 優化
- [ ] Loading states 改善

### 低優先級
- [ ] Mock data 完全移除 (如果不再需要)
- [ ] 效能優化 (caching, debounce)
- [ ] SEO 優化 (metadata, og tags)

---

**驗證日期**: 2025-11-23
**驗證狀態**: ✅ 首頁和課程列表頁已確認使用後端資料
**下一步**: 檢查課程詳情頁和單元頁面
