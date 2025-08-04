import { PartialType } from '@nestjs/mapped-types';
import { CreateConductorDto } from './create-conductor.dto';

export class UpdateConductorDto extends PartialType(CreateConductorDto) {
  id: number;
}
