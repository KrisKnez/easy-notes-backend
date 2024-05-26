import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGINS || true,
    credentials: true,
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

  // Modify the document to fix the @ApiQuery issue
  for (const path of Object.values(document.paths)) {
    for (const operation of Object.values(path)) {
      if (operation.parameters) {
        for (const parameter of operation.parameters) {
          if (parameter.content) {
            delete parameter.schema;
          }
        }
      }
    }
  }
}
bootstrap();
