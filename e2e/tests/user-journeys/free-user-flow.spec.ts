import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CoursesPage } from '../../pages/CoursesPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { testUsers } from '../../fixtures/test-users';
import { testCourses } from '../../fixtures/test-courses';

test.describe('Free User Complete Journey', () => {
  test('free user end-to-end flow', async ({ page }) => {
    const freeUser = testUsers.freeUser;

    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForNavigation(freeUser.email, freeUser.password);

    // Step 2: Navigate to courses page
    const coursesPage = new CoursesPage(page);
    await coursesPage.goto();

    // Step 3: Verify free courses are accessible
    const freeCourse = testCourses.find((c) => c.isFree);
    if (freeCourse) {
      await coursesPage.clickCourse(freeCourse.name);
      await expect(page).toHaveURL(new RegExp(freeCourse.slug));
    }

    // Step 4: Try to access paid course
    await coursesPage.goto();
    const paidCourse = testCourses.find((c) => !c.isFree);
    if (paidCourse) {
      const isLocked = await coursesPage.isCourseLocked(paidCourse.name);
      expect(isLocked).toBe(true);

      // Click on locked course
      await coursesPage.clickCourse(paidCourse.name);

      // Should see upgrade prompt
      const upgradePrompt = page.locator('text=/升級|付費|premium|upgrade/i');
      await expect(upgradePrompt).toBeVisible({ timeout: 5000 });
    }

    // Step 5: Check profile
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    const displayName = await profilePage.getDisplayName();
    expect(displayName).toContain(freeUser.displayName);

    const isPremium = await profilePage.isPremium();
    expect(isPremium).toBe(false);

    // Step 6: Verify free tier limitations are clear
    const level = await profilePage.getLevel();
    const xp = await profilePage.getExperience();

    expect(level).toBeGreaterThanOrEqual(1);
    expect(xp).toBeGreaterThanOrEqual(0);
  });

  test('free user attempts to purchase course', async ({ page }) => {
    const freeUser = testUsers.freeUser;

    await new LoginPage(page).goto();
    await new LoginPage(page).loginAndWaitForNavigation(freeUser.email, freeUser.password);

    const coursesPage = new CoursesPage(page);
    await coursesPage.goto();

    // Try to access paid course
    const paidCourse = testCourses.find((c) => !c.isFree);
    if (paidCourse) {
      await coursesPage.clickCourse(paidCourse.name);

      // Should see purchase/upgrade modal
      const purchaseButton = page.locator('button:has-text("購買"), button:has-text("升級"), button[data-testid="upgrade-button"]');
      const hasPurchaseOption = await purchaseButton.isVisible({ timeout: 5000 }).catch(() => false);

      expect(hasPurchaseOption).toBe(true);
    }
  });

  test('free user can view leaderboard', async ({ page }) => {
    const freeUser = testUsers.freeUser;

    await new LoginPage(page).goto();
    await new LoginPage(page).loginAndWaitForNavigation(freeUser.email, freeUser.password);

    // Navigate to leaderboard
    await page.goto('/leaderboard');

    // Leaderboard should be visible
    const leaderboardTable = page.locator('[data-testid="leaderboard-table"], table');
    await expect(leaderboardTable).toBeVisible({ timeout: 5000 });

    // Free users should be able to see rankings
    const leaderboardRows = page.locator('[data-testid="leaderboard-row"], tbody tr');
    const rowCount = await leaderboardRows.count();
    expect(rowCount).toBeGreaterThan(0);
  });
});
