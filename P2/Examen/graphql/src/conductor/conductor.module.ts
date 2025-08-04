import { Module } from '@nestjs/common';
import { ConductorService } from './conductor.service';
import { ConductorResolver } from './conductor.resolver';

@Module({
  providers: [ConductorResolver, ConductorService],
})
export class ConductorModule {}
