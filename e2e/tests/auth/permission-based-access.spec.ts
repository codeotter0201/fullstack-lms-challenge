import { test, expect } from '@playwright/test';
import { loginAsFreeUser, loginAsPaidUser } from '../../helpers/auth-helpers';
import { CoursesPage } from '../../pages/CoursesPage';
import { testCourses } from '../../fixtures/test-courses';

test.describe('Permission-Based Access Control', () => {
  test.describe('Free User Access', () => {
    test('should allow free user to access free courses', async ({ page }) => {
      await loginAsFreeUser(page);

      const coursesPage = new CoursesPage(page);
      await coursesPage.goto();

      // Free courses should be accessible
      const freeCourse = testCourses.find((c) => c.isFree);
      if (freeCourse) {
        await coursesPage.clickCourse(freeCourse.name);

        // Should navigate to course page without restriction
        await expect(page).toHaveURL(new RegExp(freeCourse.slug));
      }
    });

    test('should block free user from accessing paid courses', async ({ page }) => {
      await loginAsFreeUser(page);

      const coursesPage = new CoursesPage(page);
      await coursesPage.goto();

      // Paid courses should be locked
      const paidCourse = testCourses.find((c) => !c.isFree);
      if (paidCourse) {
        const isLocked = await coursesPage.isCourseLocked(paidCourse.name);
        expect(isLocked).toBe(true);
      }
    });

    test('should show upgrade prompt when free user clicks paid course', async ({ page }) => {
      await loginAsFreeUser(page);

      const coursesPage = new CoursesPage(page);
      await coursesPage.goto();

      // Click on paid course
      const paidCourse = testCourses.find((c) => !c.isFree);
      if (paidCourse) {
        await coursesPage.clickCourse(paidCourse.name);

        // Should show upgrade modal or message
        const upgradePrompt = page.locator('text=/升級|付費|premium|upgrade/i');
        await expect(upgradePrompt).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test.describe('Paid User Access', () => {
    test('should allow paid user to access all courses', async ({ page }) => {
      await loginAsPaidUser(page);

      const coursesPage = new CoursesPage(page);
      await coursesPage.goto();

      // Paid user should see no locks on paid courses
      const paidCourse = testCourses.find((c) => !c.isFree);
      if (paidCourse) {
        const isLocked = await coursesPage.isCourseLocked(paidCourse.name);
        expect(isLocked).toBe(false);
      }
    });

    test('should allow paid user to watch paid course videos', async ({ page }) => {
      await loginAsPaidUser(page);

      const coursesPage = new CoursesPage(page);
      await coursesPage.goto();

      const paidCourse = testCourses.find((c) => !c.isFree);
      if (paidCourse) {
        await coursesPage.clickCourse(paidCourse.name);

        // Should navigate to course page
        await expect(page).toHaveURL(new RegExp(paidCourse.slug));

        // Video player should be visible
        const videoPlayer = page.locator('iframe[src*="youtube"], video, [data-testid="video-player"]');
        await expect(videoPlayer).toBeVisible({ timeout: 10000 });
      }
    });
  });
});
