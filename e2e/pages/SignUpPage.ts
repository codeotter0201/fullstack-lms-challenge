import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignUpPage extends BasePage {
  readonly loginTab: Locator;
  readonly registerTab: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly displayNameInput: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Tab selectors
    this.loginTab = page.locator('text=登入');
    this.registerTab = page.locator('text=註冊');

    // Form input selectors
    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.displayNameInput = page.locator('input[autocomplete="name"]');

    // Button selectors
    this.loginButton = page.locator('button:has-text("登入")');
    this.registerButton = page.locator('button:has-text("註冊")');

    // Error message selector
    this.errorMessage = page.locator('[role="alert"], .error-message, .text-red-500');
  }

  async goto() {
    await super.goto('/sign-in');
  }

  async switchToLoginTab() {
    await this.loginTab.click();
  }

  async switchToRegisterTab() {
    await this.registerTab.click();
  }

  async login(email: string, password: string) {
    await this.switchToLoginTab();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginAndWaitForNavigation(email: string, password: string) {
    await this.login(email, password);

    // Wait for login API response
    await this.page.waitForResponse(
      response => response.url().includes('/api/auth/login') && response.status() === 200
    );

    // Wait for redirect to homepage
    await this.page.waitForURL(/\/$/, { timeout: 10000 });
  }

  async register(email: string, password: string, displayName: string) {
    await this.switchToRegisterTab();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.displayNameInput.fill(displayName);
    await this.registerButton.click();
  }

  async registerAndWaitForNavigation(email: string, password: string, displayName: string) {
    await this.register(email, password, displayName);

    // Wait for register API response
    await this.page.waitForResponse(
      response => response.url().includes('/api/auth/register') && response.status() === 200
    );

    // Wait for redirect to homepage
    await this.page.waitForURL(/\/$/, { timeout: 10000 });
  }

  async isLoggedIn(): Promise<boolean> {
    const url = this.page.url();
    return !url.includes('/sign-in');
  }

  async getErrorText(): Promise<string> {
    return (await this.errorMessage.textContent()) || '';
  }

  async hasValidationError(): Promise<boolean> {
    return await this.errorMessage.isVisible().catch(() => false);
  }

  async getAuthToken(): Promise<string | null> {
    return await this.page.evaluate(() => localStorage.getItem('accessToken'));
  }

  async isEmailInputInvalid(): Promise<boolean> {
    return await this.emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }

  async isPasswordInputInvalid(): Promise<boolean> {
    return await this.passwordInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }

  async isDisplayNameInputInvalid(): Promise<boolean> {
    return await this.displayNameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
  }
}
