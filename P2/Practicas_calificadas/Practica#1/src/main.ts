import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('API AgroSense')
    .setDescription('Documentación de la API REST para cultivos, plagas y exportaciones')
    .setVersion('1.0')
    .addTag('cultivo')
    .addTag('plaga')
    .addTag('dato-aexportar')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger sigue en /api

  await app.listen(3000);
}
bootstrap();
