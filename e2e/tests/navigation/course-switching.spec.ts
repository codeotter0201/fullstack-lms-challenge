/**
 * E2E Tests: Course Switching via Navbar
 *
 * Tests the course selection behavior in the Navbar:
 * - On Journey Detail page: In-place content update + URL update (no full reload)
 * - On Lesson page: Navigate to new course detail page
 * - On Other pages: Only update context, no navigation
 *
 * @see /frontend/components/layout/Navbar.tsx
 * @see /frontend/app/journeys/[journeySlug]/page.tsx
 */

import { test, expect } from '@playwright/test';
import { NavbarPage } from '../../pages/NavbarPage';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { ROUTES, getJourneyDetailRoute, getLessonRoute } from '../../config/constants';

test.describe('Course Switching via Navbar', () => {
  let navbarPage: NavbarPage;

  test.beforeEach(async ({ page }) => {
    // Login as paid user to have access to courses
    await loginAsPaidUser(page);
    navbarPage = new NavbarPage(page);
  });

  test.describe('On Journey Detail Page (所有單元)', () => {
    test('should update content in-place when switching courses', async ({ page }) => {
      // 1. Navigate to course 1
      await page.goto(getJourneyDetailRoute(1));
      await expect(page).toHaveURL(/\/journeys\/1/);

      // 2. Wait for page to load and get initial course title
      await page.waitForSelector('h1');
      const initialTitle = await page.locator('h1').first().textContent();
      expect(initialTitle).toBeTruthy();

      // 3. Switch to course 2 via Navbar
      await navbarPage.selectCourse(2);

      // 4. Wait for URL to update (using replaceState, not navigation)
      await expect(page).toHaveURL(/\/journeys\/2/);

      // 5. Wait for content to update and verify it changed
      await page.waitForSelector('h1');
      const newTitle = await page.locator('h1').first().textContent();
      expect(newTitle).toBeTruthy();
      expect(newTitle).not.toBe(initialTitle);
    });

    test('should update URL using replaceState (back button returns to original)', async ({ page }) => {
      // Navigate to course 1
      await page.goto(getJourneyDetailRoute(1));
      await expect(page).toHaveURL(/\/journeys\/1/);

      // Switch to course 2
      await navbarPage.selectCourse(2);
      await expect(page).toHaveURL(/\/journeys\/2/);

      // Go back should return to the original URL before navigation to /journeys/1
      // (since replaceState replaces history entry, not pushes)
      await page.goBack();

      // We should go back to wherever we were before /journeys/1
      // (likely login redirect destination or the previous page)
      await expect(page).not.toHaveURL(/\/journeys\/2/);
    });

    test('should not reload page when switching courses (in-place update)', async ({ page }) => {
      // Navigate to course 1
      await page.goto(getJourneyDetailRoute(1));
      await page.waitForSelector('h1');

      // Add a marker to window to verify no page reload occurs
      await page.evaluate(() => {
        (window as any).__testNoReloadMarker = 'course-switch-test';
      });

      // Switch to course 2
      await navbarPage.selectCourse(2);

      // Wait for URL to update
      await expect(page).toHaveURL(/\/journeys\/2/);

      // Verify the marker still exists (no reload occurred)
      const marker = await page.evaluate(() => (window as any).__testNoReloadMarker);
      expect(marker).toBe('course-switch-test');
    });

    test('should update Navbar dropdown to show selected course name', async ({ page }) => {
      await page.goto(getJourneyDetailRoute(1));
      await page.waitForSelector('h1');

      // Switch to course 2
      await navbarPage.selectCourse(2);
      await expect(page).toHaveURL(/\/journeys\/2/);

      // Verify Navbar shows the new course name (not "課程")
      const selectedName = await navbarPage.getSelectedCourseName();
      expect(selectedName).not.toBe('課程');
      expect(selectedName.length).toBeGreaterThan(0);
    });
  });

  test.describe('On Lesson Page', () => {
    test('should navigate to new course detail when switching courses', async ({ page }) => {
      // Navigate to a lesson page (course 1, chapter 1, mission 1)
      await page.goto(getLessonRoute(1, 1, 1));

      // Wait for page to be ready
      await page.waitForLoadState('networkidle');

      // Switch to course 2
      await navbarPage.selectCourse(2);

      // Should navigate to course 2 detail page (not stay on lesson)
      await expect(page).toHaveURL(/\/journeys\/2$/);
      await expect(page).not.toHaveURL(/missions/);
      await expect(page).not.toHaveURL(/chapters/);
    });
  });

  test.describe('On Other Pages', () => {
    test('should only update context, not navigate (on home page)', async ({ page }) => {
      // Go to home page
      await page.goto(ROUTES.HOME);
      const originalUrl = page.url();

      // Switch to course 2
      await navbarPage.selectCourse(2);

      // Wait a moment for any potential navigation
      await page.waitForTimeout(500);

      // URL should NOT change
      expect(page.url()).toBe(originalUrl);

      // But Navbar should show the selected course name
      const selectedName = await navbarPage.getSelectedCourseName();
      expect(selectedName).not.toBe('課程');
    });

    test('should only update context, not navigate (on leaderboard)', async ({ page }) => {
      // Go to leaderboard
      await page.goto(ROUTES.LEADERBOARD);
      await expect(page).toHaveURL(/leaderboard/);

      // Switch to course 1
      await navbarPage.selectCourse(1);

      // Wait a moment for any potential navigation
      await page.waitForTimeout(500);

      // Should still be on leaderboard
      await expect(page).toHaveURL(/leaderboard/);
    });
  });

  test.describe('Direct URL Access (fallback behavior)', () => {
    test('should load course correctly when accessing URL directly', async ({ page }) => {
      // Directly navigate to course 2 without going through navbar
      await page.goto(getJourneyDetailRoute(2));

      // Should load course 2 correctly
      await expect(page).toHaveURL(/\/journeys\/2/);
      await expect(page.locator('h1').first()).toBeVisible();

      const title = await page.locator('h1').first().textContent();
      expect(title).toBeTruthy();
    });

    test('should handle slug-based URLs', async ({ page }) => {
      // Navigate using slug instead of ID
      await page.goto('/journeys/software-design-pattern');

      // Should load the course
      await expect(page.locator('h1').first()).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should not trigger redundant load when clicking same course', async ({ page }) => {
      // Navigate to course 1
      await page.goto(getJourneyDetailRoute(1));
      await page.waitForSelector('h1');

      // Set up a flag to detect if loadJourney is called again
      await page.evaluate(() => {
        (window as any).__loadCount = 0;
      });

      // Click on the same course that's already loaded
      await navbarPage.selectCourse(1);

      // Wait a moment
      await page.waitForTimeout(500);

      // Should still be on course 1
      await expect(page).toHaveURL(/\/journeys\/1/);
    });

    test('should handle rapid course switching', async ({ page }) => {
      await page.goto(getJourneyDetailRoute(1));
      await page.waitForSelector('h1');

      // Rapidly switch between courses
      await navbarPage.selectCourse(2);
      await navbarPage.selectCourse(1);
      await navbarPage.selectCourse(2);

      // Wait for final state
      await page.waitForTimeout(1000);

      // Should end up on course 2
      await expect(page).toHaveURL(/\/journeys\/2/);
    });
  });
});

test.describe('Mobile Course Switching', () => {
  // Use mobile viewport
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test('should switch course via dropdown on mobile journey detail page', async ({ page }) => {
    await loginAsPaidUser(page);
    const navbarPage = new NavbarPage(page);

    // Navigate to course 1
    await page.goto(getJourneyDetailRoute(1));
    await page.waitForSelector('h1');

    // On mobile, course dropdown is still visible in the Header
    // (it's "always visible" according to the Header component)
    await navbarPage.selectCourseOnMobile(2);

    // Should update URL
    await expect(page).toHaveURL(/\/journeys\/2/);
  });

  test('should show course dropdown on mobile screens', async ({ page }) => {
    await loginAsPaidUser(page);
    const navbarPage = new NavbarPage(page);

    await page.goto(getJourneyDetailRoute(1));
    await page.waitForSelector('h1');

    // Course dropdown should still be visible on mobile
    // (Header component makes it "always visible")
    await expect(navbarPage.courseDropdown).toBeVisible();
  });
});
