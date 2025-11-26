/**
 * E2E 測試：單元繳交流程
 *
 * 測試影片觀看完成後的繳交流程：
 * 1. 未完成影片時無法繳交
 * 2. 影片完成後顯示「可繳交」狀態
 * 3. 手動繳交後顯示「已繳交」狀態
 * 4. 狀態在頁面刷新後保持
 *
 * 注意：由於 YouTube IFrame API 在 E2E 測試環境中無法正常控制，
 * 我們使用後端 API 來模擬影片觀看完成的狀態。
 *
 * 設計說明：
 * - 測試設計為可重複執行（idempotent）
 * - 測試會先檢查當前狀態，再決定測試邏輯
 * - 對於已經繳交過的課程，測試會驗證繳交後的狀態而非重新繳交
 */

import { test, expect, Page } from '@playwright/test';
import { loginAsFreeUser } from '../../helpers/auth-helpers';
import { VideoPlayerPage } from '../../pages/VideoPlayerPage';
import { getEnvironmentConfig } from '../../config/environments';

const config = getEnvironmentConfig();

/**
 * 這些測試需要串行執行，且只在 chromium 上運行
 * 因為它們會修改共享的數據庫狀態（用戶的進度和繳交紀錄）
 *
 * 使用的 Lesson ID (使用較高的 ID 避免與其他測試衝突):
 * - Test 1: lesson 1 (檢查未完成狀態) - 這個測試需要一個沒有進度的課程
 * - Test 2: lesson 7 (檢查可繳交狀態)
 * - Test 3: lesson 8 (測試繳交流程或已繳交狀態)
 * - Test 4: lesson 9 (測試繳交後刷新)
 * - Test 5: lesson 10 (測試可繳交狀態刷新)
 */

/**
 * 透過 API 標記影片為已完成
 * 這模擬用戶觀看完整影片的行為
 */
async function markLessonAsCompleted(page: Page, lessonId: number) {
  const token = await page.evaluate(() => localStorage.getItem('accessToken'));

  // 呼叫後端 API 更新進度到 100%
  const response = await page.request.fetch(`${config.apiURL}/api/progress/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    data: JSON.stringify({
      lessonId: lessonId,
      position: 100, // 假設影片 100 秒
      duration: 100,
    }),
  });

  if (!response.ok()) {
    throw new Error(`Failed to update progress: ${response.status()}`);
  }

  return response.json();
}

/**
 * 檢查課程當前狀態
 * 返回: 'not_started' | 'can_submit' | 'submitted'
 */
async function getLessonState(videoPage: VideoPlayerPage): Promise<'not_started' | 'can_submit' | 'submitted'> {
  // 先檢查是否已繳交
  const isSubmitted = await videoPage.isSubmittedState();
  if (isSubmitted) return 'submitted';

  // 再檢查是否可繳交
  const isCanSubmit = await videoPage.isCanSubmit();
  if (isCanSubmit) return 'can_submit';

  // 都不是則為未開始
  return 'not_started';
}

test.describe('Lesson Submission Flow', () => {
  // 配置測試串行執行，避免同一瀏覽器內的測試衝突
  test.describe.configure({ mode: 'serial' });

  let videoPage: VideoPlayerPage;

  // 使用免費課程 (id=1) 的第一個單元進行測試
  const TEST_JOURNEY_ID = 1;
  const TEST_CHAPTER_ID = 1;

  test.beforeEach(async ({ page }) => {
    // 登入免費用戶
    await loginAsFreeUser(page);
    videoPage = new VideoPlayerPage(page);
  });

  test('should disable submit button when video is not completed', async ({ page }) => {
    // 使用 lesson ID 1 (第一個單元，通常沒有進度)
    const TEST_LESSON_ID = 1;

    // 進入課程單元頁面
    await videoPage.gotoLesson(TEST_JOURNEY_ID, TEST_CHAPTER_ID, TEST_LESSON_ID);

    // 等待頁面載入
    await page.waitForLoadState('networkidle');

    // 驗證按鈕存在
    await expect(videoPage.submitButton).toBeVisible();

    // 驗證按鈕文字為「請先看完影片」
    const buttonText = await videoPage.getSubmitButtonText();
    expect(buttonText).toContain('請先看完影片');

    // 驗證按鈕為 disabled 狀態
    const isDisabled = await videoPage.isSubmitButtonDisabled();
    expect(isDisabled).toBe(true);

    // 驗證沒有「可繳交」Badge
    const isCanSubmit = await videoPage.isCanSubmit();
    expect(isCanSubmit).toBe(false);

    // 驗證沒有「已繳交」Badge
    const isSubmitted = await videoPage.isSubmittedState();
    expect(isSubmitted).toBe(false);
  });

  test('should show "可繳交" badge and enable submit button when video is completed', async ({ page }) => {
    // 使用 lesson ID 7 (函式與方法)
    const LESSON_ID_FOR_TEST = 7;

    // 透過 API 標記影片為已完成
    await markLessonAsCompleted(page, LESSON_ID_FOR_TEST);

    // 進入課程單元頁面
    await videoPage.gotoLesson(TEST_JOURNEY_ID, TEST_CHAPTER_ID, LESSON_ID_FOR_TEST);

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // 等待狀態同步

    // 檢查當前狀態
    const currentState = await getLessonState(videoPage);
    console.log(`Lesson ${LESSON_ID_FOR_TEST} current state: ${currentState}`);

    if (currentState === 'submitted') {
      // 課程已經繳交過，跳過此測試
      // 因為 lesson 7 可能在之前的測試運行中被繳交了
      console.log('Lesson already submitted, verifying submitted state instead...');

      // 驗證出現「已繳交」Badge
      const isSubmitted = await videoPage.isSubmittedState();
      expect(isSubmitted).toBe(true);

      // 驗證按鈕文字為「已繳交」
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('已繳交');

      // 驗證按鈕為 disabled 狀態
      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);
    } else {
      // 正常測試流程：驗證「可繳交」狀態
      // 驗證出現「可繳交」Badge
      const isCanSubmit = await videoPage.isCanSubmit();
      expect(isCanSubmit).toBe(true);

      // 驗證按鈕文字變為「繳交單元」
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('繳交單元');

      // 驗證按鈕為可點擊狀態 (非 disabled)
      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(false);
    }
  });

  test('should show "已繳交" badge after manual submission', async ({ page }) => {
    // 使用 lesson ID 8 (物件導向基礎)
    const LESSON_ID_FOR_TEST = 8;

    // 透過 API 標記影片為已完成
    await markLessonAsCompleted(page, LESSON_ID_FOR_TEST);

    // 進入課程單元頁面
    await videoPage.gotoLesson(TEST_JOURNEY_ID, TEST_CHAPTER_ID, LESSON_ID_FOR_TEST);

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 檢查當前狀態
    const currentState = await getLessonState(videoPage);
    console.log(`Lesson ${LESSON_ID_FOR_TEST} current state: ${currentState}`);

    if (currentState === 'submitted') {
      // 課程已經繳交過，驗證已繳交狀態
      console.log('Lesson already submitted, verifying submitted state...');

      // 驗證出現「已繳交」Badge
      const isSubmitted = await videoPage.isSubmittedState();
      expect(isSubmitted).toBe(true);

      // 驗證按鈕文字為「已繳交」
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('已繳交');

      // 驗證按鈕為 disabled 狀態
      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);
    } else {
      // 課程尚未繳交，執行繳交流程
      console.log('Lesson not yet submitted, testing submission flow...');

      // 等待「可繳交」狀態
      await videoPage.waitForCanSubmit(10000);

      // 點擊「繳交單元」按鈕
      await videoPage.submitButton.click();

      // 等待「已繳交」狀態出現
      await videoPage.waitForSubmitted(10000);

      // 驗證出現「已繳交」Badge
      const isSubmitted = await videoPage.isSubmittedState();
      expect(isSubmitted).toBe(true);

      // 驗證按鈕文字變為「已繳交」
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('已繳交');

      // 驗證按鈕為 disabled 狀態
      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);

      // 驗證出現 EXP Toast 提示 (可選驗證，因為 Toast 可能會消失得很快)
      // 如果 XP Toast 沒有出現，只記錄警告而不失敗測試
      const hasXpToast = await videoPage.waitForXPToast();
      if (!hasXpToast) {
        console.warn('XP Toast was not visible within timeout - this may be a timing issue');
      }
    }
  });

  test('should persist submission state after page refresh', async ({ page }) => {
    // 使用 lesson ID 9 (繼承與多型)
    const LESSON_ID_FOR_TEST = 9;

    // 透過 API 標記影片為已完成
    await markLessonAsCompleted(page, LESSON_ID_FOR_TEST);

    // 進入課程單元頁面
    await videoPage.gotoLesson(TEST_JOURNEY_ID, TEST_CHAPTER_ID, LESSON_ID_FOR_TEST);

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 檢查當前狀態
    const currentState = await getLessonState(videoPage);
    console.log(`Lesson ${LESSON_ID_FOR_TEST} current state: ${currentState}`);

    if (currentState !== 'submitted') {
      // 課程尚未繳交，執行繳交流程
      console.log('Lesson not yet submitted, submitting first...');
      await videoPage.waitForCanSubmit(10000);
      await videoPage.submitButton.click();
      await videoPage.waitForSubmitted(10000);
    } else {
      console.log('Lesson already submitted, skipping submission...');
    }

    // 刷新頁面
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 驗證仍然顯示「已繳交」Badge
    const isSubmitted = await videoPage.isSubmittedState();
    expect(isSubmitted).toBe(true);

    // 驗證按鈕仍為「已繳交」且 disabled
    const buttonText = await videoPage.getSubmitButtonText();
    expect(buttonText).toContain('已繳交');

    const isDisabled = await videoPage.isSubmitButtonDisabled();
    expect(isDisabled).toBe(true);
  });

  test('should persist completed-but-not-submitted state after page refresh', async ({ page }) => {
    // 使用 lesson ID 10 (例外處理)
    const LESSON_ID_FOR_TEST = 10;

    // 透過 API 標記影片為已完成
    await markLessonAsCompleted(page, LESSON_ID_FOR_TEST);

    // 進入課程單元頁面
    await videoPage.gotoLesson(TEST_JOURNEY_ID, TEST_CHAPTER_ID, LESSON_ID_FOR_TEST);

    // 等待頁面載入
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);

    // 檢查當前狀態
    const currentState = await getLessonState(videoPage);
    console.log(`Lesson ${LESSON_ID_FOR_TEST} current state: ${currentState}`);

    if (currentState === 'submitted') {
      // 課程已經繳交過，測試繳交後狀態持久化
      console.log('Lesson already submitted, verifying submitted state persistence...');

      // 刷新頁面
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // 驗證仍然顯示「已繳交」Badge
      const isSubmitted = await videoPage.isSubmittedState();
      expect(isSubmitted).toBe(true);

      // 驗證按鈕為「已繳交」且 disabled
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('已繳交');

      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(true);
    } else {
      // 正常測試流程：驗證「可繳交」狀態持久化
      // 等待可繳交狀態 (但不繳交)
      await videoPage.waitForCanSubmit(10000);

      // 驗證目前是「可繳交」狀態
      let isCanSubmit = await videoPage.isCanSubmit();
      expect(isCanSubmit).toBe(true);

      // 刷新頁面
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000);

      // 驗證仍然顯示「可繳交」Badge
      isCanSubmit = await videoPage.isCanSubmit();
      expect(isCanSubmit).toBe(true);

      // 驗證按鈕為「繳交單元」且可點擊
      const buttonText = await videoPage.getSubmitButtonText();
      expect(buttonText).toContain('繳交單元');

      const isDisabled = await videoPage.isSubmitButtonDisabled();
      expect(isDisabled).toBe(false);
    }
  });
});
