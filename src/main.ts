import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorLoggingInterceptor } from './common/logging/error-logging.interceptor';
import { JsonLogger } from './common/logging/json-logger';
import { RequestLoggingMiddleware } from './common/logging/request-logging.middleware';

const defaultAllowedOrigins = [
  'http://localhost:4200',
  'https://solutionssoft.vercel.app',
  'https://softsolutions-front-prod-brs-ewgbctepdgggewde.canadacentral-01.azurewebsites.net',
  'http://softsolutions-front-prod-brs-ewgbctepdgggewde.canadacentral-01.azurewebsites.net',
];

function getAllowedOrigins(): string[] {
  const extraOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return Array.from(new Set([...defaultAllowedOrigins, ...extraOrigins]));
}

async function bootstrap() {
  const logger = new JsonLogger();
  const app = await NestFactory.create(AppModule, { logger });

  app.useLogger(logger);

  const requestLoggingMiddleware = new RequestLoggingMiddleware(logger);
  app.use(requestLoggingMiddleware.use.bind(requestLoggingMiddleware));

  app.useGlobalInterceptors(new ErrorLoggingInterceptor(logger));

  app.enableCors({
    origin: getAllowedOrigins(),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API SoftSolutions')
    .setDescription('Documentação da API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
