import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatoAexportar } from './entities/datoaexportar.entity';
import { DatoAexportarService } from './datoaexportar.service';
import { DatoAexportarGateway } from './datoaexportar.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([DatoAexportar])],
  providers: [DatoAexportarService, DatoAexportarGateway],
  exports: [DatoAexportarService],
})
export class DatoaexportarModule {}