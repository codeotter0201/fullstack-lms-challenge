import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CoursesPage extends BasePage {
  readonly courseCards: Locator;
  readonly freeCourseCards: Locator;
  readonly paidCourseCards: Locator;
  readonly searchInput: Locator;
  readonly categoryFilters: Locator;

  constructor(page: Page) {
    super(page);

    this.courseCards = page.locator('[data-testid="course-card"], .course-card');
    this.freeCourseCards = page.locator('[data-free="true"], .free-course');
    this.paidCourseCards = page.locator('[data-free="false"], .paid-course');
    this.searchInput = page.locator('input[placeholder*="搜尋"], input[type="search"]');
    this.categoryFilters = page.locator('[data-testid="category-filter"]');
  }

  async goto() {
    await super.goto('/courses');
  }

  async getCourseByName(courseName: string): Locator {
    return this.page.locator(`text=${courseName}`).first();
  }

  async clickCourse(courseName: string) {
    await this.getCourseByName(courseName).click();
  }

  async getCourseCount(): Promise<number> {
    return await this.courseCards.count();
  }

  async getFreeCourseCount(): Promise<number> {
    return await this.freeCourseCards.count();
  }

  async getPaidCourseCount(): Promise<number> {
    return await this.paidCourseCards.count();
  }

  async searchCourses(query: string) {
    await this.searchInput.fill(query);
    // Wait for search debounce
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
  }

  async isCourseLocked(courseName: string): Promise<boolean> {
    const course = this.getCourseByName(courseName);
    const lockIcon = course.locator('[data-testid="lock-icon"], .lock-icon, text=鎖定');
    try {
      return await lockIcon.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async hasPurchaseButton(courseName: string): Promise<boolean> {
    const course = this.getCourseByName(courseName);
    const purchaseButton = course.locator('button:has-text("立即購買")');
    try {
      return await purchaseButton.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async hasOwnedBadge(courseName: string): Promise<boolean> {
    const course = this.getCourseByName(courseName);
    const ownedBadge = course.locator('text=你已擁有此課程');
    try {
      return await ownedBadge.isVisible({ timeout: 2000 });
    } catch {
      return false;
    }
  }

  async clickPurchaseButton(courseName: string) {
    const course = this.getCourseByName(courseName);
    const purchaseButton = course.locator('button:has-text("立即購買")');
    await purchaseButton.click();
  }
}
