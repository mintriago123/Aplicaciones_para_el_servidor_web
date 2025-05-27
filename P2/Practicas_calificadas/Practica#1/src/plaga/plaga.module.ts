import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlagaService } from './plaga.service';
import { PlagaController } from './plaga.controller';
import { Plaga } from './entities/plaga.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Plaga])],
  controllers: [PlagaController],
  providers: [PlagaService],
})
export class PlagaModule {}
