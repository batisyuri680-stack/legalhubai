import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  maxConnections: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
  minConnections: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
}));
