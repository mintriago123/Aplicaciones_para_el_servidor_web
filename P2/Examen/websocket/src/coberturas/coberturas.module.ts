import { Module } from '@nestjs/common';
import { CoberturasService } from './coberturas.service';
import { CoberturasGateway } from './coberturas.gateway';

@Module({
  providers: [CoberturasGateway, CoberturasService],
})
export class CoberturasModule {}
