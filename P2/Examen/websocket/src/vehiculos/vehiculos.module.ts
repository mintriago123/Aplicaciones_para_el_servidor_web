import { Module } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { VehiculosGateway } from './vehiculos.gateway';

@Module({
  providers: [VehiculosGateway, VehiculosService],
})
export class VehiculosModule {}
