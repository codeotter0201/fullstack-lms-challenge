/**
 * NavbarPage - Page Object for Navbar interactions
 *
 * Handles course switching via the Navbar dropdown menu
 * Supports both desktop and mobile views
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class NavbarPage extends BasePage {
  // Desktop selectors
  readonly courseDropdown: Locator;
  readonly allCoursesOption: Locator;

  // Mobile selectors
  readonly mobileMenuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.courseDropdown = page.getByTestId('navbar-course-dropdown');
    this.allCoursesOption = page.getByTestId('navbar-all-courses');
    this.mobileMenuButton = page.getByTestId('navbar-mobile-menu-button');
  }

  /**
   * Select a course from the desktop dropdown menu
   * @param courseId - The course ID to select
   */
  async selectCourse(courseId: number | string): Promise<void> {
    await this.courseDropdown.click();
    await this.page.getByTestId(`navbar-course-option-${courseId}`).click();
  }

  /**
   * Select a course from the mobile menu
   * On mobile, the course dropdown is still visible in the Header
   * (not behind a hamburger menu), so we use the same dropdown
   * @param courseId - The course ID to select
   */
  async selectCourseOnMobile(courseId: number | string): Promise<void> {
    // On mobile, the course dropdown works the same as desktop
    // It's "always visible" according to the Header component
    await this.courseDropdown.click();
    await this.page.getByTestId(`navbar-course-option-${courseId}`).click();
  }

  /**
   * Get the currently selected course name from the dropdown button
   */
  async getSelectedCourseName(): Promise<string> {
    return (await this.courseDropdown.textContent()) || '';
  }

  /**
   * Navigate to "所有課程" (All Courses) page
   */
  async selectAllCourses(): Promise<void> {
    await this.courseDropdown.click();
    await this.allCoursesOption.click();
  }

  /**
   * Check if the course dropdown is visible (desktop view)
   */
  async isCourseDropdownVisible(): Promise<boolean> {
    return await this.courseDropdown.isVisible();
  }

  /**
   * Check if the mobile menu button is visible (mobile view)
   */
  async isMobileMenuButtonVisible(): Promise<boolean> {
    return await this.mobileMenuButton.isVisible();
  }

  /**
   * Wait for the course dropdown to be visible
   */
  async waitForCourseDropdown(): Promise<void> {
    await this.courseDropdown.waitFor({ state: 'visible' });
  }
}
