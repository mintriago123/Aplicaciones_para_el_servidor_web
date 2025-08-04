import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CoberturasService } from './coberturas.service';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';

@WebSocketGateway({
  namespace: '/coberturas',
  cors: {
    origin: '*',
  },
})
export class CoberturasGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly coberturasService: CoberturasService) {}

  // Crear nueva cobertura
  @SubscribeMessage('coberturas:create')
  async create(@MessageBody() createCoberturaDto: CreateCoberturaDto, @ConnectedSocket() client: Socket) {
    try {
      console.log('➕ [Gateway] Solicitud create recibida de cliente:', client.id);
      console.log('📦 [Gateway] Datos recibidos:', JSON.stringify(createCoberturaDto, null, 2));
      
      const nuevaCobertura = this.coberturasService.create(createCoberturaDto);
      console.log('✅ [Gateway] Cobertura creada exitosamente:', JSON.stringify(nuevaCobertura, null, 2));
      
      // Notificar a todos los clientes conectados
      this.server.emit('coberturas:created', nuevaCobertura);
      
      const response = {
        status: 'success',
        message: 'Cobertura creada exitosamente',
        data: nuevaCobertura
      };
      
      console.log('📤 [Gateway] Enviando respuesta create:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('❌ [Gateway] Error en create:', error.message);
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener todas las coberturas
  @SubscribeMessage('coberturas:findAll')
  async findAll(@ConnectedSocket() client: Socket) {
    try {
      console.log('🔍 [Gateway] Solicitud findAll recibida de cliente:', client.id);
      const coberturas = this.coberturasService.findAll();
      console.log('📋 [Gateway] Coberturas obtenidas del servicio:', coberturas.length, 'elementos');
      console.log('📦 [Gateway] Datos completos:', JSON.stringify(coberturas, null, 2));
      
      const response = {
        status: 'success',
        data: coberturas,
        total: coberturas.length,
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 [Gateway] Enviando respuesta:', JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.error('❌ [Gateway] Error en findAll:', error.message);
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener cobertura por ID
  @SubscribeMessage('coberturas:findOne')
  async findOne(@MessageBody() data: { id: number }, @ConnectedSocket() client: Socket) {
    try {
      const cobertura = this.coberturasService.findOne(data.id);
      return {
        status: 'success',
        data: cobertura
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener coberturas por tipo
  @SubscribeMessage('coberturas:findByTipo')
  async findByTipo(@MessageBody() data: { tipo: string }, @ConnectedSocket() client: Socket) {
    try {
      const coberturas = this.coberturasService.findAll().filter(
        cobertura => cobertura.tipo.toLowerCase().includes(data.tipo.toLowerCase())
      );
      return {
        status: 'success',
        data: coberturas
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener coberturas por seguro
  @SubscribeMessage('coberturas:findBySeguro')
  async findBySeguro(@MessageBody() data: { seguro: string }, @ConnectedSocket() client: Socket) {
    try {
      const coberturas = this.coberturasService.findAll().filter(
        cobertura => cobertura.seguro.toLowerCase().includes(data.seguro.toLowerCase())
      );
      return {
        status: 'success',
        data: coberturas
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Actualizar cobertura
  @SubscribeMessage('coberturas:update')
  async update(@MessageBody() updateCoberturaDto: UpdateCoberturaDto, @ConnectedSocket() client: Socket) {
    try {
      const coberturaActualizada = this.coberturasService.update(updateCoberturaDto.id, updateCoberturaDto);
      
      // Notificar a todos los clientes conectados
      this.server.emit('coberturas:updated', coberturaActualizada);
      
      return {
        status: 'success',
        message: 'Cobertura actualizada exitosamente',
        data: coberturaActualizada
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Eliminar cobertura
  @SubscribeMessage('coberturas:remove')
  async remove(@MessageBody() data: { id: number }, @ConnectedSocket() client: Socket) {
    try {
      const resultado = this.coberturasService.remove(data.id);
      
      // Notificar a todos los clientes conectados
      this.server.emit('coberturas:removed', { id: data.id });
      
      return {
        status: 'success',
        message: 'Cobertura eliminada exitosamente',
        data: resultado
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Obtener estadísticas de coberturas
  @SubscribeMessage('coberturas:statistics')
  async getStatistics(@ConnectedSocket() client: Socket) {
    try {
      const coberturas = this.coberturasService.findAll();
      const statistics = {
        total: coberturas.length,
        tiposMasComunes: this.getMostCommonTypes(coberturas),
        promedioDeducible: this.getAverageDeductible(coberturas),
        coberturaPorSeguro: this.getCoverageByInsurance(coberturas)
      };
      
      return {
        status: 'success',
        data: statistics
      };
    } catch (error) {
      client.emit('coberturas:error', {
        status: 'error',
        message: error.message
      });
      return {
        status: 'error',
        message: error.message
      };
    }
  }

  // Métodos auxiliares para estadísticas
  private getMostCommonTypes(coberturas: any[]) {
    const tipos = coberturas.reduce((acc, cobertura) => {
      acc[cobertura.tipo] = (acc[cobertura.tipo] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(tipos)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3);
  }

  private getAverageDeductible(coberturas: any[]) {
    const total = coberturas.reduce((sum, cobertura) => sum + cobertura.deducible, 0);
    return coberturas.length > 0 ? (total / coberturas.length).toFixed(2) : 0;
  }

  private getCoverageByInsurance(coberturas: any[]) {
    return coberturas.reduce((acc, cobertura) => {
      if (!acc[cobertura.seguro]) {
        acc[cobertura.seguro] = [];
      }
      acc[cobertura.seguro].push(cobertura);
      return acc;
    }, {});
  }

  // Eventos de conexión
  handleConnection(client: Socket) {
    console.log(`🔗 [Gateway] Cliente conectado al namespace de coberturas: ${client.id}`);
    client.emit('coberturas:connected', {
      message: 'Conectado al servicio de coberturas',
      clientId: client.id,
      namespace: '/coberturas',
      timestamp: new Date().toISOString()
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`🔌 [Gateway] Cliente desconectado del namespace de coberturas: ${client.id}`);
  }
}
