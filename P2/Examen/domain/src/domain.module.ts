import { Module } from '@nestjs/common';
import { VehiculoDomainService, ConductorDomainService, CoberturaDomainService } from './services';
import { 
  InMemoryVehiculoRepository, 
  InMemoryConductorRepository, 
  InMemoryCoberturaRepository 
} from './repositories';
import { 
  IVehiculoRepository, 
  IConductorRepository, 
  ICoberturaRepository 
} from './interfaces';

// Tokens para inyección de dependencias
export const VEHICULO_REPOSITORY = 'VEHICULO_REPOSITORY';
export const CONDUCTOR_REPOSITORY = 'CONDUCTOR_REPOSITORY';
export const COBERTURA_REPOSITORY = 'COBERTURA_REPOSITORY';

@Module({
  providers: [
    // Repositorios
    {
      provide: VEHICULO_REPOSITORY,
      useClass: InMemoryVehiculoRepository,
    },
    {
      provide: CONDUCTOR_REPOSITORY,
      useClass: InMemoryConductorRepository,
    },
    {
      provide: COBERTURA_REPOSITORY,
      useClass: InMemoryCoberturaRepository,
    },
    // Servicios de dominio
    {
      provide: VehiculoDomainService,
      useFactory: (vehiculoRepository: IVehiculoRepository) => {
        return new VehiculoDomainService(vehiculoRepository);
      },
      inject: [VEHICULO_REPOSITORY],
    },
    {
      provide: ConductorDomainService,
      useFactory: (conductorRepository: IConductorRepository) => {
        return new ConductorDomainService(conductorRepository);
      },
      inject: [CONDUCTOR_REPOSITORY],
    },
    {
      provide: CoberturaDomainService,
      useFactory: (coberturaRepository: ICoberturaRepository) => {
        return new CoberturaDomainService(coberturaRepository);
      },
      inject: [COBERTURA_REPOSITORY],
    },
  ],
  exports: [
    VehiculoDomainService,
    ConductorDomainService,
    CoberturaDomainService,
    VEHICULO_REPOSITORY,
    CONDUCTOR_REPOSITORY,
    COBERTURA_REPOSITORY,
  ],
})
export class DomainModule {}
