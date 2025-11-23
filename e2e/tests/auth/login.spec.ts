import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { testUsers } from '../../fixtures/test-users';
import { ROUTES } from '../../config/constants';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should display login form', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('should login successfully with valid free user credentials', async ({ page }) => {
    const user = testUsers.freeUser;
    await loginPage.login(user.email, user.password);

    // Should redirect away from login page
    await expect(page).not.toHaveURL(/sign-in/);

    // Should be redirected to courses or home page
    await expect(page).toHaveURL(new RegExp(`(${ROUTES.COURSES}|${ROUTES.HOME})`));
  });

  test('should login successfully with valid paid user credentials', async ({ page }) => {
    const user = testUsers.paidUser;
    await loginPage.login(user.email, user.password);

    await expect(page).not.toHaveURL(/sign-in/);
    await expect(page).toHaveURL(new RegExp(`(${ROUTES.COURSES}|${ROUTES.HOME})`));
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    await loginPage.login('invalid@test.com', 'wrongpassword');

    // Should remain on login page
    await expect(page).toHaveURL(/sign-in/);

    // Should show error message
    await expect(loginPage.errorMessage).toBeVisible();

    const errorText = await loginPage.getErrorText();
    expect(errorText.toLowerCase()).toContain('invalid');
  });

  test('should show error message with invalid email format', async ({ page }) => {
    await loginPage.login('not-an-email', 'password123');

    // Should show validation error
    const isValid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(isValid).toBe(false);
  });

  test('should show error message with empty fields', async ({ page }) => {
    await loginPage.submitButton.click();

    // Should remain on login page
    await expect(page).toHaveURL(/sign-in/);

    // Check for HTML5 validation or error message
    const emailValid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(emailValid).toBe(false);
  });

  test('should navigate to signup page when clicking signup link', async ({ page }) => {
    await loginPage.clickSignUpLink();
    await expect(page).toHaveURL(/sign-up/);
  });

  test('should persist login state after page refresh', async ({ page }) => {
    const user = testUsers.freeUser;
    await loginPage.loginAndWaitForNavigation(user.email, user.password);

    // Refresh page
    await page.reload();

    // Should still be logged in (not redirected to login)
    await expect(page).not.toHaveURL(/sign-in/);
  });
});
