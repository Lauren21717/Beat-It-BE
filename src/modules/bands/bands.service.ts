import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BandProfile } from './entities/band-profile.entity';
import { User } from '../users/entities/user.entity';
import { BandQueryDto } from './dto/band-query.dto';
import { CreateBandDto } from './dto/create-band.dto';
import { UpdateBandDto } from './dto/update-band.dto';

@Injectable()
export class BandsService {
  constructor(
    @InjectRepository(BandProfile)
    private bandRepository: Repository<BandProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query?: BandQueryDto): Promise<any[]> {
    const queryBuilder = this.bandRepository
      .createQueryBuilder('band')
      .leftJoinAndSelect('band.user', 'user');

    if (query?.genre) {
      queryBuilder.andWhere('band.genre ILIKE :genre', {
        genre: `%${query.genre}%`,
      });
    }

    if (query?.location) {
      queryBuilder.andWhere('band.location ILIKE :location', {
        location: `%${query.location}%`,
      });
    }

    if (query?.looking_for_instrument) {
      queryBuilder.andWhere(
        'band.looking_for_instruments ILIKE :looking_for_instrument',
        {
          looking_for_instrument: `%${query.looking_for_instrument}%`,
        },
      );
    }

    if (query?.experience_level) {
      queryBuilder.andWhere('band.experience_level = :experience_level', {
        experience_level: query.experience_level,
      });
    }

    const results = await queryBuilder
      .orderBy('band.created_at', 'DESC')
      .getMany();

    // Map the nested results to flat DTOs
    return results.map((band) => ({
      band_id: band.band_id,
      band_name: band.band_name,
      username: band.user?.username,
      bio: band.bio,
      genre: band.genre,
      location: band.location,
      looking_for_instruments: band.looking_for_instruments,
      experience_level: band.experience_level,
      created_at: band.created_at,
    }));
  }

  async findOne(id: number): Promise<any | null> {
    const band = await this.bandRepository
      .createQueryBuilder('band')
      .leftJoinAndSelect('band.user', 'user')
      .where('band.band_id = :id', { id })
      .getOne();

    if (!band) {
      return null;
    }

    // Map the nested result to flat DTO
    return {
      band_id: band.band_id,
      band_name: band.band_name,
      username: band.user?.username,
      bio: band.bio,
      genre: band.genre,
      location: band.location,
      looking_for_instruments: band.looking_for_instruments,
      experience_level: band.experience_level,
      created_at: band.created_at,
    };
  }

  async create(createBandDto: CreateBandDto): Promise<any> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { user_id: createBandDto.user_id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create band profile
    const bandProfile = this.bandRepository.create({
      user: user,
      band_name: createBandDto.band_name,
      bio: createBandDto.bio,
      genre: createBandDto.genre,
      location: createBandDto.location,
      looking_for_instruments: createBandDto.looking_for_instruments,
      experience_level: createBandDto.experience_level,
    });

    const savedBand = await this.bandRepository.save(bandProfile);

    // Return formatted response
    return {
      band_id: savedBand.band_id,
      band_name: savedBand.band_name,
      username: user.username,
      bio: savedBand.bio,
      genre: savedBand.genre,
      location: savedBand.location,
      looking_for_instruments: savedBand.looking_for_instruments,
      experience_level: savedBand.experience_level,
      created_at: savedBand.created_at,
    };
  }

  async update(id: number, updateBandDto: UpdateBandDto): Promise<any> {
    // Check if band exists
    const existingBand = await this.bandRepository
      .createQueryBuilder('band')
      .leftJoinAndSelect('band.user', 'user')
      .where('band.band_id = :id', { id })
      .getOne();

    if (!existingBand) {
      throw new NotFoundException(`Band with ID ${id} not found`);
    }

    // Update the band
    await this.bandRepository.update(id, updateBandDto);

    // Fetch and return the updated band
    const updatedBand = await this.bandRepository
      .createQueryBuilder('band')
      .leftJoinAndSelect('band.user', 'user')
      .where('band.band_id = :id', { id })
      .getOne();

    return {
      band_id: updatedBand.band_id,
      band_name: updatedBand.band_name,
      username: updatedBand.user?.username,
      bio: updatedBand.bio,
      genre: updatedBand.genre,
      location: updatedBand.location,
      looking_for_instruments: updatedBand.looking_for_instruments,
      experience_level: updatedBand.experience_level,
      created_at: updatedBand.created_at,
    };
  }
}
