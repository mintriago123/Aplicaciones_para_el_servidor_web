import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';
import { Cobertura } from './entities/cobertura.entity';

@Injectable()
export class CoberturasService {
  private coberturas: Cobertura[] = [
    { id: 1, tipo: 'total', seguro: 'todo riesgo', deducible: 500.00 },
    { id: 2, tipo: 'parcial', seguro: 'responsabilidad civil', deducible: 250.00 },
    { id: 3, tipo: 'contra robo', seguro: 'robo y hurto', deducible: 300.00 },
    { id: 4, tipo: 'contra terceros', seguro: 'daños a terceros', deducible: 200.00 },
  ];
  private nextId = 5;

  private readonly tiposPermitidos = [
    'total', 'parcial', 'contra robo', 'contra terceros', 'cristales', 'incendio'
  ];

  private readonly segurosPermitidos = [
    'todo riesgo', 'responsabilidad civil', 'robo y hurto', 'daños a terceros',
    'cristales', 'incendio', 'premium', 'básico'
  ];

  // Eventos para WebSocket
  private eventCallbacks: { [event: string]: Function[] } = {};

  create(createCoberturaDto: CreateCoberturaDto): Cobertura {
    console.log('➕ [Service] create() llamado con datos:', JSON.stringify(createCoberturaDto, null, 2));
    console.log('📊 [Service] Estado inicial del array:', this.coberturas.length, 'elementos');
    
    // Validaciones de negocio
    this.validarDatosCobertura(createCoberturaDto);

    // Validar cobertura única (tipo + seguro)
    const coberturaExistente = this.coberturas.find(c => 
      c.tipo.toLowerCase() === createCoberturaDto.tipo.toLowerCase() &&
      c.seguro.toLowerCase() === createCoberturaDto.seguro.toLowerCase()
    );

    if (coberturaExistente) {
      console.log('❌ [Service] Cobertura duplicada encontrada:', JSON.stringify(coberturaExistente, null, 2));
      throw new BadRequestException(
        `Ya existe una cobertura de tipo '${createCoberturaDto.tipo}' con seguro '${createCoberturaDto.seguro}'`
      );
    }

    const nuevaCobertura: Cobertura = {
      id: this.nextId++,
      tipo: createCoberturaDto.tipo.toLowerCase(),
      seguro: createCoberturaDto.seguro.toLowerCase(),
      deducible: parseFloat(createCoberturaDto.deducible.toFixed(2)),
    };

    console.log('✅ [Service] Nueva cobertura preparada:', JSON.stringify(nuevaCobertura, null, 2));
    
    this.coberturas.push(nuevaCobertura);
    
    console.log('📊 [Service] Estado final del array:', this.coberturas.length, 'elementos');
    console.log('📝 [Service] Array completo después de inserción:', JSON.stringify(this.coberturas, null, 2));

    // Emitir evento WebSocket
    this.emitEvent('coberturaCreada', {
      cobertura: nuevaCobertura,
      primaEstimada: this.calcularPrimaEstimada(nuevaCobertura.deducible, nuevaCobertura.tipo),
      timestamp: new Date().toISOString(),
      total: this.coberturas.length
    });

    return nuevaCobertura;
  }

  findAll(): Cobertura[] {
    console.log('📋 [Service] findAll() llamado');
    console.log('📦 [Service] Estado actual del array coberturas:', this.coberturas.length, 'elementos');
    console.log('📝 [Service] Coberturas completas:', JSON.stringify(this.coberturas, null, 2));
    
    const resultado = this.coberturas.sort((a, b) => a.deducible - b.deducible);
    console.log('📤 [Service] Devolviendo resultado ordenado:', resultado.length, 'elementos');
    
    return resultado;
  }

  findOne(id: number): Cobertura {
    const cobertura = this.coberturas.find(c => c.id === id);
    
    if (!cobertura) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }
    
    return cobertura;
  }

  findByTipo(tipo: string): Cobertura[] {
    const coberturasFiltradas = this.coberturas.filter(c => c.tipo.toLowerCase() === tipo.toLowerCase());
    
    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorTipo',
      filtro: tipo,
      resultados: coberturasFiltradas.length,
      timestamp: new Date().toISOString()
    });

    return coberturasFiltradas;
  }

  findByDeducibleRango(minimo: number, maximo: number): Cobertura[] {
    const coberturasFiltradas = this.coberturas.filter(c => c.deducible >= minimo && c.deducible <= maximo);

    // Emitir evento de búsqueda
    this.emitEvent('busquedaRealizada', {
      tipo: 'busquedaPorRangoDeducible',
      filtro: `${minimo}-${maximo}`,
      resultados: coberturasFiltradas.length,
      timestamp: new Date().toISOString()
    });

    return coberturasFiltradas;
  }

  findCoberturasEconomicas(limite: number = 300): Cobertura[] {
    const coberturasFiltradas = this.coberturas.filter(c => c.deducible <= limite);

    // Emitir evento de análisis
    this.emitEvent('analisisEconomico', {
      tipo: 'coberturas_economicas',
      limite: limite,
      resultados: coberturasFiltradas.length,
      ahorro_promedio: this.calcularAhorroPromedio(coberturasFiltradas),
      timestamp: new Date().toISOString()
    });

    return coberturasFiltradas;
  }

  update(id: number, updateCoberturaDto: UpdateCoberturaDto): Cobertura {
    const coberturaAnterior = this.findOne(id);
    const coberturaOriginal = { ...coberturaAnterior };

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
      throw new BadRequestException('El deducible debe ser un valor positivo entre 0 y 10000');
    }

    // Actualizar campos
    if (updateCoberturaDto.tipo !== undefined) {
      coberturaAnterior.tipo = updateCoberturaDto.tipo.toLowerCase();
    }
    
    if (updateCoberturaDto.seguro !== undefined) {
      coberturaAnterior.seguro = updateCoberturaDto.seguro.toLowerCase();
    }
    
    if (updateCoberturaDto.deducible !== undefined) {
      coberturaAnterior.deducible = parseFloat(updateCoberturaDto.deducible.toFixed(2));
    }

    // Emitir evento de actualización con análisis
    this.emitEvent('coberturaActualizada', {
      coberturaAnterior: coberturaOriginal,
      coberturaNueva: coberturaAnterior,
      cambios: this.detectarCambios(coberturaOriginal, coberturaAnterior),
      impactoEconomico: this.calcularImpactoEconomico(coberturaOriginal, coberturaAnterior),
      timestamp: new Date().toISOString()
    });

    return coberturaAnterior;
  }

  remove(id: number): boolean {
    const cobertura = this.findOne(id);
    const index = this.coberturas.findIndex(c => c.id === id);
    
    if (index === -1) {
      throw new NotFoundException(`Cobertura con ID ${id} no encontrada`);
    }

    this.coberturas.splice(index, 1);

    // Emitir evento de eliminación
    this.emitEvent('coberturaEliminada', {
      cobertura: cobertura,
      impactoEnPortfolio: this.analizarImpactoEnPortfolio(),
      timestamp: new Date().toISOString(),
      totalRestante: this.coberturas.length
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
      totalCoberturas: this.coberturas.length,
      estadisticasTipo: this.getEstadisticasPorTipo(),
      estadisticasSeguro: this.getEstadisticasPorSeguro(),
      coberturaMasCaraDeducible: this.coberturas.reduce((prev, current) => 
        prev.deducible > current.deducible ? prev : current
      ),
      coberturaMasBarataDeducible: this.coberturas.reduce((prev, current) => 
        prev.deducible < current.deducible ? prev : current
      ),
      deduciblePromedio: this.getDeduciblePromedio(),
      rangoPreciosos: {
        economicas: this.findCoberturasEconomicas().length,
        premium: this.findCoberturasPremiun().length,
      },
      tendenciasDeducible: this.analizarTendenciasDeducible(),
      timestamp: new Date().toISOString()
    };

    // Emitir estadísticas actualizadas
    this.emitEvent('estadisticasActualizadas', estadisticas);
    
    return estadisticas;
  }

  monitoreaPreciosEnTiempoReal(): void {
    const alertas = this.detectarAlertasPrecios();
    
    if (alertas.length > 0) {
      this.emitEvent('alertasPrecios', {
        alertas: alertas,
        timestamp: new Date().toISOString()
      });
    }
  }

  iniciarMonitoreoTiempoReal(intervalo: number = 20000): void {
    setInterval(() => {
      this.getEstadisticasEnTiempoReal();
      this.monitoreaPreciosEnTiempoReal();
      this.analizarOportunidadesNegocio();
    }, intervalo);
  }

  // Métodos de análisis de negocio específicos
  private analizarOportunidadesNegocio(): void {
    const oportunidades: any[] = [];

    // Detectar desequilibrios en el portfolio
    const stats = this.getEstadisticasPorTipo();
    const totalCoberturas = this.coberturas.length;

    Object.entries(stats).forEach(([tipo, cantidad]) => {
      const porcentaje = (cantidad / totalCoberturas) * 100;
      if (porcentaje < 10) {
        oportunidades.push({
          tipo: 'expansion_cobertura',
          descripcion: `Oportunidad de expandir cobertura tipo '${tipo}' (solo ${porcentaje.toFixed(1)}% del portfolio)`,
          prioridad: 'media'
        });
      }
    });

    // Detectar gaps de precios
    const deducibles = this.coberturas.map(c => c.deducible).sort((a, b) => a - b);
    for (let i = 1; i < deducibles.length; i++) {
      if (deducibles[i] - deducibles[i-1] > 200) {
        oportunidades.push({
          tipo: 'gap_precios',
          descripcion: `Gap de precios detectado entre ${deducibles[i-1]} y ${deducibles[i]}`,
          prioridad: 'alta'
        });
      }
    }

    if (oportunidades.length > 0) {
      this.emitEvent('oportunidadesNegocio', {
        oportunidades: oportunidades,
        timestamp: new Date().toISOString()
      });
    }
  }

  private detectarAlertasPrecios(): any[] {
    const alertas: any[] = [];
    const deduciblePromedio = this.getDeduciblePromedio();

    this.coberturas.forEach(cobertura => {
      // Alerta si el deducible está muy por encima del promedio
      if (cobertura.deducible > deduciblePromedio * 1.5) {
        alertas.push({
          tipo: 'precio_alto',
          cobertura: cobertura,
          mensaje: `Deducible muy alto comparado con el promedio (${deduciblePromedio.toFixed(2)})`,
          gravedad: 'warning'
        });
      }

      // Alerta si el deducible está muy por debajo del promedio
      if (cobertura.deducible < deduciblePromedio * 0.5) {
        alertas.push({
          tipo: 'precio_bajo',
          cobertura: cobertura,
          mensaje: `Deducible muy bajo, posible pérdida de rentabilidad`,
          gravedad: 'info'
        });
      }
    });

    return alertas;
  }

  // Métodos de validación y lógica de negocio
  private validarDatosCobertura(datos: CreateCoberturaDto): void {
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

  private detectarCambios(anterior: Cobertura, nueva: Cobertura): string[] {
    const cambios: string[] = [];
    
    if (anterior.tipo !== nueva.tipo) cambios.push(`tipo: ${anterior.tipo} → ${nueva.tipo}`);
    if (anterior.seguro !== nueva.seguro) cambios.push(`seguro: ${anterior.seguro} → ${nueva.seguro}`);
    if (anterior.deducible !== nueva.deducible) cambios.push(`deducible: ${anterior.deducible} → ${nueva.deducible}`);
    
    return cambios;
  }

  private calcularImpactoEconomico(anterior: Cobertura, nueva: Cobertura): any {
    const cambioDeducible = nueva.deducible - anterior.deducible;
    const porcentajeCambio = (cambioDeducible / anterior.deducible) * 100;

    return {
      cambioDeducible: cambioDeducible,
      porcentajeCambio: porcentajeCambio.toFixed(2),
      impacto: porcentajeCambio > 10 ? 'alto' : porcentajeCambio > 5 ? 'medio' : 'bajo'
    };
  }

  private analizarImpactoEnPortfolio(): any {
    return {
      totalCoberturas: this.coberturas.length,
      promedioDeducible: this.getDeduciblePromedio(),
      distribucionTipos: this.getEstadisticasPorTipo()
    };
  }

  private analizarTendenciasDeducible(): any {
    const deducibles = this.coberturas.map(c => c.deducible);
    const promedio = deducibles.reduce((sum, val) => sum + val, 0) / deducibles.length;
    const maximo = Math.max(...deducibles);
    const minimo = Math.min(...deducibles);

    return {
      promedio: promedio.toFixed(2),
      maximo,
      minimo,
      rango: maximo - minimo,
      volatilidad: this.calcularVolatilidad(deducibles)
    };
  }

  private calcularVolatilidad(valores: number[]): number {
    const promedio = valores.reduce((sum, val) => sum + val, 0) / valores.length;
    const varianza = valores.reduce((sum, val) => sum + Math.pow(val - promedio, 2), 0) / valores.length;
    return Math.sqrt(varianza);
  }

  private calcularAhorroPromedio(coberturas: Cobertura[]): number {
    if (coberturas.length === 0) return 0;
    const promedioGeneral = this.getDeduciblePromedio();
    const promedioEconomicas = coberturas.reduce((sum, c) => sum + c.deducible, 0) / coberturas.length;
    return promedioGeneral - promedioEconomicas;
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

  findCoberturasPremiun(limite: number = 500): Cobertura[] {
    return this.coberturas.filter(c => c.deducible >= limite);
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

    const primaBase = 100;
    const primaEstimada = (deducible * factorTipo) + primaBase;
    
    return parseFloat(primaEstimada.toFixed(2));
  }

  recomendarCobertura(presupuesto: number): Cobertura[] {
    const recomendaciones = this.coberturas
      .filter(c => c.deducible <= presupuesto)
      .sort((a, b) => {
        const valorA = this.calcularValorCobertura(a);
        const valorB = this.calcularValorCobertura(b);
        return valorB - valorA;
      })
      .slice(0, 3);

    // Emitir evento de recomendación
    this.emitEvent('recomendacionGenerada', {
      presupuesto: presupuesto,
      recomendaciones: recomendaciones,
      criterios: 'mejor_valor_cobertura',
      timestamp: new Date().toISOString()
    });

    return recomendaciones;
  }

  private calcularValorCobertura(cobertura: Cobertura): number {
    let puntos = 0;
    
    switch (cobertura.tipo) {
      case 'total': puntos += 10; break;
      case 'contra robo': puntos += 8; break;
      case 'parcial': puntos += 6; break;
      case 'contra terceros': puntos += 4; break;
      default: puntos += 2;
    }
    
    puntos += Math.max(0, (1000 - cobertura.deducible) / 100);
    
    return puntos;
  }

  notificarCambioImportante(mensaje: string, tipo: 'info' | 'warning' | 'error' = 'info'): void {
    this.emitEvent('notificacion', {
      mensaje,
      tipo,
      timestamp: new Date().toISOString(),
      modulo: 'coberturas'
    });
  }
}
