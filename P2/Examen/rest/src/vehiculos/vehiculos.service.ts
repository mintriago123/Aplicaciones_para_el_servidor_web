import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';

@Injectable()
export class VehiculosService {
  private vehiculos: Vehiculo[] = [
    { id: 1, tipo: 'sedan', marca: 'Toyota', modelo: 'Corolla', anoFabricacion: 2020 },
    { id: 2, tipo: 'camioneta', marca: 'Ford', modelo: 'F-150', anoFabricacion: 2019 },
    { id: 3, tipo: 'SUV', marca: 'Honda', modelo: 'CR-V', anoFabricacion: 2021 },
    { id: 4, tipo: 'hatchback', marca: 'Volkswagen', modelo: 'Golf', anoFabricacion: 2018 },
  ];
  private nextId = 5;

  private readonly tiposPermitidos = [
    'sedan', 'camioneta', 'SUV', 'hatchback', 'deportivo', 'convertible', 'coupe'
  ];

  create(createVehiculoDto: CreateVehiculoDto): Vehiculo {
    // Validaciones de negocio
    this.validarDatosVehiculo(createVehiculoDto);

    // Validar vehículo único (marca + modelo + año)
    const vehiculoExistente = this.vehiculos.find(v => 
      v.marca.toLowerCase() === createVehiculoDto.marca.toLowerCase() &&
      v.modelo.toLowerCase() === createVehiculoDto.modelo.toLowerCase() &&
      v.anoFabricacion === createVehiculoDto.año
    );

    if (vehiculoExistente) {
      throw new BadRequestException(
        `Ya existe un vehículo ${createVehiculoDto.marca} ${createVehiculoDto.modelo} ${createVehiculoDto.año}`
      );
    }

    const nuevoVehiculo: Vehiculo = {
      id: this.nextId++,
      tipo: createVehiculoDto.tipo.toLowerCase(),
      marca: createVehiculoDto.marca.trim(),
      modelo: createVehiculoDto.modelo.trim(),
      anoFabricacion: createVehiculoDto.año,
    };

    this.vehiculos.push(nuevoVehiculo);
    return nuevoVehiculo;
  }

  findAll(): Vehiculo[] {
    return this.vehiculos.sort((a, b) => b.anoFabricacion - a.anoFabricacion);
  }

  findOne(id: number): Vehiculo {
    const vehiculo = this.vehiculos.find(v => v.id === id);
    
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    
    return vehiculo;
  }

  findByTipo(tipo: string): Vehiculo[] {
    return this.vehiculos.filter(v => v.tipo.toLowerCase() === tipo.toLowerCase());
  }

  findByMarca(marca: string): Vehiculo[] {
    return this.vehiculos.filter(v => v.marca.toLowerCase().includes(marca.toLowerCase()));
  }

  findByAnoRango(anoMinimo: number, anoMaximo: number): Vehiculo[] {
    return this.vehiculos.filter(v => 
      v.anoFabricacion >= anoMinimo && v.anoFabricacion <= anoMaximo
    );
  }

  findVehiculosNuevos(umbralAno: number = 2020): Vehiculo[] {
    return this.vehiculos.filter(v => v.anoFabricacion >= umbralAno);
  }

  findVehiculosAntiguos(umbralAno: number = 2015): Vehiculo[] {
    return this.vehiculos.filter(v => v.anoFabricacion <= umbralAno);
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

      const vehiculoExistente = this.vehiculos.find(v => 
        v.id !== id &&
        v.marca.toLowerCase() === marca.toLowerCase() &&
        v.modelo.toLowerCase() === modelo.toLowerCase() &&
        v.anoFabricacion === ano
      );

      if (vehiculoExistente) {
        throw new BadRequestException(`Ya existe un vehículo ${marca} ${modelo} ${ano}`);
      }
    }

    // Actualizar campos
    if (updateVehiculoDto.tipo !== undefined) {
      vehiculo.tipo = updateVehiculoDto.tipo.toLowerCase();
    }
    
    if (updateVehiculoDto.marca !== undefined) {
      vehiculo.marca = updateVehiculoDto.marca.trim();
    }
    
    if (updateVehiculoDto.modelo !== undefined) {
      vehiculo.modelo = updateVehiculoDto.modelo.trim();
    }
    
    if (updateVehiculoDto.año !== undefined) {
      vehiculo.anoFabricacion = updateVehiculoDto.año;
    }

    return vehiculo;
  }

  remove(id: number): boolean {
    const index = this.vehiculos.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }

    this.vehiculos.splice(index, 1);
    return true;
  }

  // Métodos de validación y lógica de negocio
  private validarDatosVehiculo(datos: CreateVehiculoDto): void {
    if (!datos.tipo?.trim()) {
      throw new BadRequestException('El tipo es requerido');
    }

    if (!this.tiposPermitidos.includes(datos.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de vehículo no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (!datos.marca?.trim()) {
      throw new BadRequestException('La marca es requerida');
    }

    if (!datos.modelo?.trim()) {
      throw new BadRequestException('El modelo es requerido');
    }

    if (!this.isValidAno(datos.año)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }
  }

  private isValidAno(ano: number): boolean {
    const currentYear = new Date().getFullYear();
    return ano >= 1900 && ano <= currentYear + 1;
  }

  // Métodos para estadísticas y reportes
  getEstadisticas() {
    const estadisticasTipo = this.getEstadisticasPorTipo();
    const estadisticasMarca = this.getEstadisticasPorMarca();
    const vehiculoMasNuevo = this.vehiculos.reduce((prev, current) => 
      prev.anoFabricacion > current.anoFabricacion ? prev : current
    );
    const vehiculoMasViejo = this.vehiculos.reduce((prev, current) => 
      prev.anoFabricacion < current.anoFabricacion ? prev : current
    );

    return {
      totalVehiculos: this.vehiculos.length,
      estadisticasTipo,
      estadisticasMarca,
      vehiculoMasNuevo,
      vehiculoMasViejo,
      anoPromedio: this.getAnoPromedio(),
      distribucionPorDecada: this.getDistribucionPorDecada(),
    };
  }

  private getEstadisticasPorTipo(): { [tipo: string]: number } {
    const stats: { [key: string]: number } = {};
    this.vehiculos.forEach(vehiculo => {
      stats[vehiculo.tipo] = (stats[vehiculo.tipo] || 0) + 1;
    });
    return stats;
  }

  private getEstadisticasPorMarca(): { [marca: string]: number } {
    const stats: { [key: string]: number } = {};
    this.vehiculos.forEach(vehiculo => {
      stats[vehiculo.marca] = (stats[vehiculo.marca] || 0) + 1;
    });
    return stats;
  }

  private getAnoPromedio(): number {
    if (this.vehiculos.length === 0) return 0;
    const suma = this.vehiculos.reduce((acc, vehiculo) => acc + vehiculo.anoFabricacion, 0);
    return Math.round(suma / this.vehiculos.length);
  }

  private getDistribucionPorDecada(): { [decada: string]: number } {
    const decadas: { [key: string]: number } = {};
    
    this.vehiculos.forEach(vehiculo => {
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
    return this.vehiculos.filter(v => 
      v.id !== id && (
        v.marca.toLowerCase() === vehiculo.marca.toLowerCase() ||
        v.tipo.toLowerCase() === vehiculo.tipo.toLowerCase() ||
        Math.abs(v.anoFabricacion - vehiculo.anoFabricacion) <= 2
      )
    );
  }

  recomendarVehiculos(presupuestoAno: number, tipoPreferido?: string): Vehiculo[] {
    let candidatos = this.vehiculos.filter(v => v.anoFabricacion >= presupuestoAno);
    
    if (tipoPreferido) {
      candidatos = candidatos.filter(v => v.tipo.toLowerCase() === tipoPreferido.toLowerCase());
    }
    
    return candidatos
      .sort((a, b) => b.anoFabricacion - a.anoFabricacion)
      .slice(0, 5); // Top 5 recomendaciones
  }
}
