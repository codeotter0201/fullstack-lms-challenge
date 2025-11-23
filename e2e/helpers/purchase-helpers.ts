import { Page, expect } from '@playwright/test';
import { makeAPIRequest } from './api-helpers';

/**
 * Purchase a course via API
 * @param page Playwright page instance
 * @param courseId Course ID to purchase
 * @returns Purchase DTO response
 */
export async function purchaseCourse(page: Page, courseId: number) {
  const response = await makeAPIRequest(page, 'POST', `/api/purchases/courses/${courseId}`);
  expect(response.ok()).toBe(true);
  return await response.json();
}

/**
 * Get user's purchase history
 * @param page Playwright page instance
 * @returns Array of purchase DTOs
 */
export async function getMyPurchases(page: Page) {
  const response = await makeAPIRequest(page, 'GET', '/api/purchases/my-purchases');
  expect(response.ok()).toBe(true);
  return await response.json();
}

/**
 * Check if user has purchased a specific course
 * @param page Playwright page instance
 * @param courseId Course ID to check
 * @returns true if course is purchased, false otherwise
 */
export async function checkPurchase(page: Page, courseId: number): Promise<boolean> {
  const response = await makeAPIRequest(page, 'GET', `/api/purchases/check/${courseId}`);
  expect(response.ok()).toBe(true);
  const data = await response.json();
  return data.purchased;
}

/**
 * Check if user has access to a specific course
 * @param page Playwright page instance
 * @param courseId Course ID to check
 * @returns true if user has access, false otherwise
 */
export async function checkAccess(page: Page, courseId: number): Promise<boolean> {
  const response = await makeAPIRequest(page, 'GET', `/api/purchases/access/${courseId}`);
  expect(response.ok()).toBe(true);
  const data = await response.json();
  return data.hasAccess;
}

/**
 * Attempt to purchase a course and handle response
 * @param page Playwright page instance
 * @param courseId Course ID to purchase
 * @returns Response object
 */
export async function attemptPurchase(page: Page, courseId: number) {
  return await makeAPIRequest(page, 'POST', `/api/purchases/courses/${courseId}`);
}

/**
 * Verify transaction ID format (MOCK-{UUID})
 * @param transactionId Transaction ID to verify
 */
export function verifyMockTransactionId(transactionId: string) {
  const uuidRegex = /^MOCK-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  expect(transactionId).toMatch(uuidRegex);
}

/**
 * Verify purchase DTO structure
 * @param purchase Purchase DTO object
 */
export function verifyPurchaseDTO(purchase: any) {
  expect(purchase).toHaveProperty('id');
  expect(purchase).toHaveProperty('userId');
  expect(purchase).toHaveProperty('courseId');
  expect(purchase).toHaveProperty('courseTitle');
  expect(purchase).toHaveProperty('purchasePrice');
  expect(purchase).toHaveProperty('purchaseDate');
  expect(purchase).toHaveProperty('paymentStatus');
  expect(purchase).toHaveProperty('transactionId');

  expect(purchase.paymentStatus).toBe('COMPLETED');
  verifyMockTransactionId(purchase.transactionId);
}
