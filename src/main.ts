import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ErrorLoggingInterceptor } from './common/logging/error-logging.interceptor';
import { JsonLogger } from './common/logging/json-logger';
import { RequestLoggingMiddleware } from './common/logging/request-logging.middleware';

async function bootstrap() {
  const logger = new JsonLogger();
  const app = await NestFactory.create(AppModule, { logger });

  app.useLogger(logger);

  const requestLoggingMiddleware = new RequestLoggingMiddleware(logger);
  app.use(requestLoggingMiddleware.use.bind(requestLoggingMiddleware));

  app.useGlobalInterceptors(new ErrorLoggingInterceptor(logger));

  app.enableCors({
    origin: [
    'http://localhost:4200',  
    'https://solutionssoft.vercel.app',
    'http://ec2-3-212-230-198.compute-1.amazonaws.com',
    'http://3.212.230.198'
  ],  
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
