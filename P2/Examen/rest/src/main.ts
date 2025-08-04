import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConductorModule } from './conductor/conductor.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de Swagger solo para conductor
  const config = new DocumentBuilder()
    .setTitle('API de Conductores')
    .setDescription('API REST para la gestión de conductores')
    .setVersion('1.0')
    .addTag('conductor', 'Operaciones relacionadas con conductores')
    .build();
  
  const document = SwaggerModule.createDocument(app, config, {
    include: [ConductorModule], // Incluir solo el módulo de conductor
    ignoreGlobalPrefix: false,
    deepScanRoutes: true
  });
  
  SwaggerModule.setup('api', app, document);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
