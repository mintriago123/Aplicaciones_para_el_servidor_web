import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Vehiculo } from '../entities/vehiculo.entity';
import { CreateVehiculoDto, UpdateVehiculoDto } from '../dto/vehiculo.dto';
import type { IVehiculoRepository } from '../interfaces/vehiculo.repository.interface';

@Injectable()
export class VehiculoDomainService {
  private readonly tiposPermitidos = [
    'sedan', 'camioneta', 'SUV', 'hatchback', 'deportivo', 'convertible', 'coupe'
  ];

  constructor(private readonly vehiculoRepository: IVehiculoRepository) {}

  create(createVehiculoDto: CreateVehiculoDto): Vehiculo {
    // Validaciones de negocio
    this.validarDatosVehiculo(createVehiculoDto);

    // Validar vehículo único (marca + modelo + año)
    if (this.vehiculoRepository.exists(
      createVehiculoDto.marca,
      createVehiculoDto.modelo,
      createVehiculoDto.año
    )) {
      throw new BadRequestException(
        `Ya existe un vehículo ${createVehiculoDto.marca} ${createVehiculoDto.modelo} ${createVehiculoDto.año}`
      );
    }

    return this.vehiculoRepository.create(createVehiculoDto);
  }

  findAll(): Vehiculo[] {
    return this.vehiculoRepository.findAll()
      .sort((a, b) => b.anoFabricacion - a.anoFabricacion);
  }

  findOne(id: number): Vehiculo {
    const vehiculo = this.vehiculoRepository.findOne(id);
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    return vehiculo;
  }

  findByTipo(tipo: string): Vehiculo[] {
    return this.vehiculoRepository.findByTipo(tipo);
  }

  findByMarca(marca: string): Vehiculo[] {
    return this.vehiculoRepository.findByMarca(marca);
  }

  findByAnoRango(anoMinimo: number, anoMaximo: number): Vehiculo[] {
    return this.vehiculoRepository.findByAnoRango(anoMinimo, anoMaximo);
  }

  findVehiculosNuevos(umbralAno: number = 2020): Vehiculo[] {
    const currentYear = new Date().getFullYear();
    return this.vehiculoRepository.findByAnoRango(umbralAno, currentYear + 1);
  }

  findVehiculosAntiguos(umbralAno: number = 2015): Vehiculo[] {
    return this.vehiculoRepository.findByAnoRango(1900, umbralAno);
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto): Vehiculo {
    const vehiculo = this.findOne(id);

    // Validar datos si se proporcionan
    if (updateVehiculoDto.tipo && !this.tiposPermitidos.includes(updateVehiculoDto.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de vehículo no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (updateVehiculoDto.año && !this.isValidAno(updateVehiculoDto.año)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }

    // Validar unicidad si se actualizan campos clave
    if (updateVehiculoDto.marca || updateVehiculoDto.modelo || updateVehiculoDto.año) {
      const marca = updateVehiculoDto.marca || vehiculo.marca;
      const modelo = updateVehiculoDto.modelo || vehiculo.modelo;
      const ano = updateVehiculoDto.año || vehiculo.anoFabricacion;

      if (this.vehiculoRepository.exists(marca, modelo, ano) && 
          !(vehiculo.marca === marca && vehiculo.modelo === modelo && vehiculo.anoFabricacion === ano)) {
        throw new BadRequestException(`Ya existe un vehículo ${marca} ${modelo} ${ano}`);
      }
    }

    return this.vehiculoRepository.update(id, updateVehiculoDto);
  }

  remove(id: number): void {
    this.findOne(id); // Verificar que existe
    this.vehiculoRepository.remove(id);
  }

  private validarDatosVehiculo(datos: CreateVehiculoDto | UpdateVehiculoDto): void {
    if ('tipo' in datos && datos.tipo && !this.tiposPermitidos.includes(datos.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de vehículo no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if ('marca' in datos && datos.marca && !datos.marca.trim()) {
      throw new BadRequestException('La marca es requerida');
    }

    if ('modelo' in datos && datos.modelo && !datos.modelo.trim()) {
      throw new BadRequestException('El modelo es requerido');
    }

    if ('año' in datos && datos.año && !this.isValidAno(datos.año)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }
  }

  private isValidAno(ano: number): boolean {
    const currentYear = new Date().getFullYear();
    return ano >= 1900 && ano <= currentYear + 1;
  }

  // Métodos para estadísticas y reportes
  getEstadisticas() {
    const vehiculos = this.vehiculoRepository.findAll();
    const estadisticasTipo = this.getEstadisticasPorTipo(vehiculos);
    const estadisticasMarca = this.getEstadisticasPorMarca(vehiculos);
    
    if (vehiculos.length === 0) {
      return {
        totalVehiculos: 0,
        estadisticasTipo: {},
        estadisticasMarca: {},
        vehiculoMasNuevo: null,
        vehiculoMasViejo: null,
        anoPromedio: 0,
        distribucionPorDecada: {},
      };
    }

    const vehiculoMasNuevo = vehiculos.reduce((prev, current) => 
      prev.anoFabricacion > current.anoFabricacion ? prev : current
    );
    const vehiculoMasViejo = vehiculos.reduce((prev, current) => 
      prev.anoFabricacion < current.anoFabricacion ? prev : current
    );

    return {
      totalVehiculos: vehiculos.length,
      estadisticasTipo,
      estadisticasMarca,
      vehiculoMasNuevo,
      vehiculoMasViejo,
      anoPromedio: this.getAnoPromedio(vehiculos),
      distribucionPorDecada: this.getDistribucionPorDecada(vehiculos),
    };
  }

  private getEstadisticasPorTipo(vehiculos: Vehiculo[]): { [tipo: string]: number } {
    const stats: { [key: string]: number } = {};
    vehiculos.forEach(vehiculo => {
      stats[vehiculo.tipo] = (stats[vehiculo.tipo] || 0) + 1;
    });
    return stats;
  }

  private getEstadisticasPorMarca(vehiculos: Vehiculo[]): { [marca: string]: number } {
    const stats: { [key: string]: number } = {};
    vehiculos.forEach(vehiculo => {
      stats[vehiculo.marca] = (stats[vehiculo.marca] || 0) + 1;
    });
    return stats;
  }

  private getAnoPromedio(vehiculos: Vehiculo[]): number {
    if (vehiculos.length === 0) return 0;
    const suma = vehiculos.reduce((acc, vehiculo) => acc + vehiculo.anoFabricacion, 0);
    return Math.round(suma / vehiculos.length);
  }

  private getDistribucionPorDecada(vehiculos: Vehiculo[]): { [decada: string]: number } {
    const decadas: { [key: string]: number } = {};
    
    vehiculos.forEach(vehiculo => {
      const decada = Math.floor(vehiculo.anoFabricacion / 10) * 10;
      const decadaKey = `${decada}s`;
      decadas[decadaKey] = (decadas[decadaKey] || 0) + 1;
    });
    
    return decadas;
  }

  getTiposPermitidos(): string[] {
    return [...this.tiposPermitidos];
  }

  // Métodos de negocio específicos
  calcularEdadVehiculo(id: number): number {
    const vehiculo = this.findOne(id);
    const anoActual = new Date().getFullYear();
    return anoActual - vehiculo.anoFabricacion;
  }

  esVehiculoNuevo(id: number, umbralAnos: number = 3): boolean {
    const edad = this.calcularEdadVehiculo(id);
    return edad <= umbralAnos;
  }

  esVehiculoAntiguo(id: number, umbralAnos: number = 10): boolean {
    const edad = this.calcularEdadVehiculo(id);
    return edad >= umbralAnos;
  }

  generarCodigoVehiculo(id: number): string {
    const vehiculo = this.findOne(id);
    const marca = vehiculo.marca.substring(0, 3).toUpperCase();
    const modelo = vehiculo.modelo.substring(0, 3).toUpperCase();
    const ano = vehiculo.anoFabricacion.toString().substring(2);
    return `${marca}${modelo}${ano}${id.toString().padStart(3, '0')}`;
  }

  buscarVehiculosSimilares(id: number): Vehiculo[] {
    const vehiculo = this.findOne(id);
    const vehiculos = this.vehiculoRepository.findAll();
    
    return vehiculos.filter(v => 
      v.id !== id && (
        v.marca.toLowerCase() === vehiculo.marca.toLowerCase() ||
        v.tipo.toLowerCase() === vehiculo.tipo.toLowerCase() ||
        Math.abs(v.anoFabricacion - vehiculo.anoFabricacion) <= 2
      )
    );
  }

  recomendarVehiculos(presupuestoAno: number, tipoPreferido?: string): Vehiculo[] {
    const currentYear = new Date().getFullYear();
    let candidatos = this.vehiculoRepository.findByAnoRango(presupuestoAno, currentYear + 1);
    
    if (tipoPreferido) {
      candidatos = candidatos.filter(v => v.tipo.toLowerCase() === tipoPreferido.toLowerCase());
    }
    
    return candidatos
      .sort((a, b) => b.anoFabricacion - a.anoFabricacion)
      .slice(0, 5); // Top 5 recomendaciones
  }
}
