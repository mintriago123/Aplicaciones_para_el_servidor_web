import { Module } from '@nestjs/common';

import { VehiculosModule } from './vehiculos/vehiculos.module';
import { CoberturasModule } from './coberturas/coberturas.module';
import { ConductorModule } from './conductor/conductor.module';

@Module({
  imports: [VehiculosModule, CoberturasModule, ConductorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
