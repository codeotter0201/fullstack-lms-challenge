import { test, expect } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { purchaseCourse, getMyPurchases, checkPurchase } from '../../helpers/purchase-helpers';
import { getPaidCourse } from '../../fixtures/test-courses';

test.describe('Purchase History', () => {
  test('user can view purchase history via API', async ({ page }) => {
    await loginAsFreeUser(page);

    // Purchase multiple courses
    const course1 = getPaidCourse(0); // Software Design Patterns
    const course2 = getPaidCourse(1); // Advanced Spring Boot

    await purchaseCourse(page, course1.id);
    await purchaseCourse(page, course2.id);

    // Get purchase history
    const purchases = await getMyPurchases(page);

    expect(purchases).toBeInstanceOf(Array);
    expect(purchases.length).toBeGreaterThanOrEqual(2);

    // Verify first purchase
    const purchase1 = purchases.find((p: any) => p.courseId === course1.id);
    expect(purchase1).toBeDefined();
    expect(purchase1.courseTitle).toBe(course1.name);
    expect(purchase1.transactionId).toMatch(/^MOCK-/);
    expect(purchase1.paymentStatus).toBe('COMPLETED');
    expect(purchase1.purchasePrice).toBe(course1.price);
    expect(purchase1.purchaseDate).toBeDefined();

    // Verify second purchase
    const purchase2 = purchases.find((p: any) => p.courseId === course2.id);
    expect(purchase2).toBeDefined();
    expect(purchase2.courseTitle).toBe(course2.name);
    expect(purchase2.transactionId).toMatch(/^MOCK-/);
    expect(purchase2.paymentStatus).toBe('COMPLETED');
    expect(purchase2.purchasePrice).toBe(course2.price);
  });

  test('check purchase endpoint verifies purchase status', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    // Before purchase - should return false
    let hasPurchased = await checkPurchase(page, paidCourse.id);
    expect(hasPurchased).toBe(false);

    // Purchase course
    await purchaseCourse(page, paidCourse.id);

    // After purchase - should return true
    hasPurchased = await checkPurchase(page, paidCourse.id);
    expect(hasPurchased).toBe(true);
  });

  test('purchase history persists across sessions', async ({ page, context }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    // Purchase course
    await purchaseCourse(page, paidCourse.id);

    // Close page
    await page.close();

    // Create new page in same context (same cookies)
    const newPage = await context.newPage();
    await loginAsFreeUser(newPage);

    // Verify purchase still exists
    const hasPurchased = await checkPurchase(newPage, paidCourse.id);
    expect(hasPurchased).toBe(true);

    const purchases = await getMyPurchases(newPage);
    const purchase = purchases.find((p: any) => p.courseId === paidCourse.id);
    expect(purchase).toBeDefined();
  });

  test('purchase history shows purchase date', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    // Record time before purchase
    const beforePurchase = new Date();

    // Purchase course
    await purchaseCourse(page, paidCourse.id);

    // Record time after purchase
    const afterPurchase = new Date();

    // Get purchase history
    const purchases = await getMyPurchases(page);
    const purchase = purchases.find((p: any) => p.courseId === paidCourse.id);

    expect(purchase).toBeDefined();
    expect(purchase.purchaseDate).toBeDefined();

    // Parse purchase date
    const purchaseDate = new Date(purchase.purchaseDate);

    // Verify purchase date is between before and after timestamps
    expect(purchaseDate.getTime()).toBeGreaterThanOrEqual(beforePurchase.getTime() - 5000); // 5 second buffer
    expect(purchaseDate.getTime()).toBeLessThanOrEqual(afterPurchase.getTime() + 5000);
  });
});
