import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CultivoService } from './cultivo.service';
import { CultivoGateway } from './cultivo.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  providers: [CultivoService, CultivoGateway],
  exports: [CultivoService],
})
export class CultivoModule {}