import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatoAexportarService } from './dato-aexportar.service';
import { DatoAexportarController } from './dato-aexportar.controller';
import { DatoAexportar } from './entities/dato-aexportar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DatoAexportar])],
  controllers: [DatoAexportarController],
  providers: [DatoAexportarService],
})
export class DatoAexportarModule {}
