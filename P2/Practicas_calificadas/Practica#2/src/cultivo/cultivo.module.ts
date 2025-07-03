import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoService } from './cultivo.service';
import { CultivoResolver } from './cultivo.resolver';
import { Cultivo } from './entities/cultivo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cultivo])],
  providers: [CultivoResolver, CultivoService],
})
export class CultivoModule {}
