import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CultivoModule } from './cultivo/cultivo.module';
import { PlagaModule } from './plaga/plaga.module';
import { DatoAexportarModule } from './dato-aexportar/dato-aexportar.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true
    }),
    CultivoModule,
    PlagaModule,
    DatoAexportarModule,
  ],

})
export class AppModule {}
