import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('');
  console.log('🏁 E2E Test Suite Completed');
  console.log('📊 Check the test report for detailed results');
  console.log('');
  console.log('💡 Dev environment is still running. Stop it with:');
  console.log('   cd deploy && docker-compose -f docker-compose.dev.yml down');
  console.log('');
}

export default globalTeardown;
