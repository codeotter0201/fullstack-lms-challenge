import { test, expect } from '@playwright/test';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { testLessons } from '../../fixtures/test-courses';

test.describe('Resume from Breakpoint', () => {
  let videoPage: VideoPlayerPage;

  test.beforeEach(async ({ page }) => {
    await loginAsPaidUser(page);
    videoPage = new VideoPlayerPage(page);
  });

  test('should resume from 25% progress', async ({ page }) => {
    const lesson = testLessons[0];

    // First session - watch to 25%
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();

    const duration = await videoPage.getDuration();
    const targetTime = duration * 0.25;

    await videoPage.seekTo(targetTime);
    await videoPage.play();
    await page.waitForTimeout(3000);
    await videoPage.pause();

    // Wait for progress save
    await page.waitForTimeout(2000);

    // Second session - reload page
    await page.reload();
    await videoPage.waitForVideoLoad();
    await page.waitForTimeout(2000);

    const resumedTime = await videoPage.getCurrentTime();

    // Should resume near 25% (within 15 seconds)
    expect(resumedTime).toBeGreaterThanOrEqual(targetTime - 15);
    expect(resumedTime).toBeLessThanOrEqual(targetTime + 15);
  });

  test('should resume from 50% progress', async ({ page }) => {
    const lesson = testLessons[1];

    // First session - watch to 50%
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();

    const duration = await videoPage.getDuration();
    const targetTime = duration * 0.5;

    await videoPage.seekTo(targetTime);
    await videoPage.play();
    await page.waitForTimeout(3000);
    await videoPage.pause();

    await page.waitForTimeout(2000);

    // Close browser tab and reopen
    await page.goto('/courses');
    await page.waitForTimeout(1000);

    // Return to lesson
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();
    await page.waitForTimeout(2000);

    const resumedTime = await videoPage.getCurrentTime();

    expect(resumedTime).toBeGreaterThanOrEqual(targetTime - 15);
    expect(resumedTime).toBeLessThanOrEqual(targetTime + 15);
  });

  test('should resume from 75% progress', async ({ page }) => {
    const lesson = testLessons[0];

    // First session - watch to 75%
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();

    const duration = await videoPage.getDuration();
    const targetTime = duration * 0.75;

    await videoPage.seekTo(targetTime);
    await videoPage.play();
    await page.waitForTimeout(3000);
    await videoPage.pause();

    await page.waitForTimeout(2000);

    // Simulate session end and restart
    await page.context().clearCookies();
    await loginAsPaidUser(page);

    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();
    await page.waitForTimeout(2000);

    const resumedTime = await videoPage.getCurrentTime();

    expect(resumedTime).toBeGreaterThanOrEqual(targetTime - 15);
    expect(resumedTime).toBeLessThanOrEqual(targetTime + 15);
  });

  test('should start from beginning if no previous progress', async ({ page }) => {
    const lesson = testLessons[0];

    // First time watching
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();
    await page.waitForTimeout(2000);

    const currentTime = await videoPage.getCurrentTime();

    // Should start from beginning (within 10 seconds of start)
    expect(currentTime).toBeLessThanOrEqual(10);
  });

  test('should resume progress across different browser sessions', async ({ page, context }) => {
    const lesson = testLessons[0];

    // Session 1: Watch partially
    await videoPage.goto(lesson.id);
    await videoPage.waitForVideoLoad();

    const duration = await videoPage.getDuration();
    const targetTime = duration * 0.4;

    await videoPage.seekTo(targetTime);
    await videoPage.play();
    await page.waitForTimeout(3000);

    // Save progress and close
    await page.close();

    // Session 2: New page in same context
    const newPage = await context.newPage();
    await loginAsPaidUser(newPage);

    const newVideoPage = new VideoPlayerPage(newPage);
    await newVideoPage.goto(lesson.id);
    await newVideoPage.waitForVideoLoad();
    await newPage.waitForTimeout(2000);

    const resumedTime = await newVideoPage.getCurrentTime();

    expect(resumedTime).toBeGreaterThanOrEqual(targetTime - 15);
    expect(resumedTime).toBeLessThanOrEqual(targetTime + 15);
  });
});
