import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCoberturaInput } from './dto/create-cobertura.input';
import { UpdateCoberturaInput } from './dto/update-cobertura.input';
import { Cobertura } from './entities/cobertura.entity';

@Injectable()
export class CoberturasService {
  private coberturas: Cobertura[] = [
    { id: 1, tipo: 'total', seguro: 'todo riesgo', deducible: 500.00 },
    { id: 2, tipo: 'parcial', seguro: 'responsabilidad civil', deducible: 250.00 },
    { id: 3, tipo: 'contra robo', seguro: 'robo y hurto', deducible: 300.00 },
  ];
  private nextId = 4;

  private readonly tiposPermitidos = [
    'total', 'parcial', 'contra robo', 'contra terceros', 'cristales', 'incendio'
  ];

  private readonly segurosPermitidos = [
    'todo riesgo', 'responsabilidad civil', 'robo y hurto', 'daños a terceros',
    'cristales', 'incendio', 'premium', 'básico'
  ];

  create(createCoberturaInput: CreateCoberturaInput): Cobertura {
    // Validaciones de negocio
    this.validarDatosCobertura(createCoberturaInput);

    // Validar cobertura única (tipo + seguro)
    const coberturaExistente = this.coberturas.find(c => 
      c.tipo.toLowerCase() === createCoberturaInput.tipo.toLowerCase() &&
      c.seguro.toLowerCase() === createCoberturaInput.seguro.toLowerCase()
    );

    if (coberturaExistente) {
      throw new BadRequestException(
        `Ya existe una cobertura de tipo '${createCoberturaInput.tipo}' con seguro '${createCoberturaInput.seguro}'`
      );
    }

    const nuevaCobertura: Cobertura = {
      id: this.nextId++,
      tipo: createCoberturaInput.tipo.toLowerCase(),
      seguro: createCoberturaInput.seguro.toLowerCase(),
      deducible: parseFloat(createCoberturaInput.deducible.toFixed(2)),
    };

    this.coberturas.push(nuevaCobertura);
    return nuevaCobertura;
  }

  findAll(): Cobertura[] {
    return this.coberturas.sort((a, b) => a.deducible - b.deducible);
  }

  findOne(id: number): Cobertura {
    const cobertura = this.coberturas.find(c => c.id === id);
    
    if (!cobertura) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }
    
    return cobertura;
  }

  findByTipo(tipo: string): Cobertura[] {
    return this.coberturas.filter(c => c.tipo.toLowerCase() === tipo.toLowerCase());
  }

  findBySeguro(seguro: string): Cobertura[] {
    return this.coberturas.filter(c => c.seguro.toLowerCase().includes(seguro.toLowerCase()));
  }

  findByDeducibleRango(minimo: number, maximo: number): Cobertura[] {
    return this.coberturas.filter(c => c.deducible >= minimo && c.deducible <= maximo);
  }

  findCoberturasEconomicas(limite: number = 300): Cobertura[] {
    return this.coberturas.filter(c => c.deducible <= limite);
  }

  findCoberturasPremiun(limite: number = 500): Cobertura[] {
    return this.coberturas.filter(c => c.deducible >= limite);
  }

  update(id: number, updateCoberturaInput: UpdateCoberturaInput): Cobertura {
    const cobertura = this.findOne(id);

    // Validar tipo si se proporciona
    if (updateCoberturaInput.tipo && !this.tiposPermitidos.includes(updateCoberturaInput.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de cobertura no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    // Validar seguro si se proporciona
    if (updateCoberturaInput.seguro && !this.segurosPermitidos.includes(updateCoberturaInput.seguro.toLowerCase())) {
      throw new BadRequestException(`Tipo de seguro no válido. Seguros permitidos: ${this.segurosPermitidos.join(', ')}`);
    }

    // Validar deducible si se proporciona
    if (updateCoberturaInput.deducible !== undefined && !this.isValidDeducible(updateCoberturaInput.deducible)) {
      throw new BadRequestException('El deducible debe ser un valor positivo entre 0 y 10000');
    }

    // Validar unicidad si se actualizan campos clave
    if (updateCoberturaInput.tipo || updateCoberturaInput.seguro) {
      const tipo = updateCoberturaInput.tipo || cobertura.tipo;
      const seguro = updateCoberturaInput.seguro || cobertura.seguro;

      const coberturaExistente = this.coberturas.find(c => 
        c.id !== id &&
        c.tipo.toLowerCase() === tipo.toLowerCase() &&
        c.seguro.toLowerCase() === seguro.toLowerCase()
      );

      if (coberturaExistente) {
        throw new BadRequestException(`Ya existe una cobertura de tipo '${tipo}' con seguro '${seguro}'`);
      }
    }

    // Actualizar campos
    if (updateCoberturaInput.tipo !== undefined) {
      cobertura.tipo = updateCoberturaInput.tipo.toLowerCase();
    }
    
    if (updateCoberturaInput.seguro !== undefined) {
      cobertura.seguro = updateCoberturaInput.seguro.toLowerCase();
    }
    
    if (updateCoberturaInput.deducible !== undefined) {
      cobertura.deducible = parseFloat(updateCoberturaInput.deducible.toFixed(2));
    }

    return cobertura;
  }

  remove(id: number): boolean {
    const index = this.coberturas.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }

    this.coberturas.splice(index, 1);
    return true;
  }

  // Métodos de validación y lógica de negocio
  private validarDatosCobertura(datos: CreateCoberturaInput): void {
    if (!datos.tipo?.trim()) {
      throw new BadRequestException('El tipo es requerido');
    }

    if (!this.tiposPermitidos.includes(datos.tipo.toLowerCase())) {
      throw new BadRequestException(`Tipo de cobertura no válido. Tipos permitidos: ${this.tiposPermitidos.join(', ')}`);
    }

    if (!datos.seguro?.trim()) {
      throw new BadRequestException('El seguro es requerido');
    }

    if (!this.segurosPermitidos.includes(datos.seguro.toLowerCase())) {
      throw new BadRequestException(`Tipo de seguro no válido. Seguros permitidos: ${this.segurosPermitidos.join(', ')}`);
    }

    if (!this.isValidDeducible(datos.deducible)) {
      throw new BadRequestException('El deducible debe ser un valor positivo entre 0 y 10000');
    }
  }

  private isValidDeducible(deducible: number): boolean {
    return deducible >= 0 && deducible <= 10000 && !isNaN(deducible);
  }

  // Métodos para estadísticas y reportes
  getEstadisticas() {
    const estadisticasTipo = this.getEstadisticasPorTipo();
    const estadisticasSeguro = this.getEstadisticasPorSeguro();
    const coberturaMasCaraDeducible = this.coberturas.reduce((prev, current) => 
      prev.deducible > current.deducible ? prev : current
    );
    const coberturaMasBarataDeducible = this.coberturas.reduce((prev, current) => 
      prev.deducible < current.deducible ? prev : current
    );

    return {
      totalCoberturas: this.coberturas.length,
      estadisticasTipo,
      estadisticasSeguro,
      coberturaMasCaraDeducible,
      coberturaMasBarataDeducible,
      deduciblePromedio: this.getDeduciblePromedio(),
      rangoPreciosos: {
        economicas: this.findCoberturasEconomicas().length,
        premium: this.findCoberturasPremiun().length,
      },
    };
  }

  private getEstadisticasPorTipo(): { [tipo: string]: number } {
    const stats: { [key: string]: number } = {};
    this.coberturas.forEach(cobertura => {
      stats[cobertura.tipo] = (stats[cobertura.tipo] || 0) + 1;
    });
    return stats;
  }

  private getEstadisticasPorSeguro(): { [seguro: string]: number } {
    const stats: { [key: string]: number } = {};
    this.coberturas.forEach(cobertura => {
      stats[cobertura.seguro] = (stats[cobertura.seguro] || 0) + 1;
    });
    return stats;
  }

  private getDeduciblePromedio(): number {
    if (this.coberturas.length === 0) return 0;
    const suma = this.coberturas.reduce((acc, cobertura) => acc + cobertura.deducible, 0);
    return parseFloat((suma / this.coberturas.length).toFixed(2));
  }

  getTiposPermitidos(): string[] {
    return [...this.tiposPermitidos];
  }

  getSegurosPermitidos(): string[] {
    return [...this.segurosPermitidos];
  }

  // Métodos de negocio específicos para coberturas
  calcularPrimaEstimada(deducible: number, tipo: string): number {
    let factorTipo = 1.0;
    
    switch (tipo.toLowerCase()) {
      case 'total':
        factorTipo = 2.5;
        break;
      case 'parcial':
        factorTipo = 1.5;
        break;
      case 'contra robo':
        factorTipo = 1.8;
        break;
      case 'contra terceros':
        factorTipo = 1.2;
        break;
      default:
        factorTipo = 1.0;
    }

    // Prima estimada = deducible * factor + base
    const primaBase = 100;
    const primaEstimada = (deducible * factorTipo) + primaBase;
    
    return parseFloat(primaEstimada.toFixed(2));
  }

  recomendarCobertura(presupuesto: number): Cobertura[] {
    return this.coberturas
      .filter(c => c.deducible <= presupuesto)
      .sort((a, b) => {
        // Priorizar por mejor relación cobertura/precio
        const valorA = this.calcularValorCobertura(a);
        const valorB = this.calcularValorCobertura(b);
        return valorB - valorA;
      })
      .slice(0, 3); // Top 3 recomendaciones
  }

  private calcularValorCobertura(cobertura: Cobertura): number {
    let puntos = 0;
    
    // Puntuar por tipo de cobertura
    switch (cobertura.tipo) {
      case 'total': puntos += 10; break;
      case 'contra robo': puntos += 8; break;
      case 'parcial': puntos += 6; break;
      case 'contra terceros': puntos += 4; break;
      default: puntos += 2;
    }
    
    // Puntuar inversamente por deducible (menor deducible = mejor)
    puntos += Math.max(0, (1000 - cobertura.deducible) / 100);
    
    return puntos;
  }
}
