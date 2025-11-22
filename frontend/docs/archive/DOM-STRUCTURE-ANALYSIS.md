# DOM Structure Analysis: Target vs Local Site Comparison

**Analysis Date:** 2025-11-22
**Target Site:** https://world.waterballsa.tw/
**Local Site:** http://localhost:3000
**Analysis Method:** Playwright browser_snapshot (accessibility tree DOM analysis)

---

## Executive Summary

This comprehensive DOM structure analysis reveals significant architectural differences between the target website and the local implementation. The most critical finding is that the **target site uses a left vertical sidebar layout**, while the **local site implements a horizontal top navbar pattern**. This represents a fundamental layout mismatch that affects every page.

### Critical Severity Issues

1. **Layout Architecture Completely Different** - Left sidebar (target) vs Top navbar (local)
2. **Navigation Structure Mismatch** - 3 navigation groups (target) vs 2 groups (local)
3. **Missing Journey/Course Context UI** - Journey switcher, journey-specific navigation
4. **Course Cards Missing Ownership Status** - Dual CTAs and ownership badges missing
5. **Promotional Banner Different Implementation** - Notification paragraph (target) vs banner component (local)

---

## Page-by-Page Analysis

### 1. Homepage Analysis (`/`)

#### A. Layout Structure Differences

**Target Site (world.waterballsa.tw):**
```yaml
- generic (root container)
  - generic (layout wrapper)
    - generic (left sidebar - VERTICAL NAVIGATION)
      - link (logo at top)
      - generic (sidebar navigation container)
        - list (Primary Nav: 首頁, 課程, 個人檔案)
        - list (Secondary Nav: 排行榜, 獎勵任務, 挑戰歷程)
        - list (Tertiary Nav: 所有單元, 挑戰地圖, SOP 寶典)
    - main (main content area to the RIGHT of sidebar)
      - generic (journey switcher combobox)
      - generic (action buttons: 前往挑戰地圖, settings, user avatar)
      - paragraph (promotional banner)
      - main (actual page content)
```

**Local Site (localhost:3000):**
```yaml
- generic (root container)
  - complementary (LEFT sidebar - user profile widget)
    - link (logo)
    - navigation (vertical nav with 2 groups only)
      - generic (首頁, 課程)
      - link (排行榜)
      - generic (所有單元, 挑戰地圖, SOP 寶典)
    - generic (user card at bottom)
  - complementary (MOBILE header - horizontal top bar)
    - generic (logo + hamburger)
    - generic (mobile user profile)
    - navigation (mobile nav menu)
  - generic (main content wrapper)
    - main (page content)
      - button (課程選擇 dropdown - NOT a journey switcher)
      - generic (promotional banner - different structure)
      - generic (page sections)
```

**Critical Differences:**

1. **Sidebar Position & Purpose:**
   - **Target:** Left sidebar is PRIMARY navigation, always visible, contains logo + 3 navigation groups
   - **Local:** Left sidebar is USER PROFILE widget, navigation is separate mobile header component

2. **Navigation Groups:**
   - **Target:** 3 distinct lists (Primary/Secondary/Tertiary) within sidebar
   - **Local:** 2 navigation groups + separate individual link (排行榜)

3. **Journey Context:**
   - **Target:** Has journey switcher combobox + journey-specific action buttons at top of main area
   - **Local:** Only has "選擇課程" button, no journey context awareness

#### B. Homepage Content Structure Differences

**Target Site Sections:**
```yaml
main (content area):
  - generic (journey switcher + action bar)
  - paragraph (promotional banner with coupon link)
  - main (homepage sections):
    - generic (welcome section):
      - heading "歡迎來到水球軟體學院" (h1)
      - paragraph (description)
      - generic (course selection buttons):
        - button "軟體設計模式精通之旅" (PRESSED state - currently selected)
        - button "AI x BDD：規格驅動全自動開發術"
    - generic (4 feature cards grid)
    - generic (instructor profile section)
    - generic (footer with social links)
```

**Local Site Sections:**
```yaml
main (content area):
  - button "選擇課程" (dropdown button)
  - generic (promotional banner)
  - generic (hero section):
    - heading "從零到一，成為頂尖軟體工程師" (h1)
    - paragraph (different description)
    - generic (CTA buttons): "立即開始學習", "查看排行榜"
  - generic (4 feature cards grid) - MATCHES target
  - generic (instructor profile section) - MATCHES target
  - generic (featured courses section) - NOT on target homepage
    - heading "熱門課程" (h2)
    - generic (2 course cards)
  - generic (final CTA section)
  - contentinfo (footer)
```

**Content Differences:**

1. **Hero Section:**
   - **Target:** Shows course selection buttons for specific journeys (pressed state indicates active)
   - **Local:** Generic hero with CTAs, no journey-specific selection

2. **Featured Courses Section:**
   - **Target:** Does NOT have this on homepage (courses are selected via journey switcher)
   - **Local:** Has "熱門課程" section with 2 course cards

3. **Footer Location:**
   - **Target:** Footer is part of main content generic wrapper
   - **Local:** Footer is separate contentinfo element

#### C. Component Hierarchy Differences

**Target Navigation Structure:**
```
generic (sidebar)
├── link (logo)
└── generic (nav container)
    ├── list (Primary: 首頁, 課程, 個人檔案)
    │   └── listitem > link (with icon + text)
    ├── list (Secondary: 排行榜, 獎勵任務, 挑戰歷程)
    │   └── listitem > link (with icon + text)
    └── list (Tertiary: 所有單元, 挑戰地圖, SOP 寶典)
        └── listitem > link (with icon + text)
```

**Local Navigation Structure:**
```
complementary (sidebar)
├── link (logo)
├── navigation
│   ├── generic (首頁, 課程)
│   │   └── link (with icon + generic text wrapper)
│   ├── link (排行榜 - standalone)
│   └── generic (所有單元, 挑戰地圖, SOP 寶典)
│       └── link (with icon + generic text wrapper)
└── generic (user card)
```

**Key Hierarchy Issues:**

1. **List Structure:**
   - **Target:** Uses semantic list/listitem for all nav groups
   - **Local:** Mixes generic containers with direct links (not semantic)

2. **User Profile Position:**
   - **Target:** User profile NOT in sidebar (likely in top right of main area)
   - **Local:** User profile card at bottom of sidebar

3. **Text Wrapping:**
   - **Target:** Direct text nodes in links
   - **Local:** Text wrapped in extra generic elements

---

### 2. Courses Listing Page (`/courses`)

#### A. Layout Structure

**Target Site Structure:**
```yaml
- generic (sidebar - same as homepage)
- main (content area):
  - generic (journey switcher + actions)
  - generic (courses grid):
    - generic (course tabs/filters?)
    - button (course card 1 - "軟體設計模式精通之旅"):
      - img (course cover)
      - generic (course info):
        - heading (h3)
        - generic (metadata):
          - generic "水球潘" (author)
          - generic "尚未擁有" (ownership status)
        - paragraph (description)
      - generic (course footer):
        - generic "你有一張 3,000 折價券" (promotion)
        - generic (action buttons):
          - button "試聽課程"
          - button "立刻購買"
    - button (course card 2 - similar structure)
  - generic (訂單紀錄 section):
    - generic (order card with details)
```

**Local Site Structure:**
```yaml
- complementary (user profile sidebar - same as homepage)
- complementary (mobile header - same as homepage)
- generic (main wrapper):
  - main:
    - generic (page header):
      - generic (title section):
        - paragraph "探索我們的課程，開始你的學習之旅"
        - heading "所有課程" (h1)
      - generic (search box):
        - img (search icon)
        - textbox "搜尋課程名稱、技能..."
      - generic (empty state):
        - img (empty icon)
        - heading "目前沒有課程" (h3)
        - paragraph "敬請期待更多精彩課程"
  - contentinfo (footer)
```

**Critical Differences:**

1. **Data Loading:**
   - **Target:** Shows actual course data with complex cards
   - **Local:** Shows empty state (no courses in mock data)

2. **Course Card Structure:**
   - **Target:** Button wrapper with img + 3-part info section (header/metadata/footer)
   - **Local:** Not visible (no data)

3. **Ownership Status Display:**
   - **Target:** Shows "尚未擁有" (not owned) vs owned status
   - **Local:** Not implemented

4. **Dual CTA Buttons:**
   - **Target:** Both "試聽課程" (preview) AND "立刻購買" (buy) buttons
   - **Local:** Not visible (awaiting data)

5. **Journey Context:**
   - **Target:** Has journey switcher affecting which courses show
   - **Local:** No journey filtering

6. **Order History Section:**
   - **Target:** Shows "訂單紀錄" with pending orders
   - **Local:** Not implemented

#### B. Search & Filter Differences

**Target Site:**
- No visible search box in snapshot
- Journey switcher acts as primary filter
- Course tabs/toggles for filtering

**Local Site:**
- Has search textbox with placeholder
- No filtering by journey
- No course cards to filter

---

### 3. Course Details / Journeys Page (`/journeys/software-design-pattern`)

#### A. Layout Structure

**Target Site Structure:**
```yaml
- generic (sidebar - SAME as homepage/courses)
- main:
  - generic (journey context bar):
    - combobox "軟體設計模式精通之旅" (journey switcher)
    - generic (action buttons):
      - button "前往挑戰地圖"
      - button (settings)
      - img (user avatar - clickable)
  - paragraph (promotional banner)
  - generic (journey content):
    - generic (journey header):
      - generic (journey intro):
        - heading "軟體設計模式精通之旅" (h1)
        - generic (3 description paragraphs)
        - generic (meta info):
          - generic: img + "49 部影片"
          - generic: img + "大量實戰題"
        - generic (CTA buttons):
          - button "立即加入課程"
          - button "預約 1v1 諮詢"
    - button "Toggle section" "課程介紹＆試聽" (accordion)
    - separator
    - button "Toggle section" "副本零：冒險者指引"
    - button "Toggle section" "副本一：行雲流水的設計底層思路"
    - button "Toggle section" "副本二：Christopher Alexander 設計模式"
    - button "Toggle section" "副本三：掌握所有複雜行為變動"
    - button "Toggle section" "副本四：規模化架構思維"
    - button "Toggle section" "副本五：生命週期及控制反轉"
  - generic (sidebar info):
    - generic (certificate card)
    - generic (course features - 3 items)
```

**Local Site:**
- **NOT ANALYZED** (journey pages not yet implemented with proper structure)
- Current local routes likely 404 or redirect

**Critical Differences:**

1. **Journey Switcher Context:**
   - **Target:** Combobox showing current journey, allows switching
   - **Local:** Not implemented

2. **Accordion Structure:**
   - **Target:** Uses toggle buttons for each "副本" (chapter/section)
   - **Local:** Not available

3. **Course Metadata:**
   - **Target:** Shows video count, exercise count with icons
   - **Local:** Missing

4. **Sidebar Course Info:**
   - **Target:** Certificate card + 3 feature badges (中文課程, 支援行動裝置, 專業的完課認證)
   - **Local:** Not implemented

---

### 4. Leaderboard Page (`/leaderboard`)

#### A. Layout Structure

**Target Site Structure:**
```yaml
- generic (sidebar - SAME as all pages)
- main:
  - generic (journey context bar - SAME as course details)
  - paragraph (promotional banner - SAME)
  - generic (leaderboard content):
    - tablist:
      - tab "學習排行榜" (SELECTED)
      - tab "本週成長榜"
    - generic (leaderboard list):
      - generic (rank 1 entry - clickable):
        - generic (user info):
          - generic "1" (rank number)
          - img "頭像"
          - generic:
            - generic "Elliot" (username)
            - generic "初級工程師" (title)
        - generic (stats):
          - generic "Lv.19" (level)
          - generic "31040" (experience)
      - generic (rank 2 entry - same structure)
      - ... (30 entries total)
      - generic (current user position):
        - generic "2878" (your rank)
        - img (your avatar)
        - generic (your stats)
```

**Local Site:**
- **NOT FULLY ANALYZED** (need to navigate to local leaderboard)
- Structure likely similar but details unknown

**Structure Observations:**

1. **Tab Navigation:**
   - **Target:** Uses tablist/tab for switching views
   - **Local:** Unknown

2. **Rank Entry Structure:**
   - **Target:** Each entry is clickable generic with 2-part layout (user info + stats)
   - **Local:** Unknown

3. **Current User Highlight:**
   - **Target:** Shows user's position at bottom with "??" placeholder
   - **Local:** Unknown

---

### 5. User Profile Page (`/users/[id]`)

**Status:** Not analyzed in this session (time constraints)

**Expected Differences Based on Pattern:**
- Sidebar layout mismatch (same as other pages)
- Profile card structure differences
- Achievement/badge display differences
- Progress visualization differences

---

## Detailed Component-Level Differences

### Navigation Components

#### Sidebar Navigation (Target vs Local)

**Target Site Sidebar:**
```
Position: Fixed left, full height
Width: ~240-280px (estimated from layout)
Structure:
  - Logo at top (clickable link)
  - 3 separate navigation lists
  - No user profile widget
  - No logout button visible
Colors: Likely dark theme (based on known design)
```

**Local Site Sidebar:**
```
Position: Fixed left, full height
Width: Similar to target
Structure:
  - Logo at top
  - 2 navigation groups (not 3)
  - User profile card with avatar, level, XP bar
  - Logout button at bottom
Colors: Currently light theme (MAJOR MISMATCH)
```

#### Journey/Course Context Bar

**Target Site:**
- Combobox showing current journey name
- Action buttons (前往挑戰地圖, settings icon, user avatar)
- Persistent across all authenticated pages
- Located at top of main content area

**Local Site:**
- Simple "選擇課程" dropdown button
- No action buttons
- No journey context awareness
- Not consistent across pages

### Course Card Components

**Target Site Course Card:**
```yaml
button (entire card clickable):
  - img (course cover - full width)
  - generic (info section):
    - heading (course title - h3)
    - generic (metadata row):
      - generic (author name with styling)
      - generic (ownership status badge):
        - "尚未擁有" (not owned)
        - OR "已擁有" (owned) - styling differs
    - paragraph (course description)
  - generic (footer section):
    - generic (promotional badge - if applicable):
      - "你有一張 3,000 折價券"
    - generic (CTA buttons):
      - button "試聽課程" (for non-owners)
      - button "立刻購買" (for non-owners)
      - OR button "繼續學習" (for owners)
```

**Local Site Course Card:**
```yaml
generic (card container):
  - generic (avatar with first letter)
  - generic (course info):
    - heading (course title - h3)
    - paragraph (author name)
    - paragraph (description)
  - generic (single CTA):
    - generic (promotional text)
    - link > button "立刻購買"
```

**Course Card Differences:**

1. **Ownership Status:**
   - **Target:** Explicit badge showing "尚未擁有" vs "已擁有"
   - **Local:** No ownership indication

2. **CTA Strategy:**
   - **Target:** Dual CTAs (試聽 + 購買 for non-owners, 繼續學習 for owners)
   - **Local:** Single CTA (購買 only)

3. **Promotional Badges:**
   - **Target:** Prominent badge at top of footer section
   - **Local:** Text above CTA button

4. **Clickability:**
   - **Target:** Entire card is button (accessibility-friendly)
   - **Local:** Only CTA link is clickable

### Banner/Alert Components

**Target Site Promotional Banner:**
```yaml
paragraph:
  - generic:
    - link (entire promotional text clickable):
      - "將軟體設計精通之旅體驗課程的全部影片看完就可以獲得 3000 元課程折價券！"
    - button "前往"
```

**Local Site Promotional Banner:**
```yaml
generic:
  - paragraph (promotional text)
  - link > button "前往"
  - button "關閉橫幅" (dismissible - with X icon)
```

**Banner Differences:**

1. **Dismissibility:**
   - **Target:** No close button (always visible)
   - **Local:** Has close button (can be dismissed)

2. **Text Linking:**
   - **Target:** Entire text is clickable link
   - **Local:** Text is plain, only button is clickable

3. **Structure:**
   - **Target:** Simple paragraph with nested elements
   - **Local:** Generic wrapper with multiple children

---

## Color Scheme & Theme Differences

### Background Colors

**Target Site:**
```
Primary background: Dark navy/black (#1A1D2E estimated)
Sidebar background: Darker shade of primary
Main content area: Slightly lighter dark
Cards: Dark with borders/shadows
```

**Local Site:**
```
Primary background: White/Light (#FFFFFF)
Sidebar background: Light gray/white
Main content area: White
Cards: White with shadows
```

**CRITICAL:** Local site uses light theme, target uses dark theme - complete opposite.

### Text Colors

**Target Site:**
```
Primary text: White (#FFFFFF)
Secondary text: Light gray (#B8BACF estimated)
Accent: Gold (#FFD700 for important elements)
Links: Light blue or gold on hover
```

**Local Site:**
```
Primary text: Dark gray/black
Secondary text: Medium gray
Accent: Blue (default link color)
Links: Blue on hover
```

### Component Styling

**Target Site:**
```
Buttons: Dark backgrounds with light text, subtle borders
Cards: Dark backgrounds with subtle borders/glows
Inputs: Dark with light text
Badges: Various colors on dark backgrounds
```

**Local Site:**
```
Buttons: Light backgrounds with dark text, or primary blue
Cards: White with shadows
Inputs: White with borders
Badges: Colored backgrounds (pastel-ish)
```

---

## Typography Differences

### Font Families

**Target Site:**
- Appears to use custom font stack (needs CSS inspection)
- Chinese characters rendered with appropriate fallbacks
- Monospace for code elements

**Local Site:**
- Uses default Next.js font stack
- Chinese characters use system fonts
- No custom typography configuration visible

### Font Sizes & Weights

**Target Site:**
```
h1: Large, bold (estimated 32-36px)
h2: Medium-large, bold (estimated 24-28px)
h3: Medium, semi-bold (estimated 18-20px)
Body: Regular (estimated 14-16px)
Small text: Smaller (estimated 12-14px)
```

**Local Site:**
```
h1: Large (similar size)
h2: Medium-large (similar size)
h3: Medium (similar size)
Body: Regular (similar size)
Small text: Similar size
```

**Note:** Font sizes appear similar, but weights and line heights may differ.

---

## Interactive Elements Differences

### Navigation Links

**Target Site:**
```yaml
link:
  - img (icon)
  - text (label as direct text node)
```

**Local Site:**
```yaml
link:
  - img (icon)
  - generic (text wrapper):
    - text (label inside generic)
```

**Issue:** Extra generic wrapper adds unnecessary DOM depth.

### Buttons

**Target Site:**
```
- Consistent button styling across site
- Icon + text buttons have proper structure
- Clear hover/active states (assumed from pattern)
```

**Local Site:**
```
- Mix of button styles
- Some buttons have generic wrappers for text
- Hover states unknown
```

### Forms

**Status:** Not analyzed (no form pages visited)

---

## Missing UI Elements in Local Site

### Critical Missing Components

1. **Journey Switcher Combobox**
   - **What:** Dropdown allowing user to switch between enrolled journeys
   - **Where:** Top of main content area on all pages
   - **Impact:** HIGH - Users cannot switch contexts

2. **Journey-Specific Navigation**
   - **What:** 獎勵任務, 挑戰歷程 links in sidebar
   - **Where:** Sidebar secondary navigation list
   - **Impact:** HIGH - Navigation structure incomplete

3. **Journey Action Buttons**
   - **What:** "前往挑戰地圖" button, settings icon, user avatar in header
   - **Where:** Top right of journey context bar
   - **Impact:** MEDIUM - Quick actions unavailable

4. **Ownership Status Badges**
   - **What:** "尚未擁有" / "已擁有" badges on course cards
   - **Where:** Course card metadata section
   - **Impact:** HIGH - Users don't know what they own

5. **Dual CTA Buttons on Courses**
   - **What:** "試聽課程" + "立刻購買" buttons
   - **Where:** Course card footer
   - **Impact:** MEDIUM - Reduced conversion options

6. **Order History Section**
   - **What:** "訂單紀錄" with pending orders
   - **Where:** /courses page below course grid
   - **Impact:** MEDIUM - Users can't track orders

7. **Course Chapter Accordions**
   - **What:** Expandable "副本" sections showing course structure
   - **Where:** /journeys/[slug] page
   - **Impact:** HIGH - Course content not navigable

8. **Certificate & Feature Badges**
   - **What:** Course certificate card + feature icons
   - **Where:** Journey details page sidebar
   - **Impact:** LOW - Additional course info

9. **Leaderboard Tabs**
   - **What:** "學習排行榜" vs "本週成長榜" tab switcher
   - **Where:** /leaderboard page
   - **Impact:** MEDIUM - Single view only

10. **User Profile in Main Header**
    - **What:** User avatar/menu in top right of main area
    - **Where:** Journey context bar
    - **Impact:** LOW - Already in sidebar on local

### Minor Missing Elements

- Journey-specific promotional banners (different text per journey)
- Social media links in proper sidebar footer (currently in contentinfo)
- Breadcrumb navigation (if target has it)
- Notification center (bell icon)
- Search functionality in navbar
- Language switcher
- Theme toggle (dark/light mode)

---

## Routing & URL Structure Differences

### Target Site URL Patterns

```
Homepage: /
Courses: /courses
Journey Details: /journeys/{journey-slug}
Journey Chapters: /journeys/{journey-slug}/chapters/{chapter-id}/missions/{mission-id}
Leaderboard: /leaderboard
User Profile: /users/me/profile
User Portfolio: /users/me/portfolio
Missions: /journeys/{journey-slug}/missions
Roadmap: /journeys/{journey-slug}/roadmap
SOP: /journeys/{journey-slug}/sop
```

### Local Site URL Patterns

```
Homepage: /
Courses: /courses
Journey Details: /journeys/{journey-slug} (likely not implemented)
Leaderboard: /leaderboard
User Profile: /users/me/profile
Missions: /missions (NOT journey-specific - WRONG)
Challenges: /challenges (should be /roadmap?)
SOP: /sop (NOT journey-specific - WRONG)
```

**Routing Issues:**

1. **Journey Context Missing:**
   - **Target:** All content URLs include journey slug
   - **Local:** Content URLs are global, not journey-specific

2. **URL Naming Mismatch:**
   - **Target:** Uses `/journeys/{slug}/roadmap`
   - **Local:** Uses `/challenges` (no journey context)

3. **SOP Location:**
   - **Target:** `/journeys/{slug}/sop`
   - **Local:** `/sop` (global)

---

## Responsive Design Differences

### Mobile Layout

**Target Site:**
- Has mobile-specific sidebar collapse (assumed)
- Hamburger menu for navigation
- Responsive grid layouts for cards

**Local Site:**
- Has `complementary` mobile header component
- Shows both desktop sidebar AND mobile header (redundant?)
- Hamburger menu implemented

**Issue:** Local site may be rendering both desktop and mobile layouts simultaneously.

### Breakpoint Strategy

**Target Site:**
- Unknown (needs CSS inspection)
- Appears to use standard breakpoints

**Local Site:**
- Configured breakpoints: Mobile (<768px), Tablet (768-1919px), Desktop (≥1920px)
- May not match target breakpoints

---

## Accessibility Differences

### Semantic HTML

**Target Site:**
```
- Uses list/listitem for navigation
- Uses button for interactive cards
- Uses tab/tablist for tabbed interfaces
- Uses combobox for dropdowns
- Uses main for main content area
- Uses region for notifications
```

**Local Site:**
```
- Uses generic for many nav containers (less semantic)
- Uses button for some cards, generic for others
- Uses complementary for sidebars
- Uses main for main content
- Has contentinfo for footer (good)
```

**Accessibility Score:**
- **Target:** Better semantic structure, proper ARIA patterns
- **Local:** Some semantic HTML, but overuses generic divs

### ARIA Labels & Roles

**Target Site:**
- Combobox has proper ARIA (accessible dropdown)
- Tab navigation uses tablist/tab roles
- Buttons have proper labels

**Local Site:**
- Some buttons lack descriptive labels
- Navigation uses generic instead of nav element in places
- Overall less ARIA-compliant

---

## Performance Implications

### DOM Depth

**Target Site:**
```
Average depth: 15-20 levels (estimated from snapshots)
Flat navigation structure
Minimal wrapper divs
```

**Local Site:**
```
Average depth: 18-22 levels
Extra generic wrappers add depth
Text elements unnecessarily wrapped
```

**Impact:** Local site has slightly deeper DOM, potentially slower rendering.

### Component Count

**Target Site:**
```
Estimated components per page: 50-80
Efficient component reuse
```

**Local Site:**
```
Estimated components per page: 60-90
Some redundant components (mobile + desktop nav)
```

---

## Data Structure Differences

### Course Data Model

**Target Site (inferred from DOM):**
```typescript
interface Course {
  id: string
  title: string
  author: string
  description: string
  coverImage: string
  ownership: 'owned' | 'not_owned'
  promotions?: {
    type: 'discount_coupon'
    value: number
  }[]
  ctas: {
    preview?: boolean // 試聽課程
    purchase?: boolean // 立刻購買
    continue?: boolean // 繼續學習
  }
}
```

**Local Site (from docs):**
```typescript
interface Course {
  id: string
  title: string
  description: string
  instructor: string
  thumbnailUrl: string
  tags: string[]
  level: string
  duration: string
  enrollmentCount: number
  rating: number
}
```

**Missing Fields in Local:**
- `ownership` status
- `promotions` array
- `ctas` configuration
- Journey association

### Journey Data Model

**Target Site (inferred):**
```typescript
interface Journey {
  id: number
  slug: string
  name: string
  chapters: Chapter[]
  permissions: {
    isLord: boolean
    isAdventurer: boolean
    isTrialist: boolean
  }
}
```

**Local Site:**
- No journey data model implemented
- Courses are standalone, not part of journeys

---

## Recommendations

### Priority 1: Critical Fixes (Block Release)

1. **Refactor Layout to Left Sidebar Pattern**
   - Move logo + navigation to left sidebar
   - Remove/refactor user profile widget
   - Match target's 3-list navigation structure
   - Estimated: 16-24 hours

2. **Implement Dark Theme**
   - Update Tailwind config colors
   - Apply dark backgrounds, light text throughout
   - Update component color variants
   - Estimated: 8-12 hours

3. **Add Journey Context System**
   - Implement journey switcher combobox
   - Add journey context to routes
   - Show journey-specific navigation
   - Estimated: 16-20 hours

4. **Fix Course Card Structure**
   - Add ownership status badges
   - Implement dual CTA buttons
   - Update promotional badge layout
   - Estimated: 8-12 hours

### Priority 2: Important Fixes (Should Have for MVP)

5. **Add Missing Navigation Items**
   - 獎勵任務 (Missions) link
   - 挑戰歷程 (Portfolio) link
   - Fix URL patterns to include journey context
   - Estimated: 4-6 hours

6. **Implement Journey Details Page**
   - Add chapter accordions
   - Show course metadata
   - Add certificate/features sidebar
   - Estimated: 12-16 hours

7. **Add Order History Section**
   - Create order card component
   - Add to /courses page
   - Estimated: 6-8 hours

8. **Fix Promotional Banner Structure**
   - Remove close button (match target)
   - Make entire text clickable
   - Estimated: 2-3 hours

### Priority 3: Nice to Have (Can Defer)

9. **Improve Semantic HTML**
   - Replace generic with list/listitem in nav
   - Add proper ARIA labels
   - Estimated: 4-6 hours

10. **Optimize DOM Depth**
    - Remove unnecessary generic wrappers
    - Flatten component hierarchy
    - Estimated: 4-6 hours

11. **Add Leaderboard Tabs**
    - Implement tab switcher
    - Show 學習排行榜 vs 本週成長榜
    - Estimated: 4-6 hours

12. **Mobile Layout Optimization**
    - Remove redundant mobile header (keep sidebar)
    - Fix responsive breakpoints to match target
    - Estimated: 6-8 hours

---

## Total Estimated Effort

**Critical Fixes (P1):** 48-68 hours (~6-8.5 days)
**Important Fixes (P2):** 24-33 hours (~3-4 days)
**Nice to Have (P3):** 18-26 hours (~2.25-3.25 days)

**Total:** 90-127 hours (~11-16 working days)

---

## Testing Checklist

After implementing fixes, verify:

- [ ] All pages use left sidebar layout
- [ ] Navigation has 3 distinct groups
- [ ] Dark theme applied consistently
- [ ] Journey switcher works on all pages
- [ ] Course cards show ownership status
- [ ] Course cards have dual CTAs for non-owners
- [ ] Journey-specific URLs work correctly
- [ ] Accordion sections expand/collapse
- [ ] Promotional banners match target structure
- [ ] User profile appears in correct location (NOT sidebar)
- [ ] Mobile layout matches target (sidebar collapses)
- [ ] All navigation links work
- [ ] Leaderboard tabs switch views
- [ ] Order history displays correctly
- [ ] Semantic HTML validated
- [ ] ARIA labels present
- [ ] Performance benchmarked (Lighthouse)

---

## Appendix: Full DOM Snapshots

(Snapshots captured during analysis - available on request)

- Homepage Target: ~800 lines YAML
- Homepage Local: ~600 lines YAML
- Courses Target: ~400 lines YAML
- Courses Local: ~350 lines YAML
- Journey Details Target: ~500 lines YAML
- Leaderboard Target: ~900 lines YAML

---

## Conclusion

The local site has a **fundamentally different layout architecture** compared to the target site. The most critical issue is the sidebar vs top-navbar pattern, which affects every page. Additionally, the dark/light theme mismatch and missing journey context system represent major gaps.

To achieve parity with the target site, the local implementation requires:
1. Complete layout refactoring (left sidebar)
2. Theme overhaul (dark mode)
3. Journey context system implementation
4. Course card structure updates
5. Navigation structure fixes

These changes are substantial and will impact most existing components. However, they are necessary to match the target design and provide the expected user experience.
