import { IsOptional, IsString, IsEnum } from 'class-validator';

export class MusicianQueryDto {
  @IsOptional()
  @IsString()
  instrument?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'professional'])
  experience_level?: string;
}
