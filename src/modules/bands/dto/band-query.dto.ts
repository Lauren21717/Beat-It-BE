import { IsOptional, IsString, IsEnum } from 'class-validator';

export class BandQueryDto {
  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  looking_for_instrument?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'professional'])
  experience_level?: string;
}
