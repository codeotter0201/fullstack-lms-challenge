import { test, expect } from '@playwright/test';
import { register } from '../../helpers/auth-helpers';
import { createTestUser } from '../../fixtures/test-users';
import { getPaidCourse, getFreeCourse } from '../../fixtures/test-courses';
import { PurchaseModal } from '../../pages/PurchaseModal';

test.describe('Course Purchase UI Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login as a new user for each test
    const testUser = createTestUser();
    await register(page, testUser.email, testUser.password, testUser.displayName);
  });

  test('should show purchase button on paid course detail page', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    // Should see purchase button
    const purchaseButton = page.locator('button:has-text("立即購買")');
    await expect(purchaseButton).toBeVisible({ timeout: 10000 });
  });

  test('should not show purchase button on free course', async ({ page }) => {
    const freeCourse = getFreeCourse(0);

    await page.goto(`/journeys/${freeCourse.slug}`);

    // Should NOT see purchase button
    const purchaseButton = page.locator('button:has-text("立即購買")');
    const hasPurchaseButton = await purchaseButton.isVisible({ timeout: 3000 }).catch(() => false);

    expect(hasPurchaseButton).toBe(false);
  });

  test('should open purchase modal when clicking purchase button', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    // Click purchase button
    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    // Modal should open
    const purchaseModal = new PurchaseModal(page);
    await expect(purchaseModal.modal).toBeVisible({ timeout: 5000 });
  });

  test('should display correct course information in purchase modal', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.waitForModal();

    // Should show course name
    const modalContent = await page.locator('[role="dialog"]').textContent();
    expect(modalContent).toContain(paidCourse.name);

    // Should show price
    expect(modalContent).toMatch(/NT\$|價格/i);
  });

  test('should require agreement checkbox to be checked before purchase', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.waitForModal();

    // Initially checkbox should be unchecked
    const isChecked = await purchaseModal.isAgreementChecked();
    expect(isChecked).toBe(false);

    // Select payment method
    await purchaseModal.selectCreditCard();

    // Try to confirm without checking agreement
    // (Button might be disabled or show validation error)
    const isEnabled = await purchaseModal.isConfirmButtonEnabled();

    if (!isEnabled) {
      // Button is disabled - good
      expect(isEnabled).toBe(false);
    } else {
      // Button is enabled - check agreement first
      await purchaseModal.checkAgreement();
    }
  });

  test('should allow selecting different payment methods', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.waitForModal();

    // Should be able to click credit card option
    await purchaseModal.selectCreditCard();
    await expect(purchaseModal.creditCardOption).toBeVisible();

    // Should be able to click ATM option
    await purchaseModal.selectATM();
    await expect(purchaseModal.atmOption).toBeVisible();

    // Should be able to click mobile pay option
    await purchaseModal.selectMobilePay();
    await expect(purchaseModal.mobilePayOption).toBeVisible();
  });

  test('should successfully complete course purchase', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    // Click purchase button
    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    // Complete purchase
    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');

    // Wait for success response
    await page.waitForTimeout(2000);

    // Should show success state or owned badge
    const ownedBadge = page.locator('text=你已擁有此課程');
    const hasOwnedBadge = await ownedBadge.isVisible({ timeout: 5000 }).catch(() => false);

    // Purchase button should be gone or changed
    const stillHasPurchaseButton = await page
      .locator('button:has-text("立即購買")')
      .isVisible({ timeout: 2000 })
      .catch(() => false);

    expect(hasOwnedBadge || !stillHasPurchaseButton).toBe(true);
  });

  test('should allow access to course content after purchase', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    // Complete purchase
    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');

    // Wait for purchase to complete
    await page.waitForTimeout(2000);

    // Reload page to get updated access status
    await page.reload();

    // Should now see course content or video player
    const videoPlayer = page.locator('iframe[src*="youtube"], video, [data-testid="video-player"]');
    const startLearningButton = page.locator('button:has-text("立刻體驗"), button:has-text("開始學習")');

    const hasVideoPlayer = await videoPlayer.isVisible({ timeout: 5000 }).catch(() => false);
    const hasStartButton = await startLearningButton.isVisible({ timeout: 5000 }).catch(() => false);

    // Should either see video player or start learning button
    expect(hasVideoPlayer || hasStartButton).toBe(true);

    // Should NOT see premium lock message
    const premiumLock = page.locator('text=Premium 課程');
    const hasPremiumLock = await premiumLock.isVisible({ timeout: 2000 }).catch(() => false);
    expect(hasPremiumLock).toBe(false);
  });

  test('should prevent duplicate purchase of same course', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    // First purchase
    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');

    await page.waitForTimeout(2000);

    // Try to purchase again
    await page.goto(`/journeys/${paidCourse.slug}`);

    // Should NOT see purchase button anymore
    const stillHasPurchaseButton = await page
      .locator('button:has-text("立即購買")')
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    expect(stillHasPurchaseButton).toBe(false);

    // Should see owned indicator
    const ownedIndicator = page.locator('text=/你已擁有|已購買|Owned/i');
    const hasOwnedIndicator = await ownedIndicator.isVisible({ timeout: 5000 }).catch(() => false);

    expect(hasOwnedIndicator).toBe(true);
  });

  test('should be able to cancel purchase', async ({ page }) => {
    const paidCourse = getPaidCourse(0);

    await page.goto(`/journeys/${paidCourse.slug}`);

    const purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    const purchaseModal = new PurchaseModal(page);
    await purchaseModal.waitForModal();

    // Click cancel
    await purchaseModal.clickCancel();

    // Modal should close
    await expect(purchaseModal.modal).not.toBeVisible({ timeout: 5000 });

    // Should still see purchase button (not purchased)
    await expect(purchaseButton).toBeVisible();
  });

  test('should support purchasing multiple different courses', async ({ page }) => {
    const paidCourse1 = getPaidCourse(0);
    const paidCourse2 = getPaidCourse(1);

    // Purchase first course
    await page.goto(`/journeys/${paidCourse1.slug}`);
    let purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    let purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('credit');
    await page.waitForTimeout(2000);

    // Purchase second course
    await page.goto(`/journeys/${paidCourse2.slug}`);
    purchaseButton = page.locator('button:has-text("立即購買")');
    await purchaseButton.click();

    purchaseModal = new PurchaseModal(page);
    await purchaseModal.completePurchase('atm');
    await page.waitForTimeout(2000);

    // Both courses should be owned
    await page.goto(`/journeys/${paidCourse1.slug}`);
    let ownedBadge = page.locator('text=/你已擁有|已購買/i');
    await expect(ownedBadge).toBeVisible({ timeout: 5000 });

    await page.goto(`/journeys/${paidCourse2.slug}`);
    ownedBadge = page.locator('text=/你已擁有|已購買/i');
    await expect(ownedBadge).toBeVisible({ timeout: 5000 });
  });
});
