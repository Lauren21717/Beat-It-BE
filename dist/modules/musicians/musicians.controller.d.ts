import { MusiciansService } from './musicians.service';
import { MusicianResponseDto } from './dto/musician-response.dto';
import { MusicianQueryDto } from './dto/musician-query.dto';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
export declare class MusiciansController {
    private readonly musiciansService;
    constructor(musiciansService: MusiciansService);
    findAll(query: MusicianQueryDto): Promise<{
        musicians: MusicianResponseDto[];
    }>;
    findOne(id: number): Promise<{
        musician: MusicianResponseDto;
    }>;
    create(createMusicianDto: CreateMusicianDto): Promise<{
        musician: MusicianResponseDto;
    }>;
    update(id: number, updateMusicianDto: UpdateMusicianDto): Promise<{
        musician: MusicianResponseDto;
    }>;
}
