from typing import List, Optional
import time

# 1. Modelo (similar a interface Istudent en TS)
class ExportEvent:
    def __init__(self, id: int, producto: str, destino: str, estado: str, trazabilidad: Optional[str] = None):
        self.id = id
        self.producto = producto
        self.destino = destino
        self.estado = estado
        self.trazabilidad = trazabilidad  # Campo opcional

# 2. Lista para simular base de datos (como students[])
export_events: List[ExportEvent] = []

# 3. Función para agregar eventos (como agregar())
def agregar_evento(evento: ExportEvent):
    export_events.append(evento)
    print(f"Evento agregado: {evento.producto} hacia {evento.destino}")

# 4. Función tipo callback
def agregar_con_callback(evento: ExportEvent, callback):
    export_events.append(evento)
    callback(evento)

# 5. Simulación de repositorio con una "promesa" usando async/await
async def agregar_evento_async(evento: ExportEvent):
    print("Guardando evento en la base de datos...")
    time.sleep(1)  # Simula una operación lenta
    export_events.append(evento)
    return evento

# 6. Uso del sistema (controlador)
if __name__ == "__main__":
    evento1 = ExportEvent(1, "Banano", "Alemania", "Registrado")
    evento2 = ExportEvent(2, "Cacao", "Suiza", "Empacado")

    # Control directo
    agregar_evento(evento1)

    # Con callback
    agregar_con_callback(evento2, lambda e: print(f"Trazabilidad generada para {e.producto}"))

    # Simulación de asincronía (como Promesas)
    import asyncio

    async def main():
        resultado = await agregar_evento_async(
            ExportEvent(3, "Mango", "EE.UU.", "Inspeccionado")
        )
        print(f"Evento procesado async: {resultado.producto}")

    asyncio.run(main())
