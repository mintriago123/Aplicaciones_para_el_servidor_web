import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoService } from './cultivo.service';
import { CultivoController } from './cultivo.controller';
import { Cultivo } from './entities/cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  controllers: [CultivoController],
  providers: [CultivoService],
})
export class CultivoModule {}
