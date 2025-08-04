import { Module } from '@nestjs/common';
import { CoberturasService } from './coberturas.service';
import { CoberturasController } from './coberturas.controller';

@Module({
  controllers: [CoberturasController],
  providers: [CoberturasService],
})
export class CoberturasModule {}
