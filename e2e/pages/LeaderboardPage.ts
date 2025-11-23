import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LeaderboardPage extends BasePage {
  readonly leaderboardTable: Locator;
  readonly leaderboardRows: Locator;
  readonly currentUserRank: Locator;
  readonly filterTabs: Locator;

  constructor(page: Page) {
    super(page);

    this.leaderboardTable = page.locator('[data-testid="leaderboard-table"], table');
    this.leaderboardRows = page.locator('[data-testid="leaderboard-row"], tbody tr');
    this.currentUserRank = page.locator('[data-testid="current-user-rank"], .current-user-rank');
    this.filterTabs = page.locator('[role="tab"], [data-testid="filter-tab"]');
  }

  async goto() {
    await super.goto('/leaderboard');
  }

  async getUserRank(displayName: string): Promise<number> {
    const row = this.page.locator(`tr:has-text("${displayName}")`).first();
    const rankCell = row.locator('td').first();
    const text = await rankCell.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : -1;
  }

  async getCurrentUserRank(): Promise<number> {
    const text = await this.currentUserRank.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : -1;
  }

  async getLeaderboardCount(): Promise<number> {
    return await this.leaderboardRows.count();
  }

  async switchToTab(tabName: string) {
    const tab = this.page.locator(`[role="tab"]:has-text("${tabName}")`);
    await tab.click();
  }
}
