import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';

export class CreateBandDto {
  @IsNumber()
  user_id: number;

  @IsString()
  @IsNotEmpty()
  band_name: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsString()
  @IsNotEmpty()
  genre: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  @IsNotEmpty()
  looking_for_instruments: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced', 'professional'])
  experience_level?: string;
}
