import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../pages/SignUpPage';
import { CoursesPage } from '../../pages/CoursesPage';
import { PurchaseModal } from '../../pages/PurchaseModal';
import { createTestUser } from '../../fixtures/test-users';
import { getPaidCourse, getFreeCourse } from '../../fixtures/test-courses';
import { clearAuth } from '../../helpers/auth-helpers';

test.describe('Complete User Journey: Guest to Paid User', () => {
  test('complete flow from guest to registered user to course purchaser', async ({ page }) => {
    // Ensure we start as guest
    await clearAuth(page);

    const testUser = createTestUser();
    const freeCourse = getFreeCourse(0);
    const paidCourse = getPaidCourse(0);

    // ====================================
    // STEP 1: Guest visits the site
    // ====================================
    await page.goto('/');

    // Verify we're not authenticated
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();

    // ====================================
    // STEP 2: Browse courses as guest
    // ====================================
    await page.goto('/courses');

    // Should see courses page
    await expect(page).toHaveURL('/courses');

    // ====================================
    // STEP 3: Try to access free course (blocked)
    // ====================================
    await page.goto(`/journeys/${freeCourse.slug}`);

    // Should see login prompt
    const loginPrompt = page.locator('text=需要登入才能學習');
    await expect(loginPrompt).toBeVisible({ timeout: 10000 });

    const loginButton = page.locator('button:has-text("立即登入")');
    await expect(loginButton).toBeVisible();

    // ====================================
    // STEP 4: Click login and register new account
    // ====================================
    await loginButton.click();

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/sign-in/, { timeout: 10000 });

    // Register new account
    const signUpPage = new SignUpPage(page);
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Should be redirected to homepage
    await expect(page).toHaveURL('/');

    // Should now have auth token
    const authToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(authToken).toBeTruthy();

    // ====================================
    // STEP 5: Access free course (now allowed)
    // ====================================
    await page.goto(`/journeys/${freeCourse.slug}`);

    // Should NOT see login prompt anymore
    const stillHasLoginPrompt = await page
      .locator('text=需要登入才能學習')
      .isVisible({ timeout: 2000 })
      .catch(() => false);
    expect(stillHasLoginPrompt).toBe(false);

    // Should see course content or start button
    const startLearningButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');
    const hasStartButton = await startLearningButton.isVisible({ timeout: 5000 }).catch(() => false);

    // Free course should be accessible
    expect(hasStartButton).toBe(true);

    // ====================================
    // STEP 6: Try to access paid course (see purchase prompt)
    // ====================================
    await page.goto(`/journeys/${paidCourse.slug}`);

    // Should see premium/purchase prompt
    const premiumPrompt = page.locator('text=/Premium 課程|立即購買/i');
    await expect(premiumPrompt).toBeVisible({ timeout: 10000 });

    // Should see purchase button
    const purchaseButton = page.locator('button:has-text("立即購買")');
    await expect(purchaseButton).toBeVisible();

    // ====================================
    // STEP 7: Purchase the paid course
    // ====================================
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');

    // Wait for purchase to complete
    await page.waitForTimeout(2000);

    // ====================================
    // STEP 8: Verify purchase success
    // ====================================
    // Reload page to get updated access status
    await page.reload();

    // Should no longer see purchase button
    const stillHasPurchaseButton = await page
      .locator('button:has-text("立即購買")')
      .isVisible({ timeout: 3000 })
      .catch(() => false);
    expect(stillHasPurchaseButton).toBe(false);

    // Should see owned badge or be able to access content
    const ownedBadge = page.locator('text=/你已擁有|已購買/i');
    const hasOwnedBadge = await ownedBadge.isVisible({ timeout: 5000 }).catch(() => false);

    const videoPlayer = page.locator('iframe[src*="youtube"], video, [data-testid="video-player"]');
    const hasVideoPlayer = await videoPlayer.isVisible({ timeout: 5000 }).catch(() => false);

    const startPaidCourseButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');
    const hasStartPaidButton = await startPaidCourseButton.isVisible({ timeout: 5000 }).catch(() => false);

    // Should have one of these indicators of successful purchase
    expect(hasOwnedBadge || hasVideoPlayer || hasStartPaidButton).toBe(true);

    // ====================================
    // STEP 9: Verify can access both free and paid courses
    // ====================================
    // Go back to free course - should still work
    await page.goto(`/journeys/${freeCourse.slug}`);
    const freeStartButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');
    await expect(freeStartButton).toBeVisible({ timeout: 5000 });

    // Go to paid course - should work
    await page.goto(`/journeys/${paidCourse.slug}`);
    const paidStartButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');
    const hasPaidStartButton = await paidStartButton.isVisible({ timeout: 5000 }).catch(() => false);

    expect(hasPaidStartButton).toBe(true);

    // ====================================
    // STEP 10: Verify authentication persists
    // ====================================
    await page.reload();

    // Should still be authenticated
    const finalToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(finalToken).toBeTruthy();
    expect(finalToken).toBe(authToken);
  });

  test('guest can navigate through courses before deciding to register', async ({ page }) => {
    await clearAuth(page);

    const freeCourse = getFreeCourse(0);
    const paidCourse = getPaidCourse(0);

    // Browse multiple courses as guest
    await page.goto(`/journeys/${freeCourse.slug}`);
    await expect(page).toHaveURL(new RegExp(freeCourse.slug));

    await page.goto(`/journeys/${paidCourse.slug}`);
    await expect(page).toHaveURL(new RegExp(paidCourse.slug));

    // Go back to homepage
    await page.goto('/');

    // Finally decide to register
    await page.goto('/sign-in');

    const testUser = createTestUser();
    const signUpPage = new SignUpPage(page);
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Should be authenticated now
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeTruthy();

    // Can now access the courses that were viewed earlier
    await page.goto(`/journeys/${freeCourse.slug}`);
    const startButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');
    await expect(startButton).toBeVisible({ timeout: 5000 });
  });

  test('new user can purchase multiple courses in sequence', async ({ page }) => {
    await clearAuth(page);

    const testUser = createTestUser();

    // Register
    await page.goto('/sign-in');
    const signUpPage = new SignUpPage(page);
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Purchase first paid course
    const paidCourse1 = getPaidCourse(0);
    await page.goto(`/journeys/${paidCourse1.slug}`);

    let purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    let purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');
    await page.waitForTimeout(2000);

    // Purchase second paid course
    const paidCourse2 = getPaidCourse(1);
    await page.goto(`/journeys/${paidCourse2.slug}`);

    purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('atm');
    await page.waitForTimeout(2000);

    // Verify both are owned
    await page.goto(`/journeys/${paidCourse1.slug}`);
    let owned = page.locator('text=/你已擁有|已購買/i');
    await expect(owned).toBeVisible({ timeout: 5000 });

    await page.goto(`/journeys/${paidCourse2.slug}`);
    owned = page.locator('text=/你已擁有|已購買/i');
    await expect(owned).toBeVisible({ timeout: 5000 });
  });

  test('user state persists across browser refresh after purchase', async ({ page }) => {
    await clearAuth(page);

    const testUser = createTestUser();
    const paidCourse = getPaidCourse(0);

    // Register
    await page.goto('/sign-in');
    const signUpPage = new SignUpPage(page);
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Purchase course
    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');
    await page.waitForTimeout(2000);

    // Refresh browser
    await page.reload();

    // Should still be authenticated
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeTruthy();

    // Should still own the course
    const owned = page.locator('text=/你已擁有|已購買/i');
    const hasOwned = await owned.isVisible({ timeout: 5000 }).catch(() => false);

    // Should not see purchase button
    const stillHasPurchaseButton = await page
      .locator('button:has-text("立即購買")')
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    expect(hasOwned || !stillHasPurchaseButton).toBe(true);
  });
});
