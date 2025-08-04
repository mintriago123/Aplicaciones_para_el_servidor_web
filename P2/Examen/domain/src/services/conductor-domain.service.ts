import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Conductor } from '../entities/conductor.entity';
import { CreateConductorDto, UpdateConductorDto } from '../dto/conductor.dto';
import type { IConductorRepository } from '../interfaces/conductor.repository.interface';

@Injectable()
export class ConductorDomainService {
  constructor(private readonly conductorRepository: IConductorRepository) {}

  create(createConductorDto: CreateConductorDto): Conductor {
    // Validar email único
    if (this.conductorRepository.emailExists(createConductorDto.email)) {
      throw new BadRequestException(`El email ${createConductorDto.email} ya está registrado`);
    }

    // Validar datos requeridos
    this.validarDatosConductor(createConductorDto);

    return this.conductorRepository.create(createConductorDto);
  }

  findAll(): Conductor[] {
    return this.conductorRepository.findAll()
      .sort((a, b) => a.apellido.localeCompare(b.apellido));
  }

  findOne(id: number): Conductor {
    const conductor = this.conductorRepository.findOne(id);
    if (!conductor) {
      throw new NotFoundException(`Conductor con ID ${id} no encontrado`);
    }
    return conductor;
  }

  findByEmail(email: string): Conductor | null {
    return this.conductorRepository.findByEmail(email);
  }

  findByNombre(nombre: string): Conductor[] {
    const conductores = this.conductorRepository.findAll();
    return conductores.filter(c => 
      c.nombre.toLowerCase().includes(nombre.toLowerCase()) ||
      c.apellido.toLowerCase().includes(nombre.toLowerCase())
    );
  }

  update(id: number, updateConductorDto: UpdateConductorDto): Conductor {
    const conductor = this.findOne(id);

    // Validar email único si se está actualizando
    if (updateConductorDto.email && updateConductorDto.email !== conductor.email) {
      if (this.conductorRepository.emailExists(updateConductorDto.email)) {
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

    return this.conductorRepository.update(id, updateConductorDto);
  }

  remove(id: number): void {
    this.findOne(id); // Verificar que existe
    this.conductorRepository.remove(id);
  }

  private validarDatosConductor(datos: CreateConductorDto): void {
    if (!datos.nombre?.trim()) {
      throw new BadRequestException('El nombre es requerido');
    }
    
    if (!datos.apellido?.trim()) {
      throw new BadRequestException('El apellido es requerido');
    }

    if (!this.isValidEmail(datos.email)) {
      throw new BadRequestException('El formato del email no es válido');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Métodos de negocio específicos
  obtenerNombreCompleto(id: number): string {
    const conductor = this.findOne(id);
    return `${conductor.nombre} ${conductor.apellido}`;
  }

  obtenerIniciales(id: number): string {
    const conductor = this.findOne(id);
    return `${conductor.nombre.charAt(0).toUpperCase()}${conductor.apellido.charAt(0).toUpperCase()}`;
  }

  generarCodigoConductor(id: number): string {
    const conductor = this.findOne(id);
    const iniciales = this.obtenerIniciales(id);
    return `${iniciales}${id.toString().padStart(4, '0')}`;
  }

  buscarConductoresSimilares(email: string): Conductor[] {
    const [usuario, dominio] = email.split('@');
    const conductores = this.conductorRepository.findAll();
    
    return conductores.filter(c => 
      c.email.includes(dominio) || 
      c.email.toLowerCase().includes(usuario.toLowerCase())
    );
  }

  getEstadisticas() {
    const conductores = this.conductorRepository.findAll();
    
    const dominiosEmail = conductores.reduce((acc, conductor) => {
      const dominio = conductor.email.split('@')[1];
      acc[dominio] = (acc[dominio] || 0) + 1;
      return acc;
    }, {} as { [dominio: string]: number });

    const nombresMasComunes = conductores.reduce((acc, conductor) => {
      acc[conductor.nombre] = (acc[conductor.nombre] || 0) + 1;
      return acc;
    }, {} as { [nombre: string]: number });

    return {
      totalConductores: conductores.length,
      dominiosEmail,
      nombresMasComunes,
      promedioCaracteresPorNombre: this.calcularPromedioCaracteres(conductores)
    };
  }

  private calcularPromedioCaracteres(conductores: Conductor[]): number {
    if (conductores.length === 0) return 0;
    
    const totalCaracteres = conductores.reduce((acc, conductor) => 
      acc + conductor.nombre.length + conductor.apellido.length, 0
    );
    
    return Math.round(totalCaracteres / conductores.length);
  }
}
