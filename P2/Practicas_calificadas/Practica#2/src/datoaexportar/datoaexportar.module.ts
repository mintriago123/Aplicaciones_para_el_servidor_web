import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatoAExportarService } from './datoaexportar.service';
import { DatoAExportarResolver } from './datoaexportar.resolver';
import { DatoAExportar } from './entities/datoaexportar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatoAExportar])],
  providers: [DatoAExportarResolver, DatoAExportarService],
})
export class DatoAExportarModule {}