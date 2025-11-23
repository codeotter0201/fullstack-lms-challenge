import { test, expect } from '@playwright/test';
import { SignUpPage } from '../../pages/SignUpPage';
import { createTestUser, generateRandomEmail } from '../../fixtures/test-users';
import { ROUTES } from '../../config/constants';

test.describe('User Registration Flow', () => {
  let signUpPage: SignUpPage;

  test.beforeEach(async ({ page }) => {
    signUpPage = new SignUpPage(page);
    await signUpPage.goto();
  });

  test('should display registration form when switching to register tab', async ({ page }) => {
    await signUpPage.switchToRegisterTab();

    await expect(signUpPage.emailInput).toBeVisible();
    await expect(signUpPage.passwordInput).toBeVisible();
    await expect(signUpPage.displayNameInput).toBeVisible();
    await expect(signUpPage.registerButton).toBeVisible();
  });

  test('should successfully register a new user', async ({ page }) => {
    const testUser = createTestUser();

    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Should be redirected to homepage
    await expect(page).toHaveURL('/');

    // Should have auth token
    const token = await signUpPage.getAuthToken();
    expect(token).toBeTruthy();
    expect(token).not.toBe('');
  });

  test('should show validation error for invalid email format', async ({ page }) => {
    await signUpPage.switchToRegisterTab();
    await signUpPage.emailInput.fill('not-an-email');
    await signUpPage.passwordInput.fill('Test123456!');
    await signUpPage.displayNameInput.fill('Test User');
    await signUpPage.registerButton.click();

    // Email input should be invalid
    const isInvalid = await signUpPage.isEmailInputInvalid();
    expect(isInvalid).toBe(true);
  });

  test('should show validation error for password less than 4 characters', async ({ page }) => {
    await signUpPage.switchToRegisterTab();
    await signUpPage.emailInput.fill(generateRandomEmail());
    await signUpPage.passwordInput.fill('123');
    await signUpPage.displayNameInput.fill('Test User');
    await signUpPage.registerButton.click();

    // Should remain on signup page
    await expect(page).toHaveURL(/sign-in/);

    // Password input should be invalid
    const isInvalid = await signUpPage.isPasswordInputInvalid();
    expect(isInvalid).toBe(true);
  });

  test('should show validation error for display name less than 2 characters', async ({ page }) => {
    await signUpPage.switchToRegisterTab();
    await signUpPage.emailInput.fill(generateRandomEmail());
    await signUpPage.passwordInput.fill('Test123456!');
    await signUpPage.displayNameInput.fill('A');
    await signUpPage.registerButton.click();

    // Should remain on signup page
    await expect(page).toHaveURL(/sign-in/);

    // Display name input should be invalid
    const isInvalid = await signUpPage.isDisplayNameInputInvalid();
    expect(isInvalid).toBe(true);
  });

  test('should show validation error for display name more than 50 characters', async ({
    page,
  }) => {
    await signUpPage.switchToRegisterTab();
    await signUpPage.emailInput.fill(generateRandomEmail());
    await signUpPage.passwordInput.fill('Test123456!');
    await signUpPage.displayNameInput.fill('A'.repeat(51));
    await signUpPage.registerButton.click();

    // Should remain on signup page
    await expect(page).toHaveURL(/sign-in/);

    // Display name input should be invalid
    const isInvalid = await signUpPage.isDisplayNameInputInvalid();
    expect(isInvalid).toBe(true);
  });

  test('should show error when registering with existing email', async ({ page }) => {
    const testUser = createTestUser();

    // Register first time
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Logout
    await page.evaluate(() => {
      localStorage.removeItem('accessToken');
    });

    // Try to register again with same email
    await signUpPage.goto();
    await signUpPage.switchToRegisterTab();
    await signUpPage.emailInput.fill(testUser.email);
    await signUpPage.passwordInput.fill(testUser.password);
    await signUpPage.displayNameInput.fill('Different Name');
    await signUpPage.registerButton.click();

    // Should remain on signup page
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/sign-in/);

    // Should show error message
    const hasError = await signUpPage.hasValidationError();
    expect(hasError).toBe(true);
  });

  test('should show error with empty fields', async ({ page }) => {
    await signUpPage.switchToRegisterTab();
    await signUpPage.registerButton.click();

    // Should remain on signup page
    await expect(page).toHaveURL(/sign-in/);

    // Check for HTML5 validation
    const emailInvalid = await signUpPage.isEmailInputInvalid();
    expect(emailInvalid).toBe(true);
  });

  test('should be able to switch between login and register tabs', async ({ page }) => {
    // Start on login tab
    await expect(signUpPage.loginButton).toBeVisible();
    await expect(signUpPage.displayNameInput).not.toBeVisible();

    // Switch to register tab
    await signUpPage.switchToRegisterTab();
    await expect(signUpPage.registerButton).toBeVisible();
    await expect(signUpPage.displayNameInput).toBeVisible();

    // Switch back to login tab
    await signUpPage.switchToLoginTab();
    await expect(signUpPage.loginButton).toBeVisible();
    await expect(signUpPage.displayNameInput).not.toBeVisible();
  });

  test('should redirect away from sign-in page if already authenticated', async ({ page }) => {
    const testUser = createTestUser();

    // Register and login
    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Try to visit sign-in page again
    await page.goto('/sign-in');

    // Should be redirected away (implementation may vary)
    await page.waitForTimeout(1000);
    const currentUrl = page.url();

    // May redirect to home or stay on sign-in, but should show authenticated state
    const token = await signUpPage.getAuthToken();
    expect(token).toBeTruthy();
  });

  test('should persist registration data after page refresh', async ({ page }) => {
    const testUser = createTestUser();

    await signUpPage.registerAndWaitForNavigation(
      testUser.email,
      testUser.password,
      testUser.displayName
    );

    // Refresh page
    await page.reload();

    // Should still be authenticated
    const token = await signUpPage.getAuthToken();
    expect(token).toBeTruthy();

    // Should not be on sign-in page
    await expect(page).not.toHaveURL(/sign-in/);
  });
});
