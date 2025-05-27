import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlagaService } from './plaga.service';
import { CreatePlagaDto } from './dto/create-plaga.dto';
import { UpdatePlagaDto } from './dto/update-plaga.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('plaga')
@Controller('plaga')
export class PlagaController {
  constructor(private readonly plagaService: PlagaService) {}

  @Post()
  create(@Body() dto: CreatePlagaDto) {
    return this.plagaService.create(dto);
  }

  @Get()
  findAll() {
    return this.plagaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plagaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlagaDto) {
    return this.plagaService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plagaService.remove(+id);
  }
}
