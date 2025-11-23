export const TEST_TIMEOUTS = {
  SHORT: 5000,
  MEDIUM: 10000,
  LONG: 30000,
  VIDEO_LOAD: 15000,
  API_CALL: 5000,
};

export const VIDEO_CONFIG = {
  MIN_PROGRESS_SAVE_INTERVAL: 10000, // 10 seconds
  COMPLETION_THRESHOLD: 0.95, // 95% watched = completed
  SEEK_BUFFER: 5, // 5 seconds buffer for seek operations
};

export const XP_CONFIG = {
  VIDEO_COMPLETION_XP: 200,
  LEVEL_UP_THRESHOLD: 200, // XP needed to level up (can be adjusted)
};

export const USER_ROLES = {
  FREE: 'free',
  PAID: 'paid',
  ADMIN: 'admin',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/sign-in',
  SIGNUP: '/sign-up',
  COURSES: '/courses',
  PROFILE: '/profile',
  LEADERBOARD: '/leaderboard',
} as const;
