import { createEnv } from '@t3-oss/env-core';
import { config } from 'dotenv';
import { z } from 'zod';

config();

export const env = createEnv({
  server: {
    FRONTEND_URL: z.url().default('http://localhost:3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z
      .string()
      .optional()
      .default('3001')
      .transform((val) => parseInt(val, 10))
      .pipe(z.number().int().positive()),
    LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
    MONGODB_URI: z.string().default('mongodb://localhost:27017'),
    DB_NAME: z.string().default('myDatabase'),
    BETTER_AUTH_SECRET: z.string().default('default_secret_key'),
    BETTER_AUTH_URL: z.url().default('http://localhost:3001'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
