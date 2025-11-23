import { Page, APIRequestContext } from '@playwright/test';
import { getEnvironmentConfig } from '../config/environments';

const config = getEnvironmentConfig();

export async function makeAPIRequest(
  page: Page,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
) {
  const token = await page.evaluate(() => localStorage.getItem('authToken'));

  const response = await page.request.fetch(`${config.apiURL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: data ? JSON.stringify(data) : undefined,
  });

  return response;
}

export async function getUserProfile(page: Page) {
  const response = await makeAPIRequest(page, 'GET', '/api/users/me');
  return await response.json();
}

export async function getCourses(page: Page) {
  const response = await makeAPIRequest(page, 'GET', '/api/courses');
  return await response.json();
}

export async function getLessonProgress(page: Page, lessonId: number) {
  const response = await makeAPIRequest(page, 'GET', `/api/progress/lesson/${lessonId}`);
  return await response.json();
}

export async function saveProgress(page: Page, lessonId: number, progress: number) {
  const response = await makeAPIRequest(page, 'POST', '/api/progress', {
    lessonId,
    progress,
  });
  return await response.json();
}

export async function submitLesson(page: Page, lessonId: number) {
  const response = await makeAPIRequest(page, 'POST', `/api/lessons/${lessonId}/submit`);
  return await response.json();
}

export async function getLeaderboard(page: Page) {
  const response = await makeAPIRequest(page, 'GET', '/api/leaderboard');
  return await response.json();
}

export async function interceptAPIRequests(page: Page, pattern: string | RegExp): Promise<any[]> {
  const requests: any[] = [];

  page.on('request', (request) => {
    const url = request.url();
    const matches = typeof pattern === 'string' ? url.includes(pattern) : pattern.test(url);

    if (matches) {
      requests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
        headers: request.headers(),
        timestamp: new Date(),
      });
    }
  });

  return requests;
}

export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout: number = 5000
) {
  return await page.waitForResponse(
    (response) => {
      const url = response.url();
      return typeof urlPattern === 'string' ? url.includes(urlPattern) : urlPattern.test(url);
    },
    { timeout }
  );
}
