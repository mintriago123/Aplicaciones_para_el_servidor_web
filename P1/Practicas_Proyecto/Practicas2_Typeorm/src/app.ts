import { appdataSource } from "./data-source";
import { Cultivo } from "./models/Cultivo";
import { Plaga } from "./models/Plaga";
import { ConsultaAPI } from "./models/ConsultaAPI";
import { TareaProgramada } from "./models/TareaProgramada";
import { DatosAExportar } from "./models/DatosAExportar";
import {initDatabase} from "./database"

async function main() {

  await initDatabase()

  // Insertar Cultivos
  for (let i = 1; i <= 5; i++) {
    const cultivo = new Cultivo();
    cultivo.nombre = `Cultivo ${i}`;
    cultivo.tipo = `Tipo ${i}`;
    await appdataSource.manager.save(cultivo);
    console.log("Cultivo insertado:", cultivo);
  }

  const cultivos = await appdataSource.manager.find(Cultivo);

  // Insertar ConsultaAPI
  for (let i = 1; i <= 5; i++) {
    const consulta = new ConsultaAPI();
    consulta.endpoint = `https://api.ejemplo.com/endpoint${i}`;
    consulta.fecha = new Date();
    await appdataSource.manager.save(consulta);
    console.log("ConsultaAPI insertada:", consulta);
  }

  const consultas = await appdataSource.manager.find(ConsultaAPI);

  // Insertar Plagas asociadas a Cultivo y ConsultaAPI
  for (let i = 1; i <= 5; i++) {
    const plaga = new Plaga();
    plaga.nombre = `Plaga ${i}`;
    plaga.nivel = `Nivel ${i}`;
    plaga.cultivo = cultivos[i % cultivos.length];  
    plaga.consultaAPI = consultas[i % consultas.length];  
    await appdataSource.manager.save(plaga);
    console.log("Plaga insertada:", plaga);
  }

  // Aquí es donde faltaba definir plagas
  const plagas = await appdataSource.manager.find(Plaga);

  // Insertar TareasProgramadas
  for (let i = 1; i <= 5; i++) {
    const tarea = new TareaProgramada();
    tarea.nombre = `Tarea ${i}`;
    tarea.fechaEjecucion = new Date(Date.now() + i * 1000 * 60 * 60 * 24);
    tarea.tipo = `Tipo ${i}`;
    await appdataSource.manager.save(tarea);
    console.log("TareaProgramada insertada:", tarea);
  }

  // Insertar DatosAExportar
  for (let i = 1; i <= 5; i++) {
    const datos = new DatosAExportar();
    datos.tipoDato = i % 3 === 0 ? 'cultivo' : (i % 3 === 1 ? 'plaga' : 'consultaAPI');
    datos.formato = 'json';
    datos.contenido = `Contenido de prueba ${i}`;
    if (datos.tipoDato === 'cultivo') {
      datos.cultivo = cultivos[i % cultivos.length];
    } else if (datos.tipoDato === 'plaga') {
      datos.plaga = plagas[i % plagas.length];
    } else if (datos.tipoDato === 'consultaAPI') {
      datos.consultaAPI = consultas[i % consultas.length];
    }
    await appdataSource.manager.save(datos);
    console.log("DatosAExportar insertados:", datos);
  }

  await appdataSource.destroy();
  console.log("Datos de prueba insertados correctamente.");
}

main().catch(error => console.error(error));
