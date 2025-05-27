import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CultivoService } from './cultivo.service';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('cultivo')
@Controller('cultivo')
export class CultivoController {
  constructor(private readonly cultivoService: CultivoService) {}

  @Post()
  create(@Body() dto: CreateCultivoDto) {
    return this.cultivoService.create(dto);
  }

  @Get()
  findAll() {
    return this.cultivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cultivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCultivoDto) {
    return this.cultivoService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cultivoService.remove(+id);
  }
}
