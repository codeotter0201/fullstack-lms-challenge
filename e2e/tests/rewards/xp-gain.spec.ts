import { test, expect } from '@playwright/test';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { testLessons } from '../../fixtures/test-courses';
import { XP_CONFIG } from '../../config/constants';

test.describe('XP Gain System', () => {
  let videoPage: VideoPlayerPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    await loginAsPaidUser(page);
    videoPage = new VideoPlayerPage(page);
    profilePage = new ProfilePage(page);
  });

  test('should show submit button after completing video', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();
    const duration = await videoPage.getDuration();

    // Watch to 96% completion
    await videoPage.seekTo(duration * 0.96);
    await videoPage.play();
    await page.waitForTimeout(3000);

    // Submit button should appear
    await expect(videoPage.submitButton).toBeVisible({ timeout: 5000 });
  });

  test('should gain XP when submitting completed lesson', async ({ page }) => {
    const lesson = testLessons[0];

    // Get initial XP
    await profilePage.goto();
    const initialXP = await profilePage.getExperience();

    // Complete and submit lesson
    await videoPage.goto(lesson.id);
    await videoPage.completeVideo();

    // Wait for XP toast notification
    const hasToast = await videoPage.waitForXPToast();
    expect(hasToast).toBe(true);

    // Check XP amount in toast
    const xpGained = await videoPage.getXPGained();
    expect(xpGained).toBe(XP_CONFIG.VIDEO_COMPLETION_XP);

    // Verify XP was added to profile
    await profilePage.goto();
    const newXP = await profilePage.getExperience();
    expect(newXP).toBe(initialXP + XP_CONFIG.VIDEO_COMPLETION_XP);
  });

  test('should prevent duplicate XP for same lesson', async ({ page }) => {
    const lesson = testLessons[0];

    // Complete and submit lesson first time
    await videoPage.goto(lesson.id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Get XP after first completion
    await profilePage.goto();
    const xpAfterFirst = await profilePage.getExperience();

    // Try to complete same lesson again
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();
    const duration = await videoPage.getDuration();

    await videoPage.seekTo(duration * 0.96);
    await page.waitForTimeout(3000);

    // Submit button should either be disabled or not visible
    const isSubmitAvailable = await videoPage.submitButton.isEnabled({ timeout: 3000 }).catch(() => false);

    if (isSubmitAvailable) {
      await videoPage.submitLesson();
      await page.waitForTimeout(2000);
    }

    // XP should not increase
    await profilePage.goto();
    const xpAfterSecond = await profilePage.getExperience();
    expect(xpAfterSecond).toBe(xpAfterFirst);
  });

  test('should show already completed indicator for submitted lessons', async ({ page }) => {
    const lesson = testLessons[0];

    // Complete and submit lesson
    await videoPage.goto(lesson.id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Reload page
    await page.reload();
    await videoPage.waitForVideoLoad();

    // Should show completion badge or checkmark
    const isCompleted = await videoPage.isCompleted();
    expect(isCompleted).toBe(true);
  });

  test('should gain XP for multiple different lessons', async ({ page }) => {
    // Get initial XP
    await profilePage.goto();
    const initialXP = await profilePage.getExperience();

    // Complete first lesson
    const lesson1 = testLessons[0];
    await videoPage.goto(lesson1.id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Complete second lesson
    const lesson2 = testLessons[1];
    await videoPage.goto(lesson2.id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Check final XP (should be initial + 2 * XP_PER_LESSON)
    await profilePage.goto();
    const finalXP = await profilePage.getExperience();
    expect(finalXP).toBe(initialXP + (XP_CONFIG.VIDEO_COMPLETION_XP * 2));
  });

  test('should display XP gain animation or toast', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);
    await videoPage.completeVideo();

    // XP toast should be visible
    await expect(videoPage.xpToast).toBeVisible({ timeout: 5000 });

    // Toast should contain XP amount
    const toastText = await videoPage.xpToast.textContent();
    expect(toastText).toContain('EXP');
    expect(toastText).toContain(XP_CONFIG.VIDEO_COMPLETION_XP.toString());
  });

  test('should update XP counter in navigation bar', async ({ page }) => {
    // Get initial XP from navbar
    const xpBefore = await videoPage.getUserXP();

    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);
    await videoPage.completeVideo();

    // Wait for XP update
    await page.waitForTimeout(2000);

    // XP in navbar should update
    const xpAfter = await videoPage.getUserXP();
    expect(xpAfter).toBe(xpBefore + XP_CONFIG.VIDEO_COMPLETION_XP);
  });
});
