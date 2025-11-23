export type Environment = 'local' | 'ci' | 'staging' | 'prod';

export interface EnvironmentConfig {
  baseURL: string;
  apiURL: string;
  dbConfig?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
  };
}

const environments: Record<Environment, EnvironmentConfig> = {
  local: {
    baseURL: 'http://localhost:3001',
    apiURL: 'http://localhost:8081',
    dbConfig: {
      host: 'localhost',
      port: 5433,
      database: 'waterball_lms_test',
      user: 'test_user',
      password: 'test_password',
    },
  },
  ci: {
    baseURL: 'http://frontend-test:3000',
    apiURL: 'http://backend-test:8080',
    dbConfig: {
      host: 'postgres-test',
      port: 5432,
      database: 'waterball_lms_test',
      user: 'test_user',
      password: 'test_password',
    },
  },
  staging: {
    baseURL: process.env.STAGING_FRONTEND_URL || 'https://staging.waterball-lms.com',
    apiURL: process.env.STAGING_API_URL || 'https://api-staging.waterball-lms.com',
  },
  prod: {
    baseURL: process.env.PROD_FRONTEND_URL || 'https://waterball-lms.com',
    apiURL: process.env.PROD_API_URL || 'https://api.waterball-lms.com',
  },
};

export function getEnvironmentConfig(): EnvironmentConfig {
  const env = (process.env.TEST_ENV || 'local') as Environment;
  return environments[env];
}
