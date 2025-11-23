import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  readonly displayName: Locator;
  readonly email: Locator;
  readonly level: Locator;
  readonly experience: Locator;
  readonly experienceBar: Locator;
  readonly isPremiumBadge: Locator;
  readonly completedLessons: Locator;
  readonly editButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);

    this.displayName = page.locator('[data-testid="display-name"], .display-name');
    this.email = page.locator('[data-testid="user-email"], .user-email');
    this.level = page.locator('[data-testid="user-level"], .user-level');
    this.experience = page.locator('[data-testid="user-xp"], .user-xp');
    this.experienceBar = page.locator('[data-testid="xp-bar"], .xp-bar');
    this.isPremiumBadge = page.locator('[data-testid="premium-badge"], .premium-badge, text=付費會員');
    this.completedLessons = page.locator('[data-testid="completed-lessons"]');
    this.editButton = page.locator('button:has-text("編輯"), button[data-testid="edit-profile"]');
    this.logoutButton = page.locator('button:has-text("登出"), button[data-testid="logout"]');
  }

  async goto() {
    await super.goto('/profile');
  }

  async getDisplayName(): Promise<string> {
    return (await this.displayName.textContent()) || '';
  }

  async getEmail(): Promise<string> {
    return (await this.email.textContent()) || '';
  }

  async getLevel(): Promise<number> {
    const text = await this.level.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  async getExperience(): Promise<number> {
    const text = await this.experience.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async isPremium(): Promise<boolean> {
    return await this.isPremiumBadge.isVisible().catch(() => false);
  }

  async getCompletedLessonsCount(): Promise<number> {
    const text = await this.completedLessons.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async logout() {
    await this.logoutButton.click();
    await this.page.waitForURL('/sign-in');
  }
}
