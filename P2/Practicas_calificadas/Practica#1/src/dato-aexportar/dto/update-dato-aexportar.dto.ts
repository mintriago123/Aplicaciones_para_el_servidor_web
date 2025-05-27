import { PartialType } from '@nestjs/mapped-types';
import { CreateDatoAexportarDto } from './create-dato-aexportar.dto';

export class UpdateDatoAexportarDto extends PartialType(CreateDatoAexportarDto) {}
