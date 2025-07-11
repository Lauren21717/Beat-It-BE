import { Repository } from 'typeorm';
import { MusicianProfile } from './entities/musician-profile.entity';
import { User } from '../users/entities/user.entity';
import { MusicianQueryDto } from './dto/musician-query.dto';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';
export declare class MusiciansService {
    private musicianRepository;
    private userRepository;
    constructor(musicianRepository: Repository<MusicianProfile>, userRepository: Repository<User>);
    findAll(query?: MusicianQueryDto): Promise<any[]>;
    findOne(id: number): Promise<any | null>;
    create(createMusicianDto: CreateMusicianDto): Promise<any>;
    update(id: number, updateMusicianDto: UpdateMusicianDto): Promise<any>;
    remove(id: number): Promise<void>;
}
