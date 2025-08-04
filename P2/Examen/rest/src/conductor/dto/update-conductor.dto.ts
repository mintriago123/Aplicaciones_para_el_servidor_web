import { PartialType } from '@nestjs/swagger';
import { CreateConductorDto } from './create-conductor.dto';

export class UpdateConductorDto extends PartialType(CreateConductorDto) {}
