import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ConductorService } from './conductor.service';
import { CreateConductorDto } from './dto/create-conductor.dto';
import { UpdateConductorDto } from './dto/update-conductor.dto';
import { Conductor } from './entities/conductor.entity';

@ApiTags('conductor')
@Controller('conductor')
export class ConductorController {
  constructor(private readonly conductorService: ConductorService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Crear un nuevo conductor',
    description: 'Crea un nuevo conductor con nombre, apellido y email único'
  })
  @ApiBody({ 
    type: CreateConductorDto,
    description: 'Datos del conductor a crear'
  })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'Conductor creado exitosamente',
    type: Conductor
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos o email ya registrado'
  })
  create(@Body() createConductorDto: CreateConductorDto) {
    return this.conductorService.create(createConductorDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Obtener todos los conductores',
    description: 'Retorna la lista completa de conductores ordenados por apellido'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Lista de conductores obtenida exitosamente',
    type: [Conductor]
  })
  findAll() {
    return this.conductorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener un conductor por ID',
    description: 'Retorna los datos de un conductor específico'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'ID del conductor',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Conductor encontrado',
    type: Conductor
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Conductor no encontrado'
  })
  findOne(@Param('id') id: string) {
    return this.conductorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar un conductor',
    description: 'Actualiza los datos de un conductor existente'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'ID del conductor a actualizar',
    example: 1
  })
  @ApiBody({ 
    type: UpdateConductorDto,
    description: 'Datos del conductor a actualizar (campos opcionales)'
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Conductor actualizado exitosamente',
    type: Conductor
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Conductor no encontrado'
  })
  @ApiResponse({ 
    status: HttpStatus.BAD_REQUEST, 
    description: 'Datos inválidos o email ya registrado'
  })
  update(@Param('id') id: string, @Body() updateConductorDto: UpdateConductorDto) {
    return this.conductorService.update(+id, updateConductorDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Eliminar un conductor',
    description: 'Elimina un conductor del sistema'
  })
  @ApiParam({ 
    name: 'id', 
    type: 'number',
    description: 'ID del conductor a eliminar',
    example: 1
  })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Conductor eliminado exitosamente',
    schema: {
      type: 'boolean',
      example: true
    }
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Conductor no encontrado'
  })
  remove(@Param('id') id: string) {
    return this.conductorService.remove(+id);
  }
}
