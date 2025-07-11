import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';

export class CreateMusicianDto {
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced', 'professional'])
  experience_level: string;

  @IsString()
  @IsNotEmpty()
  instruments: string;

  @IsString()
  @IsNotEmpty()
  genres: string;

  @IsOptional()
  @IsBoolean()
  available_for_gigs?: boolean;

  @IsOptional()
  @IsString()
  location?: string;
}
