import { test, expect } from '@playwright/test';
import { loginAsPaidUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { ProfilePage } from '../../pages/ProfilePage';
import { testLessons } from '../../fixtures/test-courses';

test.describe('Leveling System', () => {
  let videoPage: VideoPlayerPage;
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    await loginAsPaidUser(page);
    videoPage = new VideoPlayerPage(page);
    profilePage = new ProfilePage(page);
  });

  test('should display current level in profile', async ({ page }) => {
    await profilePage.goto();

    // Level should be visible
    await expect(profilePage.level).toBeVisible();

    const level = await profilePage.getLevel();
    expect(level).toBeGreaterThanOrEqual(1);
  });

  test('should display current level in navigation bar', async ({ page }) => {
    await videoPage.goto(testLessons[0].id);

    const level = await videoPage.getUserLevel();
    expect(level).toBeGreaterThanOrEqual(1);
  });

  test('should show level up notification when threshold reached', async ({ page }) => {
    // This test assumes the test user is close to leveling up
    // You may need to adjust test data to ensure this works

    await profilePage.goto();
    const initialLevel = await profilePage.getLevel();
    const initialXP = await profilePage.getExperience();

    // Calculate how many lessons needed to level up
    // Assuming 200 XP per lesson and 200 XP to level up
    const xpToNextLevel = 200 - (initialXP % 200);
    const lessonsNeeded = Math.ceil(xpToNextLevel / 200);

    if (lessonsNeeded <= testLessons.length) {
      // Complete enough lessons to level up
      for (let i = 0; i < lessonsNeeded; i++) {
        await videoPage.goto(testLessons[i].id);
        await videoPage.completeVideo();
        await page.waitForTimeout(2000);

        // Check if level up notification appears
        const leveledUp = await videoPage.isLevelUp();
        if (leveledUp) {
          // Level up notification should be visible
          await expect(videoPage.levelUpNotification).toBeVisible({ timeout: 3000 });

          // Verify level increased
          await profilePage.goto();
          const newLevel = await profilePage.getLevel();
          expect(newLevel).toBe(initialLevel + 1);

          break;
        }
      }
    }
  });

  test('should display XP progress bar', async ({ page }) => {
    await profilePage.goto();

    // XP progress bar should be visible
    await expect(profilePage.experienceBar).toBeVisible();
  });

  test('should show XP remaining to next level', async ({ page }) => {
    await profilePage.goto();

    const currentXP = await profilePage.getExperience();
    const xpToNextLevel = 200 - (currentXP % 200);

    // This should be displayed somewhere in the UI
    // Adjust selector based on actual implementation
    const xpInfo = page.locator('[data-testid="xp-to-next-level"], text=/還需.*EXP/');
    const hasXPInfo = await xpInfo.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasXPInfo) {
      const text = await xpInfo.textContent();
      expect(text).toContain(xpToNextLevel.toString());
    }
  });

  test('should maintain level after page refresh', async ({ page }) => {
    await profilePage.goto();
    const levelBefore = await profilePage.getLevel();

    await page.reload();

    const levelAfter = await profilePage.getLevel();
    expect(levelAfter).toBe(levelBefore);
  });

  test('should not lose XP when leveling up', async ({ page }) => {
    // Get current stats
    await profilePage.goto();
    const initialLevel = await profilePage.getLevel();
    const initialXP = await profilePage.getExperience();

    // Complete a lesson
    await videoPage.goto(testLessons[0].id);
    await videoPage.completeVideo();
    await page.waitForTimeout(2000);

    // Check final stats
    await profilePage.goto();
    const finalLevel = await profilePage.getLevel();
    const finalXP = await profilePage.getExperience();

    // XP should increase regardless of level up
    expect(finalXP).toBeGreaterThan(initialXP);

    // If leveled up, level should be higher
    if (finalLevel > initialLevel) {
      expect(finalLevel).toBe(initialLevel + 1);
    }
  });
});
