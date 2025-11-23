import { test, expect } from '@playwright/test';
import { loginAsFreeUser, loginAsPaidUser } from '../../helpers/auth-helpers';
import { purchaseCourse, verifyPurchaseDTO, attemptPurchase } from '../../helpers/purchase-helpers';
import { getPaidCourse, getFreeCourse } from '../../fixtures/test-courses';

test.describe('Course Purchase - Success Scenarios', () => {
  test('free user can successfully purchase a paid course', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0); // Software Design Patterns - 2990

    // Purchase the course
    const purchase = await purchaseCourse(page, paidCourse.id);

    // Verify purchase DTO structure and content
    verifyPurchaseDTO(purchase);
    expect(purchase.courseId).toBe(paidCourse.id);
    expect(purchase.purchasePrice).toBe(paidCourse.price);
    expect(purchase.paymentStatus).toBe('COMPLETED');
    expect(purchase.transactionId).toMatch(/^MOCK-/);

    // Verify transaction ID format (MOCK-{UUID})
    const uuidPattern = /^MOCK-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(purchase.transactionId).toMatch(uuidPattern);
  });

  test('paid user can purchase additional paid courses', async ({ page }) => {
    await loginAsPaidUser(page);

    const paidCourse = getPaidCourse(1); // Advanced Spring Boot - 3990

    // Paid users can still purchase individual courses
    const purchase = await purchaseCourse(page, paidCourse.id);

    verifyPurchaseDTO(purchase);
    expect(purchase.courseId).toBe(paidCourse.id);
    expect(purchase.purchasePrice).toBe(paidCourse.price);
    expect(purchase.paymentStatus).toBe('COMPLETED');
  });
});

test.describe('Duplicate Purchase Prevention', () => {
  test('duplicate purchase returns 409 conflict error', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    // First purchase - should succeed
    await purchaseCourse(page, paidCourse.id);

    // Second purchase attempt - should fail with 409
    const response = await attemptPurchase(page, paidCourse.id);

    expect(response.status()).toBe(409);

    const error = await response.json();
    expect(error.status).toBe(409);
    expect(error.error).toBe('Conflict');
    expect(error.message.toLowerCase()).toContain('already purchased');
  });

  test('cannot purchase same course twice via API', async ({ page }) => {
    await loginAsPaidUser(page);

    const paidCourse = getPaidCourse(0);

    // Purchase once
    const firstPurchase = await purchaseCourse(page, paidCourse.id);
    expect(firstPurchase.paymentStatus).toBe('COMPLETED');

    // Try to purchase again
    const secondResponse = await attemptPurchase(page, paidCourse.id);

    expect(secondResponse.status()).toBe(409);

    const error = await secondResponse.json();
    expect(error.message).toContain('already purchased');
  });
});

test.describe('Free Course Validation', () => {
  test('purchasing free course returns 400 error', async ({ page }) => {
    await loginAsFreeUser(page);

    const freeCourse = getFreeCourse(0);

    // Attempt to purchase free course
    const response = await attemptPurchase(page, freeCourse.id);

    expect(response.status()).toBe(400);

    const error = await response.json();
    expect(error.status).toBe(400);
    expect(error.error).toBe('Bad Request');
    expect(error.message.toLowerCase()).toContain('cannot purchase free course');
  });
});

test.describe('Mock Payment Validation', () => {
  test('transaction ID follows MOCK-{UUID} format', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0);

    const purchase = await purchaseCourse(page, paidCourse.id);

    // Verify MOCK-{UUID} format
    const uuidPattern = /^MOCK-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    expect(purchase.transactionId).toMatch(uuidPattern);

    // Verify status is always COMPLETED
    expect(purchase.paymentStatus).toBe('COMPLETED');
  });

  test('purchase records course price at time of purchase', async ({ page }) => {
    await loginAsFreeUser(page);

    const paidCourse = getPaidCourse(0); // Price: 2990

    const purchase = await purchaseCourse(page, paidCourse.id);

    expect(purchase.purchasePrice).toBe(paidCourse.price);
    expect(purchase.courseTitle).toBe(paidCourse.name);
    expect(purchase.paymentStatus).toBe('COMPLETED');
  });
});
