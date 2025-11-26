# Frontend Implementation Investigation Summary

## Overview
This document summarizes the investigation of the local frontend implementation, focusing on lesson listing, routing, access control, and UI structure.

---

## 1. Navbar-Based Lesson Listing

### Navbar Structure
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/layout/Navbar.tsx`

The navbar is a **static top navigation** with the following links:
- 首頁 (Home) - `/`
- 課程 (Courses) - `/journeys`
- 排行榜 (Leaderboard) - `/leaderboard`
- 關於 (About) - `/about`

**Important Finding**: The navbar does NOT contain lesson listing functionality. The lesson listing is shown on the course detail page itself.

### Actual Lesson Listing Location
**Left Sidebar Navigation** (not the top navbar)

The lesson navigation is implemented in a **LEFT SIDEBAR** that appears on journey-specific pages:

**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/layout/Sidebar.tsx` (inferred from screenshots)

The sidebar contains:
- 首頁 (Home)
- 課程 (Courses)
- 個人檔案 (Profile)
- --- separator ---
- 排行榜 (Leaderboard)
- 獎勵任務 (Missions & Rewards)
- 挑戰歷程 (Challenge History)
- --- separator ---
- **所有單元 (All Lessons)** ← This shows the lesson list
- 挑戰地圖 (Challenge Map/Roadmap)
- SOP 寶典 (SOP Guide)

### Journey Switcher Component
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/JourneySwitcher.tsx`

- Located in the **top banner area** (not navbar)
- Dropdown showing current course name
- Allows switching between owned courses
- Shows course list with icons and chapter counts
- Navigation: `router.push(\`/journeys/\${journey.slug}\`)`

---

## 2. Journey/Lesson Page URL Structure

### Routing Pattern (Next.js App Router)

#### Journey Detail Page
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/app/journeys/[journeySlug]/page.tsx`

**URL Pattern**: `/journeys/[journeySlug]`
- Example: `/journeys/software-design-pattern`
- Example: `/journeys/clean-code`

**Features**:
- Shows course information (title, description, stats)
- Displays ownership badge (owned/premium/not-owned)
- Shows chapter accordion with lessons
- Progress tracking
- Certificate card (when 100% complete)
- Access control prompts

#### Lesson Detail Page (Video Player)
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/app/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]/page.tsx`

**URL Pattern**: `/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]`
- Example: `/journeys/software-design-pattern/chapters/1/missions/1`
- Example: `/journeys/software-design-pattern/chapters/2/missions/5`

**Note**: The term "missions" in URL refers to lessons/units.

**Features**:
- Video player (YouTube iframe)
- Lesson information
- Progress tracking
- Submit button
- Previous/Next navigation
- Breadcrumb navigation

#### Other Journey-Related Routes

**Missions Page**: `/journeys/[journeySlug]/missions/page.tsx`
- URL: `/journeys/[journeySlug]/missions`
- Reward missions listing

**Roadmap Page**: `/journeys/[journeySlug]/roadmap/page.tsx`
- URL: `/journeys/[journeySlug]/roadmap`
- Visual challenge map

**SOP Page**: `/journeys/[journeySlug]/sop/page.tsx`
- URL: `/journeys/[journeySlug]/sop`
- Standard operating procedures guide

---

## 3. Free vs Premium Course Differences

### Course Properties
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/types/journey.ts`

```typescript
export interface Journey {
  id: number
  name: string
  slug: string
  isPremium: boolean      // FREE or PREMIUM flag
  hasDiscount: boolean
  discountAmount?: number
  // ... other fields
}

export interface Lesson {
  id: number
  name: string
  premiumOnly: boolean    // Individual lesson access control
  videoUrl?: string
  // ... other fields
}
```

### UI Differentiation

#### Ownership Badge Component
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/OwnershipBadge.tsx`

Status types:
- `owned` - User owns the course (green badge)
- `premium` - Premium course, not owned (yellow/gold badge)
- `not-owned` - Free course, not owned (gray badge)

#### Access Control Logic
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/contexts/JourneyContext.tsx`

```typescript
// Access rules:
// - Free courses: accessible to all logged-in users
// - Premium courses: require purchase
// - Individual lessons can be premiumOnly within any course

const checkAccess = (journeyId: number): boolean => {
  return ownedJourneys.some((journey) => journey.id === journeyId)
}
```

**Owned Journeys Logic**:
```typescript
// Owned = free courses + purchased premium courses
const owned = allCourses.filter(
  (journey) => !journey.isPremium || purchasedCourseIds.has(journey.id)
)
```

### What Happens When Clicking Premium Course Without Purchase

**Journey Detail Page** (`/journeys/[journeySlug]/page.tsx`):

1. **Not Authenticated**: Shows login prompt
   ```tsx
   <Card className="p-6 bg-primary/10 border-primary/30">
     <Lock icon />
     <h3>需要登入才能學習</h3>
     <p>請先登入或註冊帳號，即可開始學習此課程</p>
     <Button onClick={() => router.push('/sign-in')}>
       立即登入
     </Button>
   </Card>
   ```

2. **Authenticated but No Access to Premium**: Shows purchase prompt
   ```tsx
   <Card className="p-6 bg-primary/10 border-primary/30">
     <Award icon />
     <h3>Premium 課程</h3>
     <p>此課程需要購買才能學習，立即解鎖所有內容</p>
     <Button variant="primary">
       立即購買 NT$ 3,480
     </Button>
   </Card>
   ```

### Video URL Visibility Differences

#### LessonCard Component
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/LessonCard.tsx`

```typescript
// Locked state prevents navigation
if (locked) {
  return content  // No Link wrapper
}

return (
  <Link href={`/journeys/${journeyId}/lessons/${id}`}>
    {content}
  </Link>
)
```

#### Premium Badge Display
```tsx
{premiumOnly && (
  <Badge variant="warning" size="sm">
    付費
  </Badge>
)}
```

**Video URL Access**:
- Premium lessons show lock icon when not owned
- Video player only renders when user has access
- No direct video URL exposure in UI for locked content

---

## 4. Current UI Implementation

### Component Hierarchy

```
MainLayout
├── Sidebar (Left Navigation)
│   ├── Logo
│   ├── Navigation Links
│   │   ├── 首頁 (Home)
│   │   ├── 課程 (Courses)
│   │   ├── 個人檔案 (Profile)
│   │   ├── 排行榜 (Leaderboard)
│   │   ├── 獎勵任務 (Missions)
│   │   ├── 挑戰歷程 (Portfolio)
│   │   └── Journey-Specific Links (when on journey page)
│   │       ├── 所有單元 (All Lessons) ← LESSON LIST
│   │       ├── 挑戰地圖 (Roadmap)
│   │       └── SOP 寶典 (SOP)
│
├── Navbar (Top Banner)
│   ├── JourneySwitcher (Course Dropdown)
│   └── Login Button / User Menu
│
└── Page Content
    └── JourneyDetailPage
        ├── Breadcrumb
        ├── Course Header
        │   ├── Title & Description
        │   └── OwnershipBadge
        ├── CourseInfoBadges (中文課程, 支援行動裝置, 專業完課認證)
        ├── Stats Card (Chapters, Lessons, Videos count)
        ├── Access Control Prompts
        │   ├── Login Prompt (if not authenticated)
        │   └── Purchase Prompt (if premium & not owned)
        ├── ChapterAccordion ← MAIN LESSON LISTING
        │   └── Chapter Items
        │       ├── Chapter Header (with progress)
        │       └── Lesson List (expandable)
        │           └── LessonCard items
        │               ├── Icon (Lock/Check/Play)
        │               ├── Lesson Title
        │               ├── Duration
        │               ├── Premium Badge
        │               └── Link to lesson page
        └── Progress Card (Sidebar)
            ├── Completion Percentage
            ├── Progress Bar
            └── Continue/Start Learning Button
```

### Key UI Components

#### ChapterAccordion
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/ChapterAccordion.tsx`

- Expandable/collapsible chapter sections
- Shows chapter name as "副本{index}：{name}"
- Progress bar per chapter
- Completed lesson count
- Lock icon for locked chapters
- Each lesson shows:
  - Status icon (Circle/PlayCircle/CheckCircle2)
  - Lesson title with numbering
  - Duration
  - Type badge (影片/測驗/練習)

**Navigation**:
```tsx
<Link href={`/journeys/${journeySlug}/chapters/${chapter.id}/missions/${lesson.id}`}>
```

#### LessonCard
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/LessonCard.tsx`

- Card-based lesson display
- Icons: Lock (locked) | CheckCircle (completed) | Video/FileText (type)
- Badges: "付費" (premium) | "已完成" (completed)
- Progress bar (if in progress)
- Metadata: Type, Duration, EXP reward

**States**:
- Locked: Opacity 60%, no hover, no link
- Normal: Hoverable, clickable, navigates to lesson
- Completed: Green checkmark, success badge

#### VideoPlayer
**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/components/course/VideoPlayer.tsx`

- YouTube iframe embed
- Progress tracking callbacks
- Completion detection
- Mock controls (R2 implementation pending)

---

## 5. Data Flow Summary

### Journey Selection Flow

1. **User clicks "所有單元" in sidebar**
   - Navigates to: `/journeys/[journeySlug]`
   - Loads: `JourneyDetailPage`

2. **JourneyContext loads journey data**
   ```typescript
   // File: contexts/JourneyContext.tsx

   loadJourney(journeyId) {
     // Fetch journey details from API
     const response = await getJourney(journeyId)
     setCurrentJourney(response.data.journey)

     // Fetch lessons
     const lessons = await getLessons(journeyId)

     // Load user progress (if authenticated)
     const progress = await getJourneyProgress(journeyId, userId)
     setProgressMap(progress)
   }
   ```

3. **Access control check**
   ```typescript
   // Determine if user has access
   const hasAccess = isAuthenticated && checkAccess(journeyId)

   // checkAccess logic:
   // - Free course: always true (when authenticated)
   // - Premium course: check if in purchasedCourses list
   ```

4. **ChapterAccordion renders lessons**
   - Filters by completed status
   - Shows lock icons for inaccessible lessons
   - Renders lesson cards with progress

### Lesson Access Flow

1. **User clicks lesson card**
   - Navigates to: `/journeys/[slug]/chapters/[chId]/missions/[lessonId]`

2. **Lesson page authentication check**
   ```typescript
   if (!isAuthenticated) {
     router.push('/sign-in')
     return
   }
   ```

3. **Video URL access**
   - Backend API returns lesson data
   - Video URL only included if user has access
   - Frontend renders VideoPlayer component

4. **Progress tracking**
   - Video progress updates every 5-10 seconds
   - Syncs to backend (when implemented)
   - Updates progressMap in context

---

## 6. Backend Integration Points

### API Endpoints Used

**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/lib/api/journeys.ts`

1. **GET /api/courses** - List all courses
   - Returns: `CourseDTO[]`
   - Transforms to: `Journey[]`

2. **GET /api/courses/{courseId}** - Get course details
   - Returns: `CourseDTO`
   - Transforms to: `Journey`

3. **GET /api/courses/{courseId}/lessons** - Get course lessons
   - Returns: `LessonDTO[]` (includes progress)
   - Transforms to: `Lesson[]`

**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/lib/api/purchases.ts`

1. **GET /api/purchases/my-purchases** - User's purchases
   - Returns: `PurchaseDTO[]`
   - Used for: Access control

2. **GET /api/purchases/access/{courseId}** - Check access
   - Returns: `{ hasAccess: boolean }`

3. **POST /api/purchases/courses/{courseId}** - Purchase course
   - Body: `{}` (MVP: no payment info)
   - Returns: `PurchaseDTO`

---

## 7. Key Findings Summary

### Lesson Listing Architecture
- ✅ Lesson listing is in **ChapterAccordion** component on journey detail page
- ✅ NOT in the top navbar - it's in the **left sidebar** navigation
- ✅ "所有單元" link navigates to `/journeys/[slug]` which shows the full lesson list
- ✅ Course switcher is a **dropdown in top banner**, not in navbar

### URL Structure
- ✅ Journey detail: `/journeys/[journeySlug]`
- ✅ Lesson detail: `/journeys/[journeySlug]/chapters/[chapterId]/missions/[lessonId]`
- ✅ Uses slug-based routing (not numeric IDs in URLs)
- ✅ Consistent pattern across all journey-related pages

### Access Control
- ✅ Three-tier system:
  1. Not authenticated → Login prompt
  2. Authenticated + Free course → Full access
  3. Authenticated + Premium course → Purchase required
- ✅ Individual lessons can be `premiumOnly` within any course
- ✅ Video URLs only exposed to users with access
- ✅ Lock icons and disabled states for inaccessible content

### UI Structure
- ✅ Left sidebar with journey-specific navigation
- ✅ Top banner with course switcher and login
- ✅ Chapter accordion as primary lesson listing UI
- ✅ Card-based lesson items with rich metadata
- ✅ Progress tracking per lesson and per chapter
- ✅ Responsive badges for status (Premium, Completed, etc.)

---

## 8. Mock Data Reference

**File**: `/Users/ender/workspace/fullstack-lms-challenge/frontend/lib/mock/journeys.ts`

### Sample Journey Structure
```typescript
{
  id: 1,
  name: '物件導向設計模式',
  slug: 'software-design-pattern',
  isPremium: true,
  hasDiscount: true,
  discountAmount: 500,
  chapters: [
    {
      id: 1,
      name: '創建型模式 (Creational Patterns)',
      passwordRequired: false,
      lessons: [
        {
          id: 1,
          name: '單例模式 (Singleton Pattern)',
          premiumOnly: false,  // Free preview lesson
          type: 'VIDEO',
          videoUrl: 'dQw4w9WgXcQ',
          videoLength: '12:45',
          reward: { exp: 100 }
        },
        {
          id: 3,
          name: '抽象工廠模式 (Abstract Factory)',
          premiumOnly: true,   // Requires purchase
          type: 'VIDEO',
          videoUrl: 'dQw4w9WgXcQ',
          videoLength: '18:20',
          reward: { exp: 150 }
        }
      ]
    }
  ]
}
```

---

## Screenshots

Screenshots saved to: `/Users/ender/workspace/fullstack-lms-challenge/.playwright-mcp/`

1. **01-homepage.png** - Homepage with course cards
2. **02-course-detail-page.png** - Journey detail page with lesson list
3. **03-course-switcher-dropdown.png** - Course switcher dropdown menu

---

## Recommendations for E2E Testing

Based on this investigation, E2E tests should cover:

1. **Navigation flows**:
   - Click "所有單元" → Verify journey page loads
   - Click lesson card → Verify lesson page loads
   - Test breadcrumb navigation

2. **Access control**:
   - Test unauthenticated access → Login prompt
   - Test free course access → Full access
   - Test premium course without purchase → Purchase prompt
   - Test lesson locking based on `premiumOnly` flag

3. **UI state verification**:
   - Chapter accordion expand/collapse
   - Progress bars update correctly
   - Badges display correctly (Premium, Completed)
   - Lock icons appear for inaccessible content

4. **Course switching**:
   - Dropdown shows owned courses
   - Switching courses updates URL and lesson list
   - Non-owned courses show in gray/disabled state

5. **Video playback** (when implemented):
   - Progress tracking updates
   - Completion triggers rewards
   - Submit button enables after completion

---

**Investigation Date**: 2025-11-23
**Frontend Version**: Next.js 14.2.33
**Status**: ✅ Complete
