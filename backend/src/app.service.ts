import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getInfo(): object {
    return {
      name: this.configService.get<string>('APP_NAME', 'LegalHub AI'),
      version: this.configService.get<string>('APP_VERSION', '1.0.0'),
      environment: this.configService.get<string>('APP_ENV', 'development'),
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        api: '/api/v1',
        swagger: '/api/docs',
        health: '/health',
      },
    };
  }
}
