import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { CoursesPage } from '../../pages/CoursesPage';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { LeaderboardPage } from '../../pages/LeaderboardPage';
import { testUsers } from '../../fixtures/test-users';
import { testCourses, testLessons } from '../../fixtures/test-courses';
import { XP_CONFIG } from '../../config/constants';

test.describe('Paid User Complete Journey', () => {
  test('paid user end-to-end flow with video completion and XP gain', async ({ page }) => {
    const paidUser = testUsers.paidUser;

    // Step 1: Login
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.loginAndWaitForNavigation(paidUser.email, paidUser.password);

    // Step 2: Verify premium status
    const profilePage = new ProfilePage(page);
    await profilePage.goto();

    const displayName = await profilePage.getDisplayName();
    expect(displayName).toContain(paidUser.displayName);

    const isPremium = await profilePage.isPremium();
    expect(isPremium).toBe(true);

    const initialLevel = await profilePage.getLevel();
    const initialXP = await profilePage.getExperience();

    // Step 3: Browse all courses (including paid)
    const coursesPage = new CoursesPage(page);
    await coursesPage.goto();

    const paidCourse = testCourses.find((c) => !c.isFree);
    if (paidCourse) {
      const isLocked = await coursesPage.isCourseLocked(paidCourse.name);
      expect(isLocked).toBe(false);
    }

    // Step 4: Start watching a lesson
    const lesson = testLessons[0];
    const videoPage = new VideoPlayerPage(page);
    await videoPage.goto(lesson.id);

    // Wait for video to load
    await videoPage.waitForVideoLoad();
    await expect(videoPage.videoPlayer).toBeVisible({ timeout: 15000 });

    // Step 5: Watch video partially
    await videoPage.play();
    await page.waitForTimeout(5000);
    await videoPage.pause();

    const partialProgress = await videoPage.getProgress();
    expect(partialProgress).toBeGreaterThan(0);

    // Step 6: Leave and return - test resume from breakpoint
    await coursesPage.goto();
    await page.waitForTimeout(2000);

    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();
    await page.waitForTimeout(2000);

    // Should resume from previous position
    const resumedProgress = await videoPage.getProgress();
    expect(resumedProgress).toBeGreaterThanOrEqual(partialProgress - 10);

    // Step 7: Complete the video
    await videoPage.completeVideo();

    // Should show XP gain
    const hasToast = await videoPage.waitForXPToast();
    expect(hasToast).toBe(true);

    const xpGained = await videoPage.getXPGained();
    expect(xpGained).toBe(XP_CONFIG.VIDEO_COMPLETION_XP);

    // Step 8: Verify XP and level updated
    await profilePage.goto();
    const finalXP = await profilePage.getExperience();
    expect(finalXP).toBe(initialXP + XP_CONFIG.VIDEO_COMPLETION_XP);

    const finalLevel = await profilePage.getLevel();
    expect(finalLevel).toBeGreaterThanOrEqual(initialLevel);

    // Step 9: Check leaderboard
    const leaderboardPage = new LeaderboardPage(page);
    await leaderboardPage.goto();

    await expect(leaderboardPage.leaderboardTable).toBeVisible();

    const rank = await leaderboardPage.getUserRank(paidUser.displayName);
    expect(rank).toBeGreaterThan(0);

    // Step 10: Try to complete same lesson again (should prevent duplicate XP)
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();

    const isCompleted = await videoPage.isCompleted();
    expect(isCompleted).toBe(true);

    // XP should not change if trying to resubmit
    await profilePage.goto();
    const unchangedXP = await profilePage.getExperience();
    expect(unchangedXP).toBe(finalXP);
  });

  test('paid user completes multiple lessons', async ({ page }) => {
    const paidUser = testUsers.paidUser;

    await new LoginPage(page).goto();
    await new LoginPage(page).loginAndWaitForNavigation(paidUser.email, paidUser.password);

    // Get initial XP
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    const initialXP = await profilePage.getExperience();

    // Complete first lesson
    const videoPage = new VideoPlayerPage(page);
    await videoPage.goto(testLessons[0].id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Complete second lesson
    await videoPage.goto(testLessons[1].id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Verify total XP gained
    await profilePage.goto();
    const finalXP = await profilePage.getExperience();
    const expectedXP = initialXP + (XP_CONFIG.VIDEO_COMPLETION_XP * 2);
    expect(finalXP).toBe(expectedXP);
  });

  test('paid user watches video on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const paidUser = testUsers.paidUser;

    await new LoginPage(page).goto();
    await new LoginPage(page).loginAndWaitForNavigation(paidUser.email, paidUser.password);

    const videoPage = new VideoPlayerPage(page);
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    // Video should load on mobile
    await videoPage.waitForVideoLoad();
    await expect(videoPage.videoPlayer).toBeVisible({ timeout: 15000 });

    // Should be able to play
    await videoPage.play();
    await page.waitForTimeout(3000);

    const isPlaying = await videoPage.isPlaying();
    expect(isPlaying).toBe(true);
  });
});
