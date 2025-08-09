import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ValidationPipe global
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger konfiguratsiyasi
  const config = new DocumentBuilder()
    .setTitle('Simple Store API')
    .setDescription('Mahsulotlar, foydalanuvchilar, wishlist va cart API hujjatlari')
    .setVersion('1.0')
    .addBearerAuth() // JWT uchun
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
  console.log(`📄 Swagger docs: ${await app.getUrl()}/api-docs`);
}
bootstrap();
