import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Vehiculo } from './entities/vehiculo.entity';

@Injectable()
export class VehiculosService {
  private vehiculos: Vehiculo[] = [
    { id: 1, tipo: 'sedan', marca: 'Toyota', modelo: 'Corolla', añoFabricacion: 2020 },
    { id: 2, tipo: 'camioneta', marca: 'Ford', modelo: 'F-150', añoFabricacion: 2019 },
    { id: 3, tipo: 'SUV', marca: 'Honda', modelo: 'CR-V', añoFabricacion: 2021 },
    { id: 4, tipo: 'hatchback', marca: 'Volkswagen', modelo: 'Golf', añoFabricacion: 2018 },
  ];
  private nextId = 5;

  private readonly tiposPermitidos = [
    'sedan', 'camioneta', 'SUV', 'hatchback', 'deportivo', 'convertible', 'coupe'
  ];

  // Eventos para WebSocket
  private eventCallbacks: { [event: string]: Function[] } = {};

  create(createVehiculoDto: CreateVehiculoDto): Vehiculo {
    // Validaciones de negocio
    this.validarDatosVehiculo(createVehiculoDto);

    // Validar vehículo único (marca + modelo + año)
    const vehiculoExistente = this.vehiculos.find(v => 
      v.marca.toLowerCase() === createVehiculoDto.marca.toLowerCase() &&
      v.modelo.toLowerCase() === createVehiculoDto.modelo.toLowerCase() &&
      v.añoFabricacion === createVehiculoDto.añoFabricacion
    );

    if (vehiculoExistente) {
      throw new BadRequestException(
        `Ya existe un vehículo ${createVehiculoDto.marca} ${createVehiculoDto.modelo} ${createVehiculoDto.añoFabricacion}`
      );
    }

    const nuevoVehiculo: Vehiculo = {
      id: this.nextId++,
      tipo: createVehiculoDto.tipo.toLowerCase(),
      marca: createVehiculoDto.marca.trim(),
      modelo: createVehiculoDto.modelo.trim(),
      añoFabricacion: createVehiculoDto.añoFabricacion,
    };

    this.vehiculos.push(nuevoVehiculo);
    
    // Emitir evento WebSocket
    this.emitEvent('vehiculoCreado', {
      vehiculo: nuevoVehiculo,
      timestamp: new Date().toISOString(),
      total: this.vehiculos.length
    });

    return nuevoVehiculo;
  }

  findAll(): Vehiculo[] {
    return this.vehiculos.sort((a, b) => b.añoFabricacion - a.añoFabricacion);
  }

  findOne(id: number): Vehiculo {
    const vehiculo = this.vehiculos.find(v => v.id === id);
    
    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }
    
    return vehiculo;
  }

  findByTipo(tipo: string): Vehiculo[] {
    const vehiculosFiltrados = this.vehiculos.filter(v => v.tipo.toLowerCase() === tipo.toLowerCase());
    
    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorTipo',
      filtro: tipo,
      resultados: vehiculosFiltrados.length,
      timestamp: new Date().toISOString()
    });

    return vehiculosFiltrados;
  }

  findByMarca(marca: string): Vehiculo[] {
    const vehiculosFiltrados = this.vehiculos.filter(v => v.marca.toLowerCase().includes(marca.toLowerCase()));
    
    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorMarca',
      filtro: marca,
      resultados: vehiculosFiltrados.length,
      timestamp: new Date().toISOString()
    });

    return vehiculosFiltrados;
  }

  findByAnoRango(anoMinimo: number, anoMaximo: number): Vehiculo[] {
    const vehiculosFiltrados = this.vehiculos.filter(v => 
      v.añoFabricacion >= anoMinimo && v.añoFabricacion <= anoMaximo
    );

    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorRangoAño',
      filtro: `${anoMinimo}-${anoMaximo}`,
      resultados: vehiculosFiltrados.length,
      timestamp: new Date().toISOString()
    });

    return vehiculosFiltrados;
  }

  update(id: number, updateVehiculoDto: UpdateVehiculoDto): Vehiculo {
    const vehiculoAnterior = this.findOne(id);
    const vehiculoOriginal = { ...vehiculoAnterior };

    // Validar datos si se proporcionan
    if (updateVehiculoDto.tipo && !this.tiposPermitidos.includes(updateVehiculoDto.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de vehículo no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (updateVehiculoDto.añoFabricacion && !this.isValidAno(updateVehiculoDto.añoFabricacion)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }

    // Validar unicidad si se actualizan campos clave
    if (updateVehiculoDto.marca || updateVehiculoDto.modelo || updateVehiculoDto.añoFabricacion) {
      const marca = updateVehiculoDto.marca || vehiculoAnterior.marca;
      const modelo = updateVehiculoDto.modelo || vehiculoAnterior.modelo;
      const ano = updateVehiculoDto.añoFabricacion || vehiculoAnterior.añoFabricacion;

      const vehiculoExistente = this.vehiculos.find(v => 
        v.id !== id &&
        v.marca.toLowerCase() === marca.toLowerCase() &&
        v.modelo.toLowerCase() === modelo.toLowerCase() &&
        v.añoFabricacion === ano
      );

      if (vehiculoExistente) {
        throw new BadRequestException(`Ya existe un vehículo ${marca} ${modelo} ${ano}`);
      }
    }

    // Actualizar campos
    if (updateVehiculoDto.tipo !== undefined) {
      vehiculoAnterior.tipo = updateVehiculoDto.tipo.toLowerCase();
    }
    
    if (updateVehiculoDto.marca !== undefined) {
      vehiculoAnterior.marca = updateVehiculoDto.marca.trim();
    }
    
    if (updateVehiculoDto.modelo !== undefined) {
      vehiculoAnterior.modelo = updateVehiculoDto.modelo.trim();
    }
    
    if (updateVehiculoDto.añoFabricacion !== undefined) {
      vehiculoAnterior.añoFabricacion = updateVehiculoDto.añoFabricacion;
    }

    // Emitir evento de actualización
    this.emitEvent('vehiculoActualizado', {
      vehiculoAnterior: vehiculoOriginal,
      vehiculoNuevo: vehiculoAnterior,
      cambios: this.detectarCambios(vehiculoOriginal, vehiculoAnterior),
      timestamp: new Date().toISOString()
    });

    return vehiculoAnterior;
  }

  remove(id: number): boolean {
    const vehiculo = this.findOne(id);
    const index = this.vehiculos.findIndex(v => v.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado`);
    }

    this.vehiculos.splice(index, 1);

    // Emitir evento de eliminación
    this.emitEvent('vehiculoEliminado', {
      vehiculo: vehiculo,
      timestamp: new Date().toISOString(),
      totalRestante: this.vehiculos.length
    });

    return true;
  }

  // Métodos específicos para WebSocket
  onEvent(event: string, callback: Function): void {
    if (!this.eventCallbacks[event]) {
      this.eventCallbacks[event] = [];
    }
    this.eventCallbacks[event].push(callback);
  }

  private emitEvent(event: string, data: any): void {
    if (this.eventCallbacks[event]) {
      this.eventCallbacks[event].forEach(callback => callback(data));
    }
  }

  // Métodos de tiempo real para WebSocket
  getEstadisticasEnTiempoReal() {
    const estadisticas = {
      totalVehiculos: this.vehiculos.length,
      estadisticasTipo: this.getEstadisticasPorTipo(),
      estadisticasMarca: this.getEstadisticasPorMarca(),
      vehiculoMasNuevo: this.vehiculos.reduce((prev, current) => 
        prev.añoFabricacion > current.añoFabricacion ? prev : current
      ),
      vehiculoMasViejo: this.vehiculos.reduce((prev, current) => 
        prev.añoFabricacion < current.añoFabricacion ? prev : current
      ),
      anoPromedio: this.getAnoPromedio(),
      timestamp: new Date().toISOString()
    };

    // Emitir estadísticas actualizadas
    this.emitEvent('estadisticasActualizadas', estadisticas);
    
    return estadisticas;
  }

  iniciarMonitoreoTiempoReal(intervalo: number = 30000): void {
    setInterval(() => {
      this.getEstadisticasEnTiempoReal();
    }, intervalo);
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

    if (!this.isValidAno(datos.añoFabricacion)) {
      throw new BadRequestException('Año de fabricación debe estar entre 1900 y el año actual + 1');
    }
  }

  private isValidAno(ano: number): boolean {
    const currentYear = new Date().getFullYear();
    return ano >= 1900 && ano <= currentYear + 1;
  }

  private detectarCambios(anterior: Vehiculo, nuevo: Vehiculo): string[] {
    const cambios: string[] = [];
    
    if (anterior.tipo !== nuevo.tipo) cambios.push(`tipo: ${anterior.tipo} → ${nuevo.tipo}`);
    if (anterior.marca !== nuevo.marca) cambios.push(`marca: ${anterior.marca} → ${nuevo.marca}`);
    if (anterior.modelo !== nuevo.modelo) cambios.push(`modelo: ${anterior.modelo} → ${nuevo.modelo}`);
    if (anterior.añoFabricacion !== nuevo.añoFabricacion) cambios.push(`año: ${anterior.añoFabricacion} → ${nuevo.añoFabricacion}`);
    
    return cambios;
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
    const suma = this.vehiculos.reduce((acc, vehiculo) => acc + vehiculo.añoFabricacion, 0);
    return Math.round(suma / this.vehiculos.length);
  }

  // Métodos para notificaciones en tiempo real
  notificarCambioImportante(mensaje: string, tipo: 'info' | 'warning' | 'error' = 'info'): void {
    this.emitEvent('notificacion', {
      mensaje,
      tipo,
      timestamp: new Date().toISOString(),
      modulo: 'vehiculos'
    });
  }

  getTiposPermitidos(): string[] {
    return [...this.tiposPermitidos];
  }
}
