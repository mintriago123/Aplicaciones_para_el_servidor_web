import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Servidor WebSocket para Gestión de Coberturas, Conductores y Vehículos está funcionando!';
  }
}
