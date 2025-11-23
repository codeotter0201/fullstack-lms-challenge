import { test, expect } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { attemptPurchase } from '../../helpers/purchase-helpers';
import { getEnvironmentConfig } from '../../config/environments';

const config = getEnvironmentConfig();

test.describe('Purchase Error Handling', () => {
  test('purchasing non-existent course returns 400 or 404 error', async ({ page }) => {
    await loginAsFreeUser(page);

    const invalidCourseId = 999999;

    // Attempt to purchase non-existent course
    const response = await attemptPurchase(page, invalidCourseId);

    // Should return either 400 or 404 depending on implementation
    const validErrorCodes = [400, 404];
    expect(validErrorCodes).toContain(response.status());

    const error = await response.json();
    expect(error.message.toLowerCase()).toMatch(/not found|invalid|does not exist/);
  });

  test('unauthenticated purchase attempt returns 401 error', async ({ page }) => {
    // Don't login - attempt unauthenticated request
    await page.goto('/');

    // Make direct API request without authentication
    const response = await page.request.post(
      `${config.apiURL}/api/purchases/courses/1`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    expect(response.status()).toBe(401);
  });

  test('invalid course ID format returns error', async ({ page }) => {
    await loginAsFreeUser(page);

    // Try with invalid ID format (if API validates)
    const response = await page.request.post(
      `${config.apiURL}/api/purchases/courses/invalid`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${await page.evaluate(() => localStorage.getItem('authToken'))}`,
        },
      }
    );

    // Should return 400 Bad Request for invalid format
    expect([400, 404]).toContain(response.status());
  });

  test('purchase with missing authentication token fails', async ({ page }) => {
    // Visit page without logging in
    await page.goto('/courses');

    // Clear any existing auth tokens
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    // Attempt purchase without auth
    const response = await page.request.post(
      `${config.apiURL}/api/purchases/courses/1`
    );

    expect(response.status()).toBe(401);
  });
});
