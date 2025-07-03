import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlagaService } from './plaga.service';
import { PlagaResolver } from './plaga.resolver';
import { Plaga } from './entities/plaga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plaga])],
  providers: [PlagaResolver, PlagaService],
})
export class PlagaModule {}