# Waterball LMS - E2E Testing Guide

End-to-end testing suite for Waterball LMS using Playwright.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

This E2E test suite validates the complete user workflows of the Waterball LMS platform, including:

- **Authentication**: Login, logout, permission-based access control
- **Video Playback**: Video player functionality, controls, seeking
- **Progress Tracking**: Auto-save, resume from breakpoint, completion detection
- **Rewards System**: XP gain, leveling, duplicate submission prevention
- **Course Purchase**: Course purchasing, payment validation, access control
- **User Journeys**: Complete flows for free and paid users

## Architecture

### Directory Structure

```
e2e/
├── tests/                    # Test files organized by feature
│   ├── auth/                # Authentication tests
│   ├── video/               # Video playback and progress tests
│   ├── progress/            # Progress tracking tests
│   ├── rewards/             # XP and leveling tests
│   ├── purchase/            # Course purchase tests
│   └── user-journeys/       # Complete user flow tests
├── pages/                   # Page Object Models (POM)
├── fixtures/                # Test data and fixtures
├── helpers/                 # Shared test utilities
├── config/                  # Test configuration
├── scripts/                 # Test execution scripts
├── playwright.config.ts     # Playwright configuration
└── package.json
```

### Test Environment

Tests run against the existing development environment:

- **Frontend**: Next.js app (port 3000)
- **Backend**: Spring Boot API (port 8080)
- **Database**: PostgreSQL (port 5432)

The E2E tests reuse the same Docker Compose environment used for development (`docker-compose.dev.yml`).

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Install dependencies:

```bash
cd e2e
npm install
```

2. Install Playwright browsers:

```bash
npx playwright install --with-deps
```

3. Create environment file:

```bash
cp .env.example .env
```

### Run All Tests

**Step 1: Start the development environment**

```bash
cd deploy
docker-compose -f docker-compose.dev.yml up -d
```

**Step 2: Run the E2E tests**

```bash
cd e2e
npm test
# or
npm run test:purchase
```

The test suite will:
1. ✅ Check if services are ready (frontend, backend, database)
2. ✅ Run all E2E tests
3. ✅ Generate test reports

**Note**: The dev environment will remain running after tests complete. Stop it manually when done:

```bash
cd deploy
docker-compose -f docker-compose.dev.yml down
```

## Test Structure

### Page Object Models

We use the Page Object Model pattern to encapsulate page interactions:

```typescript
// Example: LoginPage
import { LoginPage } from '../../pages/LoginPage';

const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('user@test.com', 'password');
```

Available Page Objects:

- `LoginPage` - Sign in page
- `CoursesPage` - Course listing
- `VideoPlayerPage` - Video lesson player
- `ProfilePage` - User profile
- `LeaderboardPage` - Leaderboard rankings

### Test Fixtures

Test data is organized in fixtures:

```typescript
import { testUsers } from '../../fixtures/test-users';
import { testCourses } from '../../fixtures/test-courses';

const freeUser = testUsers.freeUser;
const paidCourse = testCourses.find(c => !c.isFree);
```

### Helper Functions

Common operations are abstracted into helpers:

```typescript
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { waitForAPIResponse } from '../../helpers/api-helpers';

await loginAsPaidUser(page);
const response = await waitForAPIResponse(page, '/api/progress');
```

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suite

```bash
# Authentication tests only
npm run test:auth

# Video tests only
npm run test:video

# Rewards tests only
npm run test:rewards
```

### Run Tests in Headed Mode

```bash
npm run test:headed
```

### Run Tests in Debug Mode

```bash
npm run test:debug
```

### Run Tests in UI Mode

```bash
npm run test:ui
```

### Run Tests on Specific Browser

```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox

# Safari only
npm run test:safari

# Mobile browsers
npm run test:mobile
```

### Run Specific Test File

```bash
npx playwright test tests/auth/login.spec.ts
```

### Run Tests with Tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @critical
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
  });
});
```

### Best Practices

1. **Use Page Objects**: Encapsulate page interactions in Page Object Models
2. **Use Helpers**: Extract common operations into helper functions
3. **Use Fixtures**: Use test data from fixtures instead of hardcoding
4. **Descriptive Names**: Use clear, descriptive test names
5. **Independent Tests**: Each test should be independent and isolated
6. **Assertions**: Use Playwright's built-in assertions for auto-waiting
7. **Avoid Hard Waits**: Use `waitFor` methods instead of `waitForTimeout` when possible

### Example Test

```typescript
import { test, expect } from '@playwright/test';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { testLessons } from '../../fixtures/test-courses';

test.describe('Video Progress', () => {
  test('should save progress automatically', async ({ page }) => {
    await loginAsPaidUser(page);

    const videoPage = new VideoPlayerPage(page);
    await videoPage.goto(testLessons[0].id);

    await videoPage.waitForVideoLoad();
    await videoPage.play();
    await page.waitForTimeout(12000); // Wait for auto-save

    const response = await page.waitForResponse(
      response => response.url().includes('/api/progress')
    );

    expect(response.ok()).toBe(true);
  });
});
```

## CI/CD Integration

Tests automatically run on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual workflow dispatch

### GitHub Actions Workflow

The E2E tests run in GitHub Actions with:

- Chromium browser only (for speed)
- 30-minute timeout
- Artifact uploads for reports and videos
- Automatic PR comments with results

### View Test Results

1. Go to the Actions tab in GitHub
2. Click on the workflow run
3. Download artifacts:
   - `playwright-report` - HTML test report
   - `test-results` - Raw test results (JSON)
   - `test-videos` - Videos of failed tests

## Troubleshooting

### Tests Failing Locally

1. **Services not ready**:
   ```bash
   cd deploy
   docker-compose -f docker-compose.dev.yml logs
   ```

2. **Port conflicts**:
   ```bash
   # Check if ports are in use
   lsof -i :3000
   lsof -i :8080
   lsof -i :5432

   # Stop conflicting services
   docker-compose -f docker-compose.dev.yml down
   ```

3. **Database issues**:
   ```bash
   # Reset database
   cd deploy
   docker-compose -f docker-compose.dev.yml down -v
   docker-compose -f docker-compose.dev.yml up -d
   ```

### Tests Timing Out

1. Increase timeout in `playwright.config.ts`:
   ```typescript
   timeout: 60 * 1000, // 60 seconds
   ```

2. Check if services are fully ready:
   ```bash
   # Check backend health
   curl http://localhost:8080/api/health

   # Check frontend
   curl http://localhost:3000
   ```

### Flaky Tests

1. Add retries in test configuration:
   ```typescript
   test.describe.configure({ mode: 'parallel', retries: 2 });
   ```

2. Use more robust selectors:
   ```typescript
   // Good
   page.locator('[data-testid="submit-button"]')

   // Avoid
   page.locator('.btn-primary')
   ```

3. Use Playwright's auto-waiting:
   ```typescript
   // Good
   await expect(page.locator('#message')).toBeVisible();

   // Avoid
   await page.waitForTimeout(5000);
   ```

### Debugging Failed Tests

1. **Run in headed mode**:
   ```bash
   npm run test:headed
   ```

2. **Run in debug mode**:
   ```bash
   npm run test:debug
   ```

3. **Use UI mode**:
   ```bash
   npm run test:ui
   ```

4. **Check screenshots and videos**:
   ```bash
   # Screenshots and videos are in test-results/
   ls -la test-results/
   ```

5. **Add console logs**:
   ```typescript
   page.on('console', msg => console.log('PAGE LOG:', msg.text()));
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TEST_ENV` | Test environment (local, ci, staging, prod) | `local` |
| `BASE_URL` | Frontend URL | `http://localhost:3000` |
| `API_URL` | Backend API URL | `http://localhost:8080` |
| `HEADED` | Run tests in headed mode | `false` |
| `SLOW_MO` | Slow down operations (ms) | `0` |
| `TIMEOUT` | Test timeout (ms) | `30000` |

## Test Coverage

Current test coverage includes:

### Authentication (4 tests)
- ✅ Login with valid credentials
- ✅ Login error handling
- ✅ Permission-based access control
- ✅ Session persistence

### Video Playback (6 tests)
- ✅ Video player loading
- ✅ Play/pause functionality
- ✅ Video controls
- ✅ Seeking
- ✅ Progress bar updates

### Progress Tracking (6 tests)
- ✅ Auto-save every 10 seconds
- ✅ Resume from breakpoint
- ✅ Progress accuracy
- ✅ Completion detection (95%+)
- ✅ Save on pause
- ✅ Save before leaving page

### Rewards System (7 tests)
- ✅ XP gain on completion
- ✅ Duplicate submission prevention
- ✅ Level up notifications
- ✅ XP display in UI
- ✅ Level persistence
- ✅ Multiple lesson completion
- ✅ XP toast notifications

### Course Purchase (26 tests)
- ✅ Purchase success flow (free & paid users)
- ✅ Duplicate purchase prevention (409 Conflict)
- ✅ Free course validation (400 Bad Request)
- ✅ Purchase history retrieval
- ✅ Purchase persistence across sessions
- ✅ Access control integration
- ✅ Purchased course accessibility
- ✅ Video playback after purchase
- ✅ XP gain from purchased course
- ✅ Role separation (purchase ≠ role upgrade)
- ✅ Mock payment validation (MOCK-{UUID})
- ✅ Transaction ID format verification
- ✅ Purchase price recording
- ✅ Error handling (invalid course, unauthenticated)

### User Journeys (3 tests)
- ✅ Free user complete flow
- ✅ Paid user complete flow
- ✅ Mobile viewport testing

**Total: 52 tests**

## Contributing

When adding new tests:

1. Follow the existing structure
2. Use Page Object Models
3. Add test data to fixtures
4. Update this README if adding new features
5. Ensure tests pass locally before committing
6. Add meaningful test descriptions

## Support

For issues or questions:

- Create an issue in the repository
- Contact the development team
- Check the Playwright documentation: https://playwright.dev/

## License

MIT
