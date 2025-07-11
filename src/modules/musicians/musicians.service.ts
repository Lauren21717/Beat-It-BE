import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicianProfile } from './entities/musician-profile.entity';
import { User } from '../users/entities/user.entity';
import { MusicianQueryDto } from './dto/musician-query.dto';
import { CreateMusicianDto } from './dto/create-musician.dto';
import { UpdateMusicianDto } from './dto/update-musician.dto';

@Injectable()
export class MusiciansService {
  constructor(
    @InjectRepository(MusicianProfile)
    private musicianRepository: Repository<MusicianProfile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(query?: MusicianQueryDto): Promise<any[]> {
    const queryBuilder = this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoinAndSelect('musician.user', 'user');

    if (query?.instrument) {
      queryBuilder.andWhere('musician.instruments ILIKE :instrument', {
        instrument: `%${query.instrument}%`,
      });
    }

    if (query?.genre) {
      queryBuilder.andWhere('musician.genres ILIKE :genre', {
        genre: `%${query.genre}%`,
      });
    }

    if (query?.location) {
      queryBuilder.andWhere('musician.location ILIKE :location', {
        location: `%${query.location}%`,
      });
    }

    if (query?.experience_level) {
      queryBuilder.andWhere('musician.experience_level = :experience_level', {
        experience_level: query.experience_level,
      });
    }

    const results = await queryBuilder
      .orderBy('musician.created_at', 'DESC')
      .getMany();

    // Map the nested results to flat DTOs
    return results.map((musician) => ({
      musician_id: musician.musician_id,
      username: musician.user?.username,
      bio: musician.bio,
      experience_level: musician.experience_level,
      instruments: musician.instruments,
      genres: musician.genres,
      available_for_gigs: musician.available_for_gigs,
      location: musician.location,
      created_at: musician.created_at,
    }));
  }

  async findOne(id: number): Promise<any | null> {
    const musician = await this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoinAndSelect('musician.user', 'user')
      .where('musician.musician_id = :id', { id })
      .getOne();

    if (!musician) {
      return null;
    }

    // Map the nested result to flat DTO
    return {
      musician_id: musician.musician_id,
      username: musician.user?.username,
      bio: musician.bio,
      experience_level: musician.experience_level,
      instruments: musician.instruments,
      genres: musician.genres,
      available_for_gigs: musician.available_for_gigs,
      location: musician.location,
      created_at: musician.created_at,
    };
  }

  async create(createMusicianDto: CreateMusicianDto): Promise<any> {
    // Check if user exists
    const user = await this.userRepository.findOne({
      where: { user_id: createMusicianDto.user_id },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create musician profile
    const musicianProfile = this.musicianRepository.create({
      user: user,
      bio: createMusicianDto.bio,
      experience_level: createMusicianDto.experience_level,
      instruments: createMusicianDto.instruments,
      genres: createMusicianDto.genres,
      available_for_gigs: createMusicianDto.available_for_gigs ?? true,
      location: createMusicianDto.location,
    });

    const savedMusician = await this.musicianRepository.save(musicianProfile);

    // Return formatted response
    return {
      musician_id: savedMusician.musician_id,
      username: user.username,
      bio: savedMusician.bio,
      experience_level: savedMusician.experience_level,
      instruments: savedMusician.instruments,
      genres: savedMusician.genres,
      available_for_gigs: savedMusician.available_for_gigs,
      location: savedMusician.location,
      created_at: savedMusician.created_at,
    };
  }

  async update(id: number, updateMusicianDto: UpdateMusicianDto): Promise<any> {
    // Check if musician exists
    const existingMusician = await this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoinAndSelect('musician.user', 'user')
      .where('musician.musician_id = :id', { id })
      .getOne();

    if (!existingMusician) {
      throw new NotFoundException(`Musician with ID ${id} not found`);
    }

    // Update the musician
    await this.musicianRepository.update(id, updateMusicianDto);

    // Fetch and return the updated musician
    const updatedMusician = await this.musicianRepository
      .createQueryBuilder('musician')
      .leftJoinAndSelect('musician.user', 'user')
      .where('musician.musician_id = :id', { id })
      .getOne();

    if (!updatedMusician) {
      throw new NotFoundException(
        `Musician with ID ${id} could not be found after update.`,
      );
    }

    return {
      musician_id: updatedMusician.musician_id,
      username: updatedMusician.user?.username,
      bio: updatedMusician.bio,
      experience_level: updatedMusician.experience_level,
      instruments: updatedMusician.instruments,
      genres: updatedMusician.genres,
      available_for_gigs: updatedMusician.available_for_gigs,
      location: updatedMusician.location,
      created_at: updatedMusician.created_at,
    };
  }
}
