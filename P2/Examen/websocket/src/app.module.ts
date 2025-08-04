import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoberturasModule } from './coberturas/coberturas.module';
import { ConductorModule } from './conductor/conductor.module';
import { VehiculosModule } from './vehiculos/vehiculos.module';

@Module({
  imports: [CoberturasModule, ConductorModule, VehiculosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
