import { Repository } from 'typeorm';
import { BandProfile } from './entities/band-profile.entity';
import { User } from '../users/entities/user.entity';
import { BandQueryDto } from './dto/band-query.dto';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';
export declare class BandsService {
    private bandRepository;
    private userRepository;
    constructor(bandRepository: Repository<BandProfile>, userRepository: Repository<User>);
    findAll(query?: BandQueryDto): Promise<any[]>;
    findOne(id: number): Promise<any | null>;
    create(createBandDto: CreateBandDto): Promise<any>;
    update(id: number, updateBandDto: UpdateBandDto): Promise<any>;
    remove(id: number): Promise<void>;
}
