import { CreatePeliculaDto, PeliculaDatasource, PeliculaEntity, UpdatePeliculaDto } from '../../domain';

// Tipo para los objetos literales que representan Peliculas en memoria
interface PeliculaMemoryModel {
  id: number;
  titulo: string;
  estrenada: boolean;
}

export class PeliculaMemoryDatasourceImpl implements PeliculaDatasource {

  private peliculas: PeliculaMemoryModel[] = [];
  private nextId: number = 1;

  constructor(initialPeliculas: PeliculaMemoryModel[] = []) {
    this.peliculas = [...initialPeliculas];
    if (this.peliculas.length > 0) {
      this.nextId = Math.max(...this.peliculas.map(pelicula => pelicula.id)) + 1;
    }
  }

  async create(createPeliculaDto: CreatePeliculaDto): Promise<PeliculaEntity> {
    const newPelicula: PeliculaMemoryModel = {
      id: this.nextId++,
      titulo: createPeliculaDto.titulo,
      estrenada: createPeliculaDto.estrenada
    };

    this.peliculas.push(newPelicula);
    return PeliculaEntity.fromObject(newPelicula);
  }

  async getAll(): Promise<PeliculaEntity[]> {
    return this.peliculas.map(pelicula => PeliculaEntity.fromObject(pelicula));
  }

  async findById(id: number): Promise<PeliculaEntity> {
    const pelicula = this.peliculas.find(p => p.id === id);

    if (!pelicula) throw `Pelicula with id ${id} not found`;
    return PeliculaEntity.fromObject(pelicula);
  }

  async updateById(updatePeliculaDto: UpdatePeliculaDto): Promise<PeliculaEntity> {
    const peliculaIndex = this.peliculas.findIndex(p => p.id === updatePeliculaDto.id);

    if (peliculaIndex === -1) throw `Pelicula with id ${updatePeliculaDto.id} not found`;

    const currentPelicula = this.peliculas[peliculaIndex];
    const updatedPelicula = {
      ...currentPelicula,
      ...updatePeliculaDto.values
    };

    this.peliculas[peliculaIndex] = updatedPelicula;
    return PeliculaEntity.fromObject(updatedPelicula);
  }

  async deleteById(id: number): Promise<PeliculaEntity> {
    const peliculaIndex = this.peliculas.findIndex(p => p.id === id);

    if (peliculaIndex === -1) throw `Pelicula with id ${id} not found`;

    const deletedPelicula = this.peliculas[peliculaIndex];
    this.peliculas.splice(peliculaIndex, 1);

    return PeliculaEntity.fromObject(deletedPelicula);
  }

  // Métodos adicionales (opcional)

  public getRawData(): PeliculaMemoryModel[] {
    return [...this.peliculas];
  }

  public clear(): void {
    this.peliculas = [];
    this.nextId = 1;
  }

  public importData(data: PeliculaMemoryModel[]): void {
    this.peliculas = [...data];
    if (this.peliculas.length > 0) {
      this.nextId = Math.max(...this.peliculas.map(p => p.id)) + 1;
    } else {
      this.nextId = 1;
    }
  }

  public exportToJSON(): string {
    return JSON.stringify(this.peliculas, null, 2);
  }

  public importFromJSON(jsonData: string): void {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        this.importData(data);
      } else {
        throw new Error('JSON data must be an array of peliculas');
      }
    } catch (error) {
      throw new Error(`Invalid JSON format: ${error}`);
    }
  }
}
