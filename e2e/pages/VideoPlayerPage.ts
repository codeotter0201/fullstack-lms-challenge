import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class VideoPlayerPage extends BasePage {
  readonly videoPlayer: Locator;
  readonly playButton: Locator;
  readonly pauseButton: Locator;
  readonly videoTitle: Locator;
  readonly progressBar: Locator;
  readonly completionBadge: Locator;
  readonly submitButton: Locator;
  readonly xpToast: Locator;
  readonly levelUpNotification: Locator;

  // 新增：繳交狀態相關 Locators
  readonly canSubmitBadge: Locator;      // 「可繳交」Badge
  readonly submittedBadge: Locator;       // 「已繳交」Badge

  constructor(page: Page) {
    super(page);

    // Video player selectors
    this.videoPlayer = page.locator('iframe[src*="youtube"], video, [data-testid="video-player"]');
    this.playButton = page.locator('[aria-label*="Play"], button[data-testid="play-button"]');
    this.pauseButton = page.locator('[aria-label*="Pause"], button[data-testid="pause-button"]');

    // Lesson info selectors
    this.videoTitle = page.locator('h1, [data-testid="lesson-title"]');
    this.progressBar = page.locator('[data-testid="progress-bar"], .progress-bar');

    // Completion and rewards selectors
    this.completionBadge = page.locator('[data-testid="completion-badge"], .completion-badge, text=已完成');
    this.submitButton = page.locator('[data-testid="submit-lesson-button"], button:has-text("繳交單元"), button:has-text("請先看完影片"), button:has-text("已繳交")');
    this.xpToast = page.locator('[data-testid="xp-toast"], .toast:has-text("EXP")');
    this.levelUpNotification = page.locator('[data-testid="level-up"], .level-up, text=升級');

    // 新增：繳交狀態 Badge selectors
    this.canSubmitBadge = page.locator('[data-testid="can-submit-badge"]');
    this.submittedBadge = page.locator('[data-testid="submitted-badge"]');
  }

  async goto(lessonId: number) {
    // Adjust URL pattern based on actual routing
    await super.goto(`/lessons/${lessonId}`);
  }

  async play() {
    await this.playButton.click();
  }

  async pause() {
    await this.pauseButton.click();
  }

  async isPlaying(): Promise<boolean> {
    // Check if pause button is visible (means video is playing)
    return await this.pauseButton.isVisible();
  }

  async getCurrentTime(): Promise<number> {
    // For YouTube iframe
    return await this.page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
      if (iframe) {
        // This requires YouTube IFrame API integration
        return (window as any).player?.getCurrentTime() || 0;
      }

      // For HTML5 video
      const video = document.querySelector('video') as HTMLVideoElement;
      return video?.currentTime || 0;
    });
  }

  async getDuration(): Promise<number> {
    return await this.page.evaluate(() => {
      const iframe = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
      if (iframe) {
        return (window as any).player?.getDuration() || 0;
      }

      const video = document.querySelector('video') as HTMLVideoElement;
      return video?.duration || 0;
    });
  }

  async seekTo(seconds: number) {
    await this.page.evaluate((seconds) => {
      const iframe = document.querySelector('iframe[src*="youtube"]') as HTMLIFrameElement;
      if (iframe) {
        (window as any).player?.seekTo(seconds);
        return;
      }

      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) {
        video.currentTime = seconds;
      }
    }, seconds);
  }

  async waitForVideoLoad() {
    await this.page.waitForTimeout(2000); // Wait for video to initialize
  }

  async getProgress(): Promise<number> {
    const current = await this.getCurrentTime();
    const duration = await this.getDuration();
    return duration > 0 ? (current / duration) * 100 : 0;
  }

  async isCompleted(): Promise<boolean> {
    return await this.completionBadge.isVisible();
  }

  async submitLesson() {
    await this.submitButton.click();
  }

  async waitForXPToast(): Promise<boolean> {
    try {
      await this.xpToast.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getXPGained(): Promise<number> {
    const text = await this.xpToast.textContent();
    const match = text?.match(/(\d+)\s*EXP/);
    return match ? parseInt(match[1]) : 0;
  }

  async isLevelUp(): Promise<boolean> {
    return await this.levelUpNotification.isVisible({ timeout: 3000 }).catch(() => false);
  }

  async getUserXP(): Promise<number> {
    // Get XP from header or user profile section
    const xpElement = this.page.locator('[data-testid="user-xp"], .user-xp');
    const text = await xpElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  }

  async getUserLevel(): Promise<number> {
    const levelElement = this.page.locator('[data-testid="user-level"], .user-level');
    const text = await levelElement.textContent();
    const match = text?.match(/(\d+)/);
    return match ? parseInt(match[1]) : 1;
  }

  async completeVideo() {
    await this.waitForVideoLoad();
    const duration = await this.getDuration();

    // Seek to near the end (95%)
    await this.seekTo(duration * 0.95);

    // Wait for completion detection
    await this.page.waitForTimeout(3000);

    // Wait for submit button to be available
    await this.submitButton.waitFor({ state: 'visible', timeout: 5000 });

    // Submit the lesson
    await this.submitLesson();
  }

  async getProgressSaveCalls(): Promise<any[]> {
    // Intercept API calls for progress saving
    const responses: any[] = [];

    this.page.on('response', (response) => {
      if (response.url().includes('/api/progress') && response.request().method() === 'POST') {
        responses.push({
          url: response.url(),
          status: response.status(),
          timestamp: new Date(),
        });
      }
    });

    return responses;
  }

  /**
   * 檢查是否為「可繳交」狀態
   */
  async isCanSubmit(): Promise<boolean> {
    return await this.canSubmitBadge.isVisible({ timeout: 3000 }).catch(() => false);
  }

  /**
   * 檢查是否為「已繳交」狀態
   */
  async isSubmittedState(): Promise<boolean> {
    return await this.submittedBadge.isVisible({ timeout: 3000 }).catch(() => false);
  }

  /**
   * 取得繳交按鈕文字
   */
  async getSubmitButtonText(): Promise<string> {
    try {
      return await this.submitButton.textContent() || '';
    } catch {
      return '';
    }
  }

  /**
   * 檢查繳交按鈕是否 disabled
   */
  async isSubmitButtonDisabled(): Promise<boolean> {
    try {
      return await this.submitButton.isDisabled();
    } catch {
      return true;
    }
  }

  /**
   * 等待「可繳交」狀態出現
   */
  async waitForCanSubmit(timeout: number = 10000): Promise<void> {
    await this.canSubmitBadge.waitFor({ state: 'visible', timeout });
  }

  /**
   * 等待「已繳交」狀態出現
   */
  async waitForSubmitted(timeout: number = 10000): Promise<void> {
    await this.submittedBadge.waitFor({ state: 'visible', timeout });
  }

  /**
   * 導航到課程單元頁面 (使用實際的 URL 格式)
   */
  async gotoLesson(journeyId: number, chapterId: number, lessonId: number) {
    await this.page.goto(`/journeys/${journeyId}/chapters/${chapterId}/missions/${lessonId}`);
  }
}
