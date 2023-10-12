import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: process.env.CORS_ORIGINS || true,
    credentials: true,
    preflightContinue: true,
    // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  const config = new DocumentBuilder()
    .setTitle('EasyNotes API')
    .setDescription('Documentation for EasyNotes API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  app.useGlobalPipes(
    new ValidationPipe({
      // Require decorator for field to be present
      whitelist: true,

      // Use class-transformer
      transform: true,

      // Use validator and transformer in response
      always: true,
    }),
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
