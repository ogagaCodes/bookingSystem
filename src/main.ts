import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Optional: prefix API
  app.setGlobalPrefix('api');
  const port = process.env.PORT ? Number(process.env.PORT) : 3180;
  await app.listen(port);
  console.log(`Booking service running on http://localhost:${port}`);
}
bootstrap().catch((err) => console.error(err));