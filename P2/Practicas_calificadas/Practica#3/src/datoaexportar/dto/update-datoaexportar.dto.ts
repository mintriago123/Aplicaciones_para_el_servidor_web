import { PartialType } from '@nestjs/mapped-types';
import { CreateDatoAexportarDto } from './create-datoaexportar.dto';

export class UpdateDatoAexportarDto extends PartialType(CreateDatoAexportarDto) {}