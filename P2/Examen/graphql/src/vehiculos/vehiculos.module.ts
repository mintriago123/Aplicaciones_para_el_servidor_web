import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosResolver } from './vehiculos.resolver';

@Module({
  providers: [VehiculosResolver, VehiculosService],
})
export class VehiculosModule {}
