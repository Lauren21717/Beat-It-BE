import { BandsService } from './bands.service';
import { BandResponseDto } from './dto/band-response.dto';
import { BandQueryDto } from './dto/band-query.dto';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
export declare class BandsController {
    private readonly bandsService;
    constructor(bandsService: BandsService);
    findAll(query: BandQueryDto): Promise<{
        bands: BandResponseDto[];
    }>;
    findOne(id: number): Promise<{
        band: BandResponseDto;
    }>;
    create(createBandDto: CreateBandDto): Promise<{
        band: BandResponseDto;
    }>;
    update(id: number, updateBandDto: UpdateBandDto): Promise<{
        band: BandResponseDto;
    }>;
    remove(id: number): Promise<void>;
}
