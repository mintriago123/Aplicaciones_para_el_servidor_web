import { Module } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { ConductorGateway } from './conductor.gateway';

@Module({
  providers: [ConductorGateway, ConductorService],
})
export class ConductorModule {}
