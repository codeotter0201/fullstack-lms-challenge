export interface TestUser {
  email: string;
  password: string;
  displayName: string;
  isPremium: boolean;
  level?: number;
  experience?: number;
}

export const testUsers: Record<string, TestUser> = {
  freeUser: {
    email: 'free-user@test.com',
    password: 'Test123456!',
    displayName: 'Free Test User',
    isPremium: false,
    level: 1,
    experience: 0,
  },
  paidUser: {
    email: 'paid-user@test.com',
    password: 'Test123456!',
    displayName: 'Paid Test User',
    isPremium: true,
    level: 5,
    experience: 1200,
  },
  adminUser: {
    email: 'admin@test.com',
    password: 'Admin123456!',
    displayName: 'Admin User',
    isPremium: true,
    level: 10,
    experience: 5000,
  },
};

export function getTestUser(userType: keyof typeof testUsers): TestUser {
  return testUsers[userType];
}

export function generateRandomEmail(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `test-user-${timestamp}-${random}@e2e-test.com`;
}

export function createTestUser(
  email?: string,
  displayName?: string,
  isPremium: boolean = false
): TestUser {
  return {
    email: email || generateRandomEmail(),
    password: 'Test123456!',
    displayName: displayName || `Test User ${Date.now()}`,
    isPremium,
    level: isPremium ? 5 : 1,
    experience: isPremium ? 1200 : 0,
  };
}
