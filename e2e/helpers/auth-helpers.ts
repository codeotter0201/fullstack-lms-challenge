import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { testUsers, TestUser } from '../fixtures/test-users';

export async function login(page: Page, email: string, password: string) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAndWaitForNavigation(email, password);
}

export async function register(page: Page, email: string, password: string, displayName: string) {
  const signUpPage = new SignUpPage(page);
  await signUpPage.goto();
  await signUpPage.registerAndWaitForNavigation(email, password, displayName);
}

export async function registerUser(page: Page, userType: keyof typeof testUsers) {
  const user = testUsers[userType];
  await register(page, user.email, user.password, user.displayName);
}

export async function loginAs(page: Page, userType: keyof typeof testUsers) {
  const user = testUsers[userType];
  await login(page, user.email, user.password);
}

export async function loginAsFreeUser(page: Page) {
  await loginAs(page, 'freeUser');
}

export async function loginAsPaidUser(page: Page) {
  await loginAs(page, 'paidUser');
}

export async function loginAsAdmin(page: Page) {
  await loginAs(page, 'adminUser');
}

export async function logout(page: Page) {
  // Clear authentication cookies and local storage
  await page.context().clearCookies();
  await page.evaluate(() => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Ignore SecurityError when localStorage is not accessible
    }
  });
  await page.goto('/sign-in');
}

export async function clearAuth(page: Page) {
  // Clear all authentication data without navigation
  await page.context().clearCookies();
  await page.evaluate(() => {
    try {
      localStorage.removeItem('accessToken');
      sessionStorage.clear();
    } catch (e) {
      // Ignore SecurityError when localStorage is not accessible (e.g., on about:blank)
    }
  });
}

export async function isAuthenticated(page: Page): Promise<boolean> {
  // Check if auth token exists in localStorage or cookies
  const token = await page.evaluate(() => {
    try {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    } catch (e) {
      return null;
    }
  });
  return !!token;
}

export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    try {
      return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    } catch (e) {
      return null;
    }
  });
}

export async function setAuthToken(page: Page, token: string) {
  await page.evaluate((token) => {
    try {
      localStorage.setItem('authToken', token);
    } catch (e) {
      // Ignore SecurityError when localStorage is not accessible
    }
  }, token);
}

export async function createAuthenticatedContext(page: Page, userType: keyof typeof testUsers) {
  await loginAs(page, userType);
  const token = await getAuthToken(page);
  return { token, user: testUsers[userType] };
}
