import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CultivoModule } from './cultivo/cultivo.module';
import { DatoaexportarModule } from './datoaexportar/datoaexportar.module';
import { PlagaModule } from './plaga/plaga.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      synchronize: true,
      autoLoadEntities: true
    }),

    CultivoModule, 
    DatoaexportarModule, 
    PlagaModule

  ],
  controllers: [],
  providers: [],


})

export class AppModule {}


