import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DatoAexportarService } from './dato-aexportar.service';
import { CreateDatoAexportarDto } from './dto/create-dato-aexportar.dto';
import { UpdateDatoAexportarDto } from './dto/update-dato-aexportar.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('dato-aexportar')
@Controller('dato-aexportar')
export class DatoAexportarController {
  constructor(private readonly service: DatoAexportarService) {}

  @Post()
  create(@Body() dto: CreateDatoAexportarDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDatoAexportarDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
