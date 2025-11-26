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
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    apiURL: process.env.API_URL || 'http://localhost:8080',
    dbConfig: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'waterball_lms',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
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
