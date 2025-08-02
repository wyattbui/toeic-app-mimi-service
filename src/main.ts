import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Enable CORS
  app.enableCors();

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3333);
  console.log('🚀 TOEIC API running on http://localhost:3333');
}
bootstrap();
