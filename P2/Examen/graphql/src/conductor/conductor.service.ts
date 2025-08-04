import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateConductorInput } from './dto/create-conductor.input';
import { UpdateConductorInput } from './dto/update-conductor.input';
import { Conductor } from './entities/conductor.entity';

@Injectable()
export class ConductorService {
  private conductores: Conductor[] = [
    { id: 1, nombre: 'Juan', apellido: 'Pérez', email: 'juan.perez@email.com' },
    { id: 2, nombre: 'María', apellido: 'González', email: 'maria.gonzalez@email.com' },
    { id: 3, nombre: 'Carlos', apellido: 'Rodríguez', email: 'carlos.rodriguez@email.com' },
  ];
  private nextId = 4;

  create(createConductorInput: CreateConductorInput): Conductor {
    // Validar email único
    const emailExistente = this.conductores.find(
      conductor => conductor.email === createConductorInput.email
    );
    
    if (emailExistente) {
      throw new BadRequestException(`El email ${createConductorInput.email} ya está registrado`);
    }

    // Validar datos requeridos
    if (!createConductorInput.nombre?.trim()) {
      throw new BadRequestException('El nombre es requerido');
    }
    
    if (!createConductorInput.apellido?.trim()) {
      throw new BadRequestException('El apellido es requerido');
    }

    if (!this.isValidEmail(createConductorInput.email)) {
      throw new BadRequestException('El formato del email no es válido');
    }

    const nuevoConductor: Conductor = {
      id: this.nextId++,
      nombre: createConductorInput.nombre.trim(),
      apellido: createConductorInput.apellido.trim(),
      email: createConductorInput.email.toLowerCase().trim(),
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

  update(id: number, updateConductorInput: UpdateConductorInput): Conductor {
    const conductor = this.findOne(id);

    // Validar email único si se está actualizando
    if (updateConductorInput.email && updateConductorInput.email !== conductor.email) {
      const emailExistente = this.conductores.find(
        c => c.email === updateConductorInput.email && c.id !== id
      );
      
      if (emailExistente) {
        throw new BadRequestException(`El email ${updateConductorInput.email} ya está registrado`);
      }

      if (!this.isValidEmail(updateConductorInput.email)) {
        throw new BadRequestException('El formato del email no es válido');
      }
    }

    // Validar campos si se proporcionan
    if (updateConductorInput.nombre !== undefined && !updateConductorInput.nombre?.trim()) {
      throw new BadRequestException('El nombre no puede estar vacío');
    }

    if (updateConductorInput.apellido !== undefined && !updateConductorInput.apellido?.trim()) {
      throw new BadRequestException('El apellido no puede estar vacío');
    }

    // Actualizar campos
    if (updateConductorInput.nombre !== undefined) {
      conductor.nombre = updateConductorInput.nombre.trim();
    }
    
    if (updateConductorInput.apellido !== undefined) {
      conductor.apellido = updateConductorInput.apellido.trim();
    }
    
    if (updateConductorInput.email !== undefined) {
      conductor.email = updateConductorInput.email.toLowerCase().trim();
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
}
