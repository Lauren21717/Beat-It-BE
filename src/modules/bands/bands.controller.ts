import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, NotFoundException, Query } from '@nestjs/common';
import { BandsService } from './bands.service';
import { BandResponseDto } from './dto/band-response.dto';
import { BandQueryDto } from './dto/band-query.dto';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Controller('api/bands')
export class BandsController {
  constructor(private readonly bandsService: BandsService) {}

  @Get()
  async findAll(
    @Query() query: BandQueryDto,
  ): Promise<{ bands: BandResponseDto[] }> {
    const bands = await this.bandsService.findAll(query);
    return { bands };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ band: BandResponseDto }> {
    const band = await this.bandsService.findOne(id);
    if (!band) {
      throw new NotFoundException(`Band with ID ${id} not found`);
    }
    return { band };
  }

  @Post()
  async create(
    @Body() createBandDto: CreateBandDto,
  ): Promise<{ band: BandResponseDto }> {
    const band = await this.bandsService.create(createBandDto);
    return { band };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBandDto: UpdateBandDto,
  ): Promise<{ band: BandResponseDto }> {
    const band = await this.bandsService.update(id, updateBandDto);
    return { band };
  }
}
