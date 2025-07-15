import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plaga } from './entities/plaga.entity';
import { PlagaService } from './plaga.service';
import { PlagaGateway } from './plaga.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Plaga])],
  providers: [PlagaService, PlagaGateway],
  exports: [PlagaService],
})
export class PlagaModule {}