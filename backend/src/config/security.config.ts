import { registerAs } from '@nestjs/config';

export const SecurityConfig = registerAs('security', () => ({
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  corsCredentials: process.env.CORS_CREDENTIALS === 'true',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
}));
