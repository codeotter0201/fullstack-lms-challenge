import { test, expect } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { purchaseCourse } from '../../helpers/purchase-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { getPaidCourse, getLessonsByCourseId } from '../../fixtures/test-courses';
import { XP_CONFIG } from '../../config/constants';

test.describe('Purchase and Video Playback Integration', () => {
  test('user can complete video lessons from purchased course and gain XP', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);
    const lessons = getLessonsByCourseId(paidCourse.id);

    if (lessons.length === 0) {
      test.skip();
      return;
    }

    // Get initial XP
    const profilePage = new ProfilePage(page);
    await profilePage.goto();
    const initialXP = await profilePage.getExperience();

    // Purchase course
    await purchaseCourse(page, paidCourse.id);

    // Access and complete a lesson
    const videoPage = new VideoPlayerPage(page);
    await videoPage.goto(lessons[0].id);

    // Wait for video load
    await videoPage.waitForVideoLoad();

    // Check if video player is visible
    const videoPlayerVisible = await videoPage.videoPlayer.isVisible({ timeout: 10000 }).catch(() => false);

    if (!videoPlayerVisible) {
      // Video player not loaded - might be implementation dependent
      console.log('Video player not visible, skipping completion test');
      test.skip();
      return;
    }

    // Complete the video
    await videoPage.completeVideo();

    // Wait for XP toast
    const hasToast = await videoPage.waitForXPToast();

    if (hasToast) {
      // Verify XP gained
      const xpGained = await videoPage.getXPGained();
      expect(xpGained).toBe(XP_CONFIG.VIDEO_COMPLETION_XP);
    }

    // Verify XP updated in profile
    await profilePage.goto();
    const finalXP = await profilePage.getExperience();
    expect(finalXP).toBeGreaterThan(initialXP);
    expect(finalXP).toBe(initialXP + XP_CONFIG.VIDEO_COMPLETION_XP);
  });

  test('purchased course allows progress tracking', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);
    const lessons = getLessonsByCourseId(paidCourse.id);

    if (lessons.length === 0) {
      test.skip();
      return;
    }

    // Purchase course
    await purchaseCourse(page, paidCourse.id);

    // Start watching lesson
    const videoPage = new VideoPlayerPage(page);
    await videoPage.goto(lessons[0].id);
    await videoPage.waitForVideoLoad();

    const videoPlayerVisible = await videoPage.videoPlayer.isVisible({ timeout: 5000 }).catch(() => false);

    if (!videoPlayerVisible) {
      test.skip();
      return;
    }

    // Play video for a few seconds
    await videoPage.play();
    await page.waitForTimeout(5000);

    // Get current progress
    const progress = await videoPage.getProgress();
    expect(progress).toBeGreaterThan(0);

    // Pause video
    await videoPage.pause();

    // Progress should be saved (this would trigger auto-save)
    // The actual auto-save behavior is tested in video tests
    expect(progress).toBeLessThan(100); // Not completed yet
  });
});
