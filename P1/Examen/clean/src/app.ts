import 'reflect-metadata';
import { envs } from './config/envs';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { initializeTypeORM } from './data/typeorm/typeorm.config';
import { DatasourceConfig, DatasourceType } from './infrastructure/datasource/datasource.config';

(async()=> {
  main();
})();

async function main() {
  
  // Detectar el tipo de datasource desde variables de entorno o usar MEMORY por defecto
  const datasourceType = (process.env.DATASOURCE_TYPE || 'MEMORY').toUpperCase() as keyof typeof DatasourceType;
  const selectedDatasource = DatasourceType[datasourceType] || DatasourceType.MEMORY;
  
  console.log(`🔧 Starting application with datasource: ${selectedDatasource}`);

  // Solo inicializar base de datos si es necesario
  if (selectedDatasource === DatasourceType.TYPEORM) {
    try {
      console.log('📊 Initializing TypeORM database...');
      await initializeTypeORM();
      console.log('✅ TypeORM database initialized successfully');
    } catch (error) {
      console.error('❌ Error during TypeORM database initialization:', error);
      console.log('💡 Tip: If you want to use memory datasource, set DATASOURCE_TYPE=memory or don\'t configure database');
      process.exit(1);
    }
  } else if (selectedDatasource === DatasourceType.PRISMA) {
    try {
      console.log('📊 Initializing Prisma database...');
      // Prisma se inicializa automáticamente, pero podemos verificar la conexión
      const { prisma } = await import('./data/postgres');
      await prisma.$connect();
      console.log('✅ Prisma database initialized successfully');
    } catch (error) {
      console.error('❌ Error during Prisma database initialization:', error);
      console.log('💡 Tip: If you want to use memory datasource, set DATASOURCE_TYPE=memory or don\'t configure database');
      process.exit(1);
    }
  } else {
    console.log('🧠 Using memory datasource - no database initialization required');
    console.log('💾 Data will be stored in memory arrays and lost on restart');
    console.log('🔗 Available endpoints: /api/todos-memory');
  }

  // Configurar el datasource seleccionado
  DatasourceConfig.setDatasource(selectedDatasource);
  console.log(`🎯 Datasource configured: ${DatasourceConfig.getCurrentDatasourceType()}`);

  const server = new Server({
    port: envs.PORT,
    public_path: envs.PUBLIC_PATH,
    routes: AppRoutes.routes,
  });

  server.start();
}