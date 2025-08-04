import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVehiculoInput } from './dto/create-vehiculo.input';
import { UpdateVehiculoInput } from './dto/update-vehiculo.input';
import { Vehiculo } from './entities/vehiculo.entity';

@Injectable()
export class VehiculosService {
  private vehiculos: Vehiculo[] = [
    { id: 1, tipo: 'sedan', marca: 'Toyota', modelo: 'Corolla', anioFabricacion: 2020 },
    { id: 2, tipo: 'camioneta', marca: 'Ford', modelo: 'F-150', anioFabricacion: 2019 },
    { id: 3, tipo: 'SUV', marca: 'Honda', modelo: 'CR-V', anioFabricacion: 2021 },
  ];
  private nextId = 4;

  private readonly tiposPermitidos = [
    'sedan', 'camioneta', 'SUV', 'hatchback', 'deportivo', 'convertible', 'coupe'
  ];

  create(createVehiculoInput: CreateVehiculoInput): Vehiculo {
    // Validaciones de negocio
    this.validarDatosVehiculo(createVehiculoInput);

    // Validar vehículo único (marca + modelo + año)
    const vehiculoExistente = this.vehiculos.find(v => 
      v.marca.toLowerCase() === createVehiculoInput.marca.toLowerCase() &&
      v.modelo.toLowerCase() === createVehiculoInput.modelo.toLowerCase() &&
      v.anioFabricacion === createVehiculoInput.anioFabricacion
    );

    if (vehiculoExistente) {
      throw new BadRequestException(
        `Ya existe un vehículo ${createVehiculoInput.marca} ${createVehiculoInput.modelo} ${createVehiculoInput.anioFabricacion}`
      );
    }

    const nuevoVehiculo: Vehiculo = {
      id: this.nextId++,
      tipo: createVehiculoInput.tipo.toLowerCase(),
      marca: createVehiculoInput.marca.trim(),
      modelo: createVehiculoInput.modelo.trim(),
      anioFabricacion: createVehiculoInput.anioFabricacion,
    };

    this.vehiculos.push(nuevoVehiculo);
    return nuevoVehiculo;
  }

  findAll(): Vehiculo[] {
    return this.vehiculos.sort((a, b) => b.anioFabricacion - a.anioFabricacion);
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
      v.anioFabricacion >= anoMinimo && v.anioFabricacion <= anoMaximo
    );
  }

  update(id: number, updateVehiculoInput: UpdateVehiculoInput): Vehiculo {
    const vehiculo = this.findOne(id);

    // Validar datos si se proporcionan
    if (updateVehiculoInput.tipo && !this.tiposPermitidos.includes(updateVehiculoInput.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de vehículo no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (updateVehiculoInput.anioFabricacion && !this.isValidAño(updateVehiculoInput.anioFabricacion)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }

    // Validar unicidad si se actualizan campos clave
    if (updateVehiculoInput.marca || updateVehiculoInput.modelo || updateVehiculoInput.anioFabricacion) {
      const marca = updateVehiculoInput.marca || vehiculo.marca;
      const modelo = updateVehiculoInput.modelo || vehiculo.modelo;
      const año = updateVehiculoInput.anioFabricacion || vehiculo.anioFabricacion;

      const vehiculoExistente = this.vehiculos.find(v => 
        v.id !== id &&
        v.marca.toLowerCase() === marca.toLowerCase() &&
        v.modelo.toLowerCase() === modelo.toLowerCase() &&
        v.anioFabricacion === año
      );

      if (vehiculoExistente) {
        throw new BadRequestException(`Ya existe un vehículo ${marca} ${modelo} ${año}`);
      }
    }

    // Actualizar campos
    if (updateVehiculoInput.tipo !== undefined) {
      vehiculo.tipo = updateVehiculoInput.tipo.toLowerCase();
    }
    
    if (updateVehiculoInput.marca !== undefined) {
      vehiculo.marca = updateVehiculoInput.marca.trim();
    }
    
    if (updateVehiculoInput.modelo !== undefined) {
      vehiculo.modelo = updateVehiculoInput.modelo.trim();
    }

    if (updateVehiculoInput.anioFabricacion !== undefined) {
      vehiculo.anioFabricacion = updateVehiculoInput.anioFabricacion;
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
  private validarDatosVehiculo(datos: CreateVehiculoInput): void {
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

    if (!this.isValidAño(datos.anioFabricacion)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }
  }

  private isValidAño(año: number): boolean {
    const currentYear = new Date().getFullYear();
    return año >= 1900 && año <= currentYear + 1;
  }

  // Métodos para estadísticas y reportes
  getEstadisticas() {
    const estadisticasTipo = this.getEstadisticasPorTipo();
    const estadisticasMarca = this.getEstadisticasPorMarca();
    const vehiculoMasNuevo = this.vehiculos.reduce((prev, current) => 
      prev.anioFabricacion > current.anioFabricacion ? prev : current
    );
    const vehiculoMasViejo = this.vehiculos.reduce((prev, current) => 
      prev.anioFabricacion < current.anioFabricacion ? prev : current
    );

    return {
      totalVehiculos: this.vehiculos.length,
      estadisticasTipo,
      estadisticasMarca,
      vehiculoMasNuevo,
      vehiculoMasViejo,
      añoPromedio: this.getAñoPromedio(),
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

  private getAñoPromedio(): number {
    if (this.vehiculos.length === 0) return 0;
    const suma = this.vehiculos.reduce((acc, vehiculo) => acc + vehiculo.anioFabricacion, 0);
    return Math.round(suma / this.vehiculos.length);
  }

  getTiposPermitidos(): string[] {
    return [...this.tiposPermitidos];
  }
}
