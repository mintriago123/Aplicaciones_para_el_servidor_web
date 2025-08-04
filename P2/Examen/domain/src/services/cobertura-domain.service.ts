import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Cobertura } from '../entities/cobertura.entity';
import { CreateCoberturaDto, UpdateCoberturaDto } from '../dto/cobertura.dto';
import type { ICoberturaRepository } from '../interfaces/cobertura.repository.interface';

@Injectable()
export class CoberturaDomainService {
  private readonly tiposPermitidos = [
    'total', 'parcial', 'contra robo', 'contra terceros', 'cristales', 'incendio'
  ];

  private readonly segurosPermitidos = [
    'todo riesgo', 'responsabilidad civil', 'robo y hurto', 'daños a terceros',
    'cristales', 'incendio', 'premium', 'básico'
  ];

  constructor(private readonly coberturaRepository: ICoberturaRepository) {}

  create(createCoberturaDto: CreateCoberturaDto): Cobertura {
    // Validaciones de negocio
    this.validarDatosCobertura(createCoberturaDto);

    // Validar cobertura única (tipo + seguro)
    const coberturas = this.coberturaRepository.findAll();
    const coberturaExistente = coberturas.find(c => 
      c.tipo.toLowerCase() === createCoberturaDto.tipo.toLowerCase() &&
      c.seguro.toLowerCase() === createCoberturaDto.seguro.toLowerCase()
    );

    if (coberturaExistente) {
      throw new BadRequestException(
        `Ya existe una cobertura de tipo '${createCoberturaDto.tipo}' con seguro '${createCoberturaDto.seguro}'`
      );
    }

    return this.coberturaRepository.create(createCoberturaDto);
  }

  findAll(): Cobertura[] {
    return this.coberturaRepository.findAll()
      .sort((a, b) => a.deducible - b.deducible);
  }

  findOne(id: number): Cobertura {
    const cobertura = this.coberturaRepository.findOne(id);
    if (!cobertura) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }
    return cobertura;
  }

  findByTipo(tipo: string): Cobertura[] {
    return this.coberturaRepository.findByTipo(tipo);
  }

  findBySeguro(seguro: string): Cobertura[] {
    return this.coberturaRepository.findBySeguro(seguro);
  }

  findByDeducibleRango(minimo: number, maximo: number): Cobertura[] {
    const coberturas = this.coberturaRepository.findAll();
    return coberturas.filter(c => c.deducible >= minimo && c.deducible <= maximo);
  }

  findCoberturasEconomicas(limite: number = 300): Cobertura[] {
    const coberturas = this.coberturaRepository.findAll();
    return coberturas.filter(c => c.deducible <= limite);
  }

  findCoberturasPremiun(limite: number = 500): Cobertura[] {
    const coberturas = this.coberturaRepository.findAll();
    return coberturas.filter(c => c.deducible >= limite);
  }

  update(id: number, updateCoberturaDto: UpdateCoberturaDto): Cobertura {
    const cobertura = this.findOne(id);

    // Validar tipo si se proporciona
    if (updateCoberturaDto.tipo && !this.tiposPermitidos.includes(updateCoberturaDto.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de cobertura no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    // Validar seguro si se proporciona
    if (updateCoberturaDto.seguro && !this.segurosPermitidos.includes(updateCoberturaDto.seguro.toLowerCase())) {
      throw new BadRequestException(`Tipo de seguro no válido. Seguros permitidos: ${this.segurosPermitidos.join(', ')}`);
    }

    // Validar deducible si se proporciona
    if (updateCoberturaDto.deducible !== undefined && !this.isValidDeducible(updateCoberturaDto.deducible)) {
      throw new BadRequestException('El deducible debe ser un número positivo mayor a 0');
    }

    // Validar unicidad si se actualizan campos clave
    if (updateCoberturaDto.tipo || updateCoberturaDto.seguro) {
      const tipo = updateCoberturaDto.tipo || cobertura.tipo;
      const seguro = updateCoberturaDto.seguro || cobertura.seguro;

      const coberturas = this.coberturaRepository.findAll();
      const coberturaExistente = coberturas.find(c => 
        c.id !== id &&
        c.tipo.toLowerCase() === tipo.toLowerCase() &&
        c.seguro.toLowerCase() === seguro.toLowerCase()
      );

      if (coberturaExistente) {
        throw new BadRequestException(`Ya existe una cobertura de tipo '${tipo}' con seguro '${seguro}'`);
      }
    }

    return this.coberturaRepository.update(id, updateCoberturaDto);
  }

  remove(id: number): void {
    this.findOne(id); // Verificar que existe
    this.coberturaRepository.remove(id);
  }

  private validarDatosCobertura(datos: CreateCoberturaDto): void {
    if (!datos.tipo?.trim()) {
      throw new BadRequestException('El tipo de cobertura es requerido');
    }

    if (!this.tiposPermitidos.includes(datos.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de cobertura no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (!datos.seguro?.trim()) {
      throw new BadRequestException('El tipo de seguro es requerido');
    }

    if (!this.segurosPermitidos.includes(datos.seguro.toLowerCase())) {
      throw new BadRequestException(`Tipo de seguro no válido. Seguros permitidos: ${this.segurosPermitidos.join(', ')}`);
    }

    if (!this.isValidDeducible(datos.deducible)) {
      throw new BadRequestException('El deducible debe ser un número positivo mayor a 0');
    }
  }

  private isValidDeducible(deducible: number): boolean {
    return typeof deducible === 'number' && deducible > 0 && deducible <= 10000;
  }

  getTiposPermitidos(): string[] {
    return [...this.tiposPermitidos];
  }

  getSegurosPermitidos(): string[] {
    return [...this.segurosPermitidos];
  }

  // Métodos de negocio específicos
  calcularPorcentajeDeducible(id: number, valorAsegurado: number): number {
    const cobertura = this.findOne(id);
    return (cobertura.deducible / valorAsegurado) * 100;
  }

  esCoberturaCompleta(id: number): boolean {
    const cobertura = this.findOne(id);
    return cobertura.tipo.toLowerCase() === 'total' || 
           cobertura.seguro.toLowerCase() === 'todo riesgo';
  }

  recomendarCoberturas(presupuestoDeducible: number): Cobertura[] {
    const coberturas = this.coberturaRepository.findAll();
    return coberturas
      .filter(c => c.deducible <= presupuestoDeducible)
      .sort((a, b) => a.deducible - b.deducible)
      .slice(0, 3); // Top 3 recomendaciones
  }

  compararCoberturas(id1: number, id2: number) {
    const cobertura1 = this.findOne(id1);
    const cobertura2 = this.findOne(id2);

    return {
      cobertura1,
      cobertura2,
      diferencia: {
        deducible: Math.abs(cobertura1.deducible - cobertura2.deducible),
        mejorOpcion: cobertura1.deducible < cobertura2.deducible ? cobertura1 : cobertura2
      }
    };
  }

  getEstadisticas() {
    const coberturas = this.coberturaRepository.findAll();
    
    if (coberturas.length === 0) {
      return {
        totalCoberturas: 0,
        estadisticasTipo: {},
        estadisticasSeguro: {},
        deduciblePromedio: 0,
        deducibleMinimo: 0,
        deducibleMaximo: 0
      };
    }

    const estadisticasTipo = coberturas.reduce((acc, cobertura) => {
      acc[cobertura.tipo] = (acc[cobertura.tipo] || 0) + 1;
      return acc;
    }, {} as { [tipo: string]: number });

    const estadisticasSeguro = coberturas.reduce((acc, cobertura) => {
      acc[cobertura.seguro] = (acc[cobertura.seguro] || 0) + 1;
      return acc;
    }, {} as { [seguro: string]: number });

    const deducibles = coberturas.map(c => c.deducible);
    const deduciblePromedio = deducibles.reduce((a, b) => a + b, 0) / deducibles.length;

    return {
      totalCoberturas: coberturas.length,
      estadisticasTipo,
      estadisticasSeguro,
      deduciblePromedio: Math.round(deduciblePromedio * 100) / 100,
      deducibleMinimo: Math.min(...deducibles),
      deducibleMaximo: Math.max(...deducibles)
    };
  }

  generarCodigoCobertura(id: number): string {
    const cobertura = this.findOne(id);
    const tipoCode = cobertura.tipo.substring(0, 3).toUpperCase();
    const seguroCode = cobertura.seguro.substring(0, 3).toUpperCase();
    return `${tipoCode}-${seguroCode}-${id.toString().padStart(3, '0')}`;
  }
}
