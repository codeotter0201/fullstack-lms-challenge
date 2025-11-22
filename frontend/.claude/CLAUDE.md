# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Waterball LMS Frontend** - A Learning Management System frontend built with Next.js 14, TypeScript, and Tailwind CSS, replicating the UI of https://world.waterballsa.tw/.

**Current Stage**: Release 1 (MVP) - Full UI implementation with mock data
**Real Completion**: 40% (95% tech architecture, 10% visual design)
**Target Website**: https://world.waterballsa.tw/

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Code Quality
```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

### Testing
- Test login: Visit `/sign-in` and click "使用測試帳號登入"

## Project Architecture

### Directory Structure
```
frontend/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth route group
│   ├── (main)/            # Main app routes
│   ├── courses/           # Course listing
│   ├── journeys/          # Course details
│   ├── leaderboard/       # Leaderboard
│   ├── users/             # User profiles
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage
├── components/
│   ├── ui/               # 16 reusable UI components
│   ├── layout/           # 9 layout components (Navbar, Footer, Sidebar)
│   ├── course/           # 6 course-related components
│   ├── leaderboard/      # 4 leaderboard components
│   └── user/             # 5 user components
├── contexts/             # React Context state management
│   ├── AuthContext.tsx   # Auth state + localStorage
│   ├── JourneyContext.tsx # Course & progress
│   ├── LeaderboardContext.tsx
│   └── ToastContext.tsx
├── hooks/                # Custom React hooks
├── lib/
│   ├── api/             # API client (ready for R2 real API)
│   ├── mock/            # Mock data for R1
│   └── utils.ts         # Utility functions
└── types/               # TypeScript definitions
```

### State Management

Provider nesting order in `app/layout.tsx`:
```
ToastProvider (global notifications)
  → AuthProvider (user auth + localStorage)
    → JourneyProvider (courses & progress)
      → LeaderboardProvider (leaderboard data)
        → children
```

**Key Pattern**: Single direction data flow (Context → Component), state updates via Context methods.

### Path Aliases
- `@/*` → Root of frontend directory (configured in tsconfig.json)
- Example: `import { Button } from '@/components/ui'`

## Design System

### Tailwind Configuration
Located in `tailwind.config.ts` - DO NOT modify without consulting design docs.

**Color Scheme**: Dark theme (target website uses dark colors)
- Primary: `#FFD700` (gold)
- Background: `#1A1D2E` (dark navy)
- Text: `#FFFFFF` (white primary), `#B8BACF` (secondary)

**Key Files**:
- `docs/design-tokens.md` - Complete design system (colors, fonts, spacing)
- `docs/component-library-guide.md` - 40 component usage guide
- `tailwind.config.ts` - Tailwind custom config

### Responsive Design
- **Mobile First**: Default styles for <640px, use `md:`, `lg:` prefixes
- **Breakpoints**: Mobile (<768px), Tablet (768-1919px), Desktop (≥1920px)
- **Touch Targets**: Minimum 44x44px, use `py-3` or larger
- See `docs/RWD-GUIDE.md` for detailed guidelines

## Critical Current State

### Phase 22-27 Development Plan
**Current Phase**: Phase 22 - Design System Alignment

**Major Issues** (documented in `docs/design-gaps.md`):
1. Color scheme opposite (light theme → should be dark)
2. Layout structure wrong (horizontal Navbar → should be vertical left Sidebar)
3. Missing 20+ components (see `docs/missing-components.md`)
4. Course cards don't match design (missing ownership status, dual CTAs)

**Remaining Work**: 15-18 working days across 4 weeks
- Week 1: Phase 22 design alignment (colors, layout)
- Week 2: Phase 23 missing components
- Week 3: Phase 24-25 pages & content
- Week 4: Phase 26-27 optimization

### Documentation to Reference

**ALWAYS check these before major changes**:
- `docs/todo.md` - Phase 0-27 development checklist (current: Phase 22)
- `docs/implementation-progress.md` - Real completion tracking (40%)
- `docs/design-gaps.md` - Design differences from target site
- `docs/missing-components.md` - 20+ missing components with time estimates

**When implementing features**:
- `docs/component-library-guide.md` - Use existing 40 components
- `docs/STATE-MANAGEMENT.md` - Context usage patterns
- `docs/api-integration-plan.md` - API integration for R2

## Component Usage

### Using Existing Components
**40 components available** - ALWAYS check `docs/component-library-guide.md` before creating new ones.

Example:
```tsx
import { Button, Card, Badge } from '@/components/ui'
import { Navbar, Footer } from '@/components/layout'

// Use design system classes from tailwind.config.ts
<Button variant="primary" size="md">
  按鈕文字
</Button>
```

### State Management Pattern
```tsx
// In any component
import { useAuth } from '@/contexts/AuthContext'

const { user, isAuthenticated, login, logout } = useAuth()

// Check auth
if (!isAuthenticated) {
  router.push('/sign-in')
}
```

## API Integration (Future R2)

### Current R1 Approach
- All data from `lib/mock/*.ts`
- Context providers handle mock data distribution
- localStorage for auth persistence

### R2 Migration Path
- API client ready at `lib/api/client.ts`
- Environment variable: `NEXT_PUBLIC_USE_MOCK=true` (R1) / `false` (R2)
- Replace Context internals, keep Hook APIs unchanged
- See `docs/api-integration-plan.md` for detailed endpoints

## Image Configuration

`next.config.js` allows images from:
- `cdn.waterballsa.tw`
- `lh3.googleusercontent.com` (Google avatars)

## Important Constraints

1. **Match Target Website**: Compare all UI with https://world.waterballsa.tw/
2. **Use Existing Components**: Check component library before creating new ones
3. **Follow Design Tokens**: Use colors/fonts from `tailwind.config.ts`
4. **Mobile First**: Default mobile, expand with responsive prefixes
5. **TypeScript Strict**: All code must be strictly typed
6. **Context Pattern**: Use existing Contexts, don't create ad-hoc state

## Known Issues & Next Steps

Refer to `docs/frontend/README.md` for current status and priorities.

### Week 1 Priority (Phase 22)
- Fix color scheme to dark theme
- Refactor layout to left sidebar
- Address homepage critical gaps

See `docs/todo.md` for detailed task breakdown and completion status.
