import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);

    // Selectors - adjust based on actual implementation
    this.emailInput = page.locator('input[type="email"], input[name="email"]');
    this.passwordInput = page.locator('input[type="password"], input[name="password"]');
    this.submitButton = page.locator('button[type="submit"]').first();
    this.errorMessage = page.locator('[role="alert"], .error-message, .text-red-500');
    this.signUpLink = page.locator('a[href*="sign-up"]');
  }

  async goto() {
    await super.goto('/sign-in');
  }

  async login(email: string, password: string) {
    // Wait for AuthContext to finish loading (button becomes enabled)
    await this.submitButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.page.waitForFunction(
      () => {
        const btn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        return btn && !btn.disabled;
      },
      { timeout: 10000 }
    );

    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async loginAndWaitForNavigation(email: string, password: string) {
    await this.login(email, password);
    // Wait for navigation away from sign-in page (could go to courses, journeys, profile, or home)
    await this.page.waitForURL(/\/(courses|profile|journeys|$)/, { timeout: 15000 });
  }

  async isLoggedIn(): Promise<boolean> {
    // Check if we're redirected away from login page
    const url = this.page.url();
    return !url.includes('/sign-in');
  }

  async getErrorText(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }

  async clickSignUpLink() {
    await this.signUpLink.click();
  }
}
