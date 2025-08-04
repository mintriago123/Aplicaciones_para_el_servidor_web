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
    return this.conductores.find(c => c.email.toLowerCase() === email.toLowerCase()) || null;
  }

  findByNombre(nombre: string): Conductor[] {
    return this.conductores.filter(c => 
      c.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
      c.apellido.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  update(id: number, updateConductorDto: UpdateConductorDto): Conductor {
    const conductor = this.findOne(id);

    // Validar email único si se está actualizando
    if (updateConductorDto.email && updateConductorDto.email !== conductor.email) {
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
      conductor.nombre = updateConductorDto.nombre.trim();
    }
    
    if (updateConductorDto.apellido !== undefined) {
      conductor.apellido = updateConductorDto.apellido.trim();
    }
    
    if (updateConductorDto.email !== undefined) {
      conductor.email = updateConductorDto.email.toLowerCase().trim();
    }

    return conductor;
  }

  remove(id: number): boolean {
    const index = this.conductores.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }

    this.conductores.splice(index, 1);
    return true;
  }

  // Métodos auxiliares para lógica de negocio
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Método para obtener estadísticas
  getEstadisticas() {
    return {
      totalConductores: this.conductores.length,
      dominiosEmail: this.getDominiosEmail(),
      conductorMasReciente: this.conductores[this.conductores.length - 1],
      nombresComunes: this.getNombresComunes(),
    };
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

  // Métodos de negocio específicos
  verificarConductorActivo(id: number): boolean {
    const conductor = this.findOne(id);
    return conductor ? true : false;
  }

  buscarConductoresPorDominio(dominio: string): Conductor[] {
    return this.conductores.filter(c => c.email.endsWith(`@${dominio}`));
  }

  generarNombreCompleto(id: number): string {
    const conductor = this.findOne(id);
    return `${conductor.nombre} ${conductor.apellido}`;
  }

  validarEmailDisponible(email: string): boolean {
    return !this.conductores.some(c => c.email.toLowerCase() === email.toLowerCase());
  }
}
