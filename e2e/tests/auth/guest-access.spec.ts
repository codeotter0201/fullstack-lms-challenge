import { test, expect } from '@playwright/test';
import { clearAuth } from '../../helpers/auth-helpers';
import { testCourses } from '../../fixtures/test-courses';

test.describe('Guest (Unauthenticated) Access Control', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure we're not authenticated
    await clearAuth(page);
  });

  test('should allow guest to view homepage', async ({ page }) => {
    await page.goto('/');

    // Homepage should load successfully
    await expect(page).toHaveURL('/');

    // Page should be visible
    await expect(page.locator('body')).toBeVisible();
  });

  test('should allow guest to view courses listing page', async ({ page }) => {
    await page.goto('/courses');

    // Courses page should load
    await expect(page).toHaveURL('/courses');

    // Should see some content
    await expect(page.locator('body')).toBeVisible();
  });

  test('should show login prompt when guest views free course detail', async ({ page }) => {
    const freeCourse = testCourses.find((c) => c.isFree);

    if (freeCourse) {
      await page.goto(`/journeys/${freeCourse.slug}`);

      // Should see login prompt
      const loginPrompt = page.locator('text=需要登入才能學習');
      await expect(loginPrompt).toBeVisible({ timeout: 10000 });

      // Should see login button
      const loginButton = page.locator('button:has-text("立即登入")');
      await expect(loginButton).toBeVisible();
    }
  });

  test('should show login prompt when guest views paid course detail', async ({ page }) => {
    const paidCourse = testCourses.find((c) => !c.isFree);

    if (paidCourse) {
      await page.goto(`/journeys/${paidCourse.slug}`);

      // Should see login prompt (or premium prompt)
      const loginOrPremiumPrompt = page.locator(
        'text=/需要登入|Premium 課程|立即登入|立即購買/i'
      );
      await expect(loginOrPremiumPrompt).toBeVisible({ timeout: 10000 });
    }
  });

  test('should redirect to sign-in when guest clicks login button on course page', async ({
    page,
  }) => {
    const freeCourse = testCourses.find((c) => c.isFree);

    if (freeCourse) {
      await page.goto(`/journeys/${freeCourse.slug}`);

      // Click login button
      const loginButton = page.locator('button:has-text("立即登入")');
      await loginButton.click();

      // Should redirect to sign-in page
      await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });
    }
  });

  test('should allow guest to navigate to sign-in page directly', async ({ page }) => {
    await page.goto('/sign-in');

    // Should show sign-in page
    await expect(page).toHaveURL(/sign-in/);

    // Should see login form
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should not have auth token as guest', async ({ page }) => {
    await page.goto('/');

    // Check for auth token
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();
  });

  test('should not be able to access video player without authentication', async ({ page }) => {
    const freeCourse = testCourses.find((c) => c.isFree);

    if (freeCourse) {
      await page.goto(`/journeys/${freeCourse.slug}`);

      // Video player should not be visible, or should be blocked
      const videoPlayer = page.locator('iframe[src*="youtube"], video, [data-testid="video-player"]');
      const isVideoVisible = await videoPlayer.isVisible().catch(() => false);

      // Either video is not visible, or there's a login prompt
      const hasLoginPrompt = await page.locator('text=需要登入才能學習').isVisible().catch(() => false);

      expect(isVideoVisible === false || hasLoginPrompt === true).toBe(true);
    }
  });

  test('should show course information to guests but block content access', async ({ page }) => {
    const freeCourse = testCourses.find((c) => c.isFree);

    if (freeCourse) {
      await page.goto(`/journeys/${freeCourse.slug}`);

      // Should see course title or description (public info)
      const pageContent = await page.textContent('body');
      expect(pageContent).toBeTruthy();

      // But should see access restriction
      const restrictionIndicator = page.locator('text=/需要登入|Premium|鎖定|Lock/i');
      const hasRestriction = await restrictionIndicator.isVisible({ timeout: 5000 }).catch(() => false);

      // Expect either a restriction message or login prompt
      expect(hasRestriction).toBe(true);
    }
  });

  test('should allow guest to access leaderboard (if public)', async ({ page }) => {
    await page.goto('/leaderboard');

    // Check if leaderboard is accessible or redirects
    const currentUrl = page.url();

    if (currentUrl.includes('/leaderboard')) {
      // Leaderboard is public - should see content
      const leaderboardContent = page.locator('body');
      await expect(leaderboardContent).toBeVisible();
    } else {
      // Leaderboard requires auth - should redirect to sign-in
      await expect(page).toHaveURL(/sign-in/);
    }
  });

  test('should maintain guest state across page navigation', async ({ page }) => {
    // Navigate through multiple pages
    await page.goto('/');
    await page.goto('/courses');
    await page.goto('/');

    // Should still not have auth token
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();
  });

  test('should not see user-specific UI elements as guest', async ({ page }) => {
    await page.goto('/');

    // Should not see profile link or user menu (implementation specific)
    const profileLink = page.locator('a[href*="profile"]');
    const userMenu = page.locator('[data-testid="user-menu"], .user-menu');

    const hasProfileLink = await profileLink.isVisible().catch(() => false);
    const hasUserMenu = await userMenu.isVisible().catch(() => false);

    // Guest should not see authenticated user UI elements
    // (This depends on actual implementation)
    expect(hasProfileLink || hasUserMenu).toBe(false);
  });
});
