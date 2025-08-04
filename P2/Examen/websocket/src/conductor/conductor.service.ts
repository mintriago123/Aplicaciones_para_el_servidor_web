import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';
import { Conductor } from './entities/conductor.entity';

@Injectable()
export class ConductorService {
  private conductores: Conductor[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com' },
    { id: 2, nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com' },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos.rodriguez@email.com' },
    { id: 4, nombre: 'Ana', apellido: 'López', email: 'ana.lopez@email.com' },
  ];
  private nextId = 5;

  // Eventos para WebSocket
  private eventCallbacks: { [event: string]: Function[] } = {};

  create(createConductorDto: CreateConductorDto): Conductor {
    // Validar email único
    const emailExistente = this.conductores.find(
      conductor => conductor.email === createConductorDto.email
    );
    
    if (emailExistente) {
      throw new BadRequestException(`El email ${createConductorDto.email} ya está registrado`);
    }

    // Validar datos requeridos
    if (!createConductorDto.nombre?.trim()) {
      throw new BadRequestException('El nombre es requerido');
    }
    
    if (!createConductorDto.apellido?.trim()) {
      throw new BadRequestException('El apellido es requerido');
    }

    if (!this.isValidEmail(createConductorDto.email)) {
      throw new BadRequestException('El formato del email no es válido');
    }

    const nuevoConductor: Conductor = {
      id: this.nextId++,
      nombre: createConductorDto.nombre.trim(),
      apellido: createConductorDto.apellido.trim(),
      email: createConductorDto.email.toLowerCase().trim(),
    };

    this.conductores.push(nuevoConductor);

    // Emitir evento WebSocket
    this.emitEvent('conductorCreado', {
      conductor: nuevoConductor,
      timestamp: new Date().toISOString(),
      total: this.conductores.length
    });

    return nuevoConductor;
  }

  findAll(): Conductor[] {
    return this.conductores.sort((a, b) => a.apellido.localeCompare(b.apellido));
  }

  findOne(id: number): Conductor {
    const conductor = this.conductores.find(c => c.id === id);
    
    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }
    
    return conductor;
  }

  findByEmail(email: string): Conductor | null {
    const conductor = this.conductores.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
    
    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorEmail',
      email: email,
      encontrado: conductor !== null,
      timestamp: new Date().toISOString()
    });

    return conductor;
  }

  findByNombre(nombre: string): Conductor[] {
    const conductoresEncontrados = this.conductores.filter(c => 
      c.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
      c.apellido.toLowerCase().includes(nombre.toLowerCase())
    );

    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorNombre',
      filtro: nombre,
      resultados: conductoresEncontrados.length,
      timestamp: new Date().toISOString()
    });

    return conductoresEncontrados;
  }

  update(id: number, updateConductorDto: UpdateConductorDto): Conductor {
    const conductorAnterior = this.findOne(id);
    const conductorOriginal = { ...conductorAnterior };

    // Validar email único si se está actualizando
    if (updateConductorDto.email && updateConductorDto.email !== conductorAnterior.email) {
      const emailExistente = this.conductores.find(
        c => c.email === updateConductorDto.email && c.id !== id
      );
      
      if (emailExistente) {
        throw new BadRequestException(`El email ${updateConductorDto.email} ya está registrado`);
      }

      if (!this.isValidEmail(updateConductorDto.email)) {
        throw new BadRequestException('El formato del email no es válido');
      }
    }

    // Validar campos si se proporcionan
    if (updateConductorDto.nombre !== undefined && !updateConductorDto.nombre?.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    if (updateConductorDto.apellido !== undefined && !updateConductorDto.apellido?.trim()) {
      throw new BadRequestException('El apellido no puede estar vacío');
    }

    // Actualizar campos
    if (updateConductorDto.nombre !== undefined) {
      conductorAnterior.nombre = updateConductorDto.nombre.trim();
    }
    
    if (updateConductorDto.apellido !== undefined) {
      conductorAnterior.apellido = updateConductorDto.apellido.trim();
    }
    
    if (updateConductorDto.email !== undefined) {
      conductorAnterior.email = updateConductorDto.email.toLowerCase().trim();
    }

    // Emitir evento de actualización
    this.emitEvent('conductorActualizado', {
      conductorAnterior: conductorOriginal,
      conductorNuevo: conductorAnterior,
      cambios: this.detectarCambios(conductorOriginal, conductorAnterior),
      timestamp: new Date().toISOString()
    });

    return conductorAnterior;
  }

  remove(id: number): boolean {
    const conductor = this.findOne(id);
    const index = this.conductores.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    this.conductores.splice(index, 1);

    // Emitir evento de eliminación
    this.emitEvent('conductorEliminado', {
      conductor: conductor,
      timestamp: new Date().toISOString(),
      totalRestante: this.conductores.length
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
      totalConductores: this.conductores.length,
      dominiosEmail: this.getDominiosEmail(),
      conductorMasReciente: this.conductores[this.conductores.length - 1],
      nombresComunes: this.getNombresComunes(),
      actividadReciente: this.getActividadReciente(),
      timestamp: new Date().toISOString()
    };

    // Emitir estadísticas actualizadas
    this.emitEvent('estadisticasActualizadas', estadisticas);
    
    return estadisticas;
  }

  monitorearSesionesActivas(): { [conductorId: number]: any } {
    const sesionesActivas: { [key: number]: any } = {};
    
    this.conductores.forEach(conductor => {
      sesionesActivas[conductor.id] = {
        id: conductor.id,
        nombre: `${conductor.nombre} ${conductor.apellido}`,
        email: conductor.email,
        ultimaActividad: new Date().toISOString(),
        estado: 'activo'
      };
    });

    // Emitir estado de sesiones
    this.emitEvent('sesionesActualizadas', {
      sesiones: sesionesActivas,
      totalActivos: Object.keys(sesionesActivas).length,
      timestamp: new Date().toISOString()
    });

    return sesionesActivas;
  }

  iniciarMonitoreoTiempoReal(intervalo: number = 15000): void {
    setInterval(() => {
      this.getEstadisticasEnTiempoReal();
      this.monitorearSesionesActivas();
    }, intervalo);
  }

  // Métodos auxiliares para lógica de negocio
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private detectarCambios(anterior: Conductor, nuevo: Conductor): string[] {
    const cambios: string[] = [];
    
    if (anterior.nombre !== nuevo.nombre) cambios.push(`nombre: ${anterior.nombre} → ${nuevo.nombre}`);
    if (anterior.apellido !== nuevo.apellido) cambios.push(`apellido: ${anterior.apellido} → ${nuevo.apellido}`);
    if (anterior.email !== nuevo.email) cambios.push(`email: ${anterior.email} → ${nuevo.email}`);
    
    return cambios;
  }

  private getDominiosEmail(): { [dominio: string]: number } {
    const dominios: { [key: string]: number } = {};
    
    this.conductores.forEach(conductor => {
      const dominio = conductor.email.split('@')[1];
      dominios[dominio] = (dominios[dominio] || 0) + 1;
    });
    
    return dominios;
  }

  private getNombresComunes(): { [nombre: string]: number } {
    const nombres: { [key: string]: number } = {};
    
    this.conductores.forEach(conductor => {
      nombres[conductor.nombre] = (nombres[conductor.nombre] || 0) + 1;
    });
    
    return nombres;
  }

  private getActividadReciente(): any[] {
    // Simular actividad reciente para demostración
    return this.conductores.slice(-3).map(conductor => ({
      conductorId: conductor.id,
      accion: 'login',
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }));
  }

  // Métodos de negocio específicos con eventos
  verificarConductorActivo(id: number): boolean {
    const conductor = this.findOne(id);
    const activo = conductor ? true : false;

    // Emitir evento de verificación
    this.emitEvent('verificacionConductor', {
      conductorId: id,
      activo: activo,
      conductor: conductor,
      timestamp: new Date().toISOString()
    });

    return activo;
  }

  buscarConductoresPorDominio(dominio: string): Conductor[] {
    const conductoresEncontrados = this.conductores.filter(c => c.email.endsWith(`@${dominio}`));

    // Emitir evento de búsqueda por dominio
    this.emitEvent('busquedaPorDominio', {
      dominio: dominio,
      resultados: conductoresEncontrados.length,
      conductores: conductoresEncontrados,
      timestamp: new Date().toISOString()
    });

    return conductoresEncontrados;
  }

  notificarCambioImportante(mensaje: string, tipo: 'info' | 'warning' | 'error' = 'info'): void {
    this.emitEvent('notificacion', {
      mensaje,
      tipo,
      timestamp: new Date().toISOString(),
      modulo: 'conductores'
    });
  }

  // Métodos para alertas en tiempo real
  verificarEmailsDuplicados(): void {
    const emails = this.conductores.map(c => c.email);
    const emailsDuplicados = emails.filter((email, index) => emails.indexOf(email) !== index);

    if (emailsDuplicados.length > 0) {
      this.emitEvent('alerta', {
        tipo: 'emailsDuplicados',
        emails: emailsDuplicados,
        mensaje: 'Se detectaron emails duplicados en el sistema',
        timestamp: new Date().toISOString()
      });
    }
  }

  enviarNotificacionAConductor(conductorId: number, mensaje: string): void {
    const conductor = this.findOne(conductorId);
    
    this.emitEvent('notificacionPersonal', {
      conductorId: conductorId,
      conductor: conductor,
      mensaje: mensaje,
      timestamp: new Date().toISOString()
    });
  }
}
