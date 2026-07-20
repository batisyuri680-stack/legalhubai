import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@common/filters/http-exception.filter';
import { PrismaExceptionFilter } from '@common/filters/prisma-exception.filter';
import { LoggingInterceptor } from '@common/interceptors/logging.interceptor';
import { ResponseInterceptor } from '@common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Environment
  const nodeEnv = configService.get<string>('APP_ENV', 'development');
  const appPort = configService.get<number>('APP_PORT', 3000);
  const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3001');

  // ==========================================
  // SECURITY MIDDLEWARE
  // ==========================================

  // Helmet - Secure HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: nodeEnv === 'production',
      hsts: { maxAge: 31536000 },
      noSniff: true,
      xssFilter: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  // CORS - Cross-Origin Resource Sharing
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
    maxAge: 3600,
  });

  // Compression
  app.use(compression());

  // ==========================================
  // VALIDATION & SERIALIZATION
  // ==========================================

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
    }),
  );

  // ==========================================
  // GLOBAL FILTERS
  // ==========================================

  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // ==========================================
  // GLOBAL INTERCEPTORS
  // ==========================================

  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

  // ==========================================
  // API VERSIONING
  // ==========================================

  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });

  // ==========================================
  // SWAGGER DOCUMENTATION
  // ==========================================

  const swaggerConfig = new DocumentBuilder()
    .setTitle('LegalHub AI API')
    .setDescription('Production API for LegalHub AI Legal Marketplace Platform')
    .setVersion('1.0.0')
    .setContact({
      name: 'LegalHub AI',
      url: 'https://legalhubai.uz',
      email: 'support@legalhubai.uz',
    })
    .setLicense('MIT', '')
    .addServer(configService.get<string>('APP_URL', `http://localhost:${appPort}`))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Clients', 'Client profile')
    .addTag('Lawyers', 'Lawyer management')
    .addTag('Consultations', 'Consultation management')
    .addTag('Orders', 'Order management')
    .addTag('Payments', 'Payment processing')
    .addTag('Messages', 'Chat messaging')
    .addTag('Reviews', 'Reviews and ratings')
    .addTag('Admin', 'Administration endpoints')
    .addTag('AI', 'AI Legal Assistant')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: false,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 2,
      filter: true,
      showRequestHeaders: true,
    },
  });

  // ==========================================
  // HEALTH CHECK
  // ==========================================

  app.getHttpServer().get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: nodeEnv,
    });
  });

  // ==========================================
  // STARTUP
  // ==========================================

  await app.listen(appPort);

  console.log(`
╔════════════════════════════════════════════════════════════╗
║                  🚀 LegalHub AI Backend                    ║
║                  Production Ready v1.0.0                   ║
╚════════════════════════════════════════════════════════════╝

📍 Environment: ${nodeEnv.toUpperCase()}
🌐 Server: http://localhost:${appPort}
📚 API Docs: http://localhost:${appPort}/api/docs
💚 Health: http://localhost:${appPort}/health

✅ Server is running and ready to accept requests!
  `);
}

bootstrap().catch((error) => {
  console.error('🔴 Failed to start application:', error);
  process.exit(1);
});
