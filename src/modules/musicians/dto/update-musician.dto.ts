import { PartialType } from '@nestjs/mapped-types';
import { CreateMusicianDto } from './create-musician.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateMusicianDto extends PartialType(
  OmitType(CreateMusicianDto, ['user_id'] as const)
) {}