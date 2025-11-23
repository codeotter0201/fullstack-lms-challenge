import { test, expect } from '@playwright/test';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { testLessons } from '../../fixtures/test-courses';

test.describe('Video Playback', () => {
  let videoPage: VideoPlayerPage;

  test.beforeEach(async ({ page }) => {
    await loginAsPaidUser(page);
    videoPage = new VideoPlayerPage(page);
  });

  test('should load and display video player', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    // Video player should be visible
    await expect(videoPage.videoPlayer).toBeVisible({ timeout: 15000 });

    // Video title should be displayed
    await expect(videoPage.videoTitle).toContainText(lesson.title);
  });

  test('should play video when play button is clicked', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();
    await videoPage.play();

    // Wait a bit for playback to start
    await page.waitForTimeout(2000);

    // Check if video is playing
    const isPlaying = await videoPage.isPlaying();
    expect(isPlaying).toBe(true);
  });

  test('should pause video when pause button is clicked', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();
    await videoPage.play();
    await page.waitForTimeout(2000);

    await videoPage.pause();
    await page.waitForTimeout(500);

    const isPlaying = await videoPage.isPlaying();
    expect(isPlaying).toBe(false);
  });

  test('should display video controls', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();

    // Controls should be available (might be hidden until hover)
    const hasPlayButton = await videoPage.playButton.count();
    expect(hasPlayButton).toBeGreaterThan(0);
  });

  test('should allow seeking through video', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();

    const duration = await videoPage.getDuration();
    if (duration > 30) {
      // Seek to 30 seconds
      await videoPage.seekTo(30);
      await page.waitForTimeout(1000);

      const currentTime = await videoPage.getCurrentTime();
      expect(currentTime).toBeGreaterThanOrEqual(25);
      expect(currentTime).toBeLessThanOrEqual(35);
    }
  });

  test('should update progress bar as video plays', async ({ page }) => {
    const lesson = testLessons[0];
    await videoPage.goto(lesson.id);

    await videoPage.waitForVideoLoad();
    await videoPage.play();
    await page.waitForTimeout(3000);

    const progress = await videoPage.getProgress();
    expect(progress).toBeGreaterThan(0);
  });
});
