import { Module } from '@nestjs/common';
import { CoberturasService } from './coberturas.service';
import { CoberturasResolver } from './coberturas.resolver';

@Module({
  providers: [CoberturasResolver, CoberturasService],
})
export class CoberturasModule {}
