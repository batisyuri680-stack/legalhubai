import { registerAs } from '@nestjs/config';

export const JwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your-super-secret-key',
  expiresIn: process.env.JWT_EXPIRATION || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
}));
