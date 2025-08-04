import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoberturasService } from './coberturas.service';
import { CreateCoberturaDto } from './dto/create-cobertura.dto';
import { UpdateCoberturaDto } from './dto/update-cobertura.dto';

@Controller('coberturas')
export class CoberturasController {
  constructor(private readonly coberturasService: CoberturasService) {}

  @Post()
  create(@Body() createCoberturaDto: CreateCoberturaDto) {
    return this.coberturasService.create(createCoberturaDto);
  }

  @Get()
  findAll() {
    return this.coberturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coberturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoberturaDto: UpdateCoberturaDto) {
    return this.coberturasService.update(+id, updateCoberturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coberturasService.remove(+id);
  }
}
