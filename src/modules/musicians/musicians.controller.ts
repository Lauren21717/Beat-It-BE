import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { MusiciansService } from './musicians.service';
import { MusicianResponseDto } from './dto/musician-response.dto';
import { MusicianQueryDto } from './dto/musician-query.dto';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';

@Controller('api/musicians')
export class MusiciansController {
  constructor(private readonly musiciansService: MusiciansService) {}

  @Get()
  async findAll(
    @Query() query: MusicianQueryDto,
  ): Promise<{ musicians: MusicianResponseDto[] }> {
    const musicians = await this.musiciansService.findAll(query);
    return { musicians };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ musician: MusicianResponseDto }> {
    const musician = await this.musiciansService.findOne(id);
    if (!musician) {
      throw new NotFoundException(`Musician with ID ${id} not found`);
    }
    return { musician };
  }

  @Post()
  async create(
    @Body() createMusicianDto: CreateMusicianDto,
  ): Promise<{ musician: MusicianResponseDto }> {
    const musician = await this.musiciansService.create(createMusicianDto);
    return { musician };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMusicianDto: UpdateMusicianDto,
  ): Promise<{ musician: MusicianResponseDto }> {
    const musician = await this.musiciansService.update(id, updateMusicianDto);
    return { musician };
  }
}
