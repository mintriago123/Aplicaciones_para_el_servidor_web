import { PartialType } from '@nestjs/mapped-types';
import { CreatePlagaDto } from './create-plaga.dto';

export class UpdatePlagaDto extends PartialType(CreatePlagaDto) {}
