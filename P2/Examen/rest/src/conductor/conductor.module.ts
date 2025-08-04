import { Module } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { ConductorController } from './conductor.controller';

@Module({
  controllers: [ConductorController],
  providers: [ConductorService],
})
export class ConductorModule {}
