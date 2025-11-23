import { chromium, FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';

dotenv.config();

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting E2E Test Suite...');

  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  const apiURL = process.env.API_URL || 'http://localhost:8080';

  console.log('📍 Base URL:', baseURL);
  console.log('🔌 API URL:', apiURL);
  console.log('');
  console.log('⚠️  E2E tests require the dev environment to be running.');
  console.log('   Start it with: cd deploy && docker-compose -f docker-compose.dev.yml up -d');
  console.log('');

  console.log('⏳ Checking if services are ready...');

  // Check if backend is ready
  await waitForService(apiURL, '/api/health', 60000);

  // Check if frontend is ready
  await waitForService(baseURL, '/', 60000);

  console.log('✅ All services are ready!');
  console.log('🌱 Test data seeding is handled by backend on startup');
  console.log('');
}

async function waitForService(
  baseURL: string,
  path: string,
  timeout: number = 60000
): Promise<void> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const startTime = Date.now();
  const endTime = startTime + timeout;

  while (Date.now() < endTime) {
    try {
      const response = await page.goto(`${baseURL}${path}`, {
        timeout: 5000,
        waitUntil: 'domcontentloaded',
      });

      if (response && response.ok()) {
        console.log(`✓ ${baseURL}${path} is ready`);
        await browser.close();
        return;
      }
    } catch (error) {
      // Service not ready yet, wait and retry
      await page.waitForTimeout(2000);
    }
  }

  await browser.close();
  throw new Error(`Service ${baseURL}${path} did not become ready within ${timeout}ms`);
}

export default globalSetup;
