"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusiciansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const musician_profile_entity_1 = require("./entities/musician-profile.entity");
const user_entity_1 = require("../users/entities/user.entity");
let MusiciansService = class MusiciansService {
    musicianRepository;
    userRepository;
    constructor(musicianRepository, userRepository) {
        this.musicianRepository = musicianRepository;
        this.userRepository = userRepository;
    }
    async findAll(query) {
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
    async findOne(id) {
        const musician = await this.musicianRepository
            .createQueryBuilder('musician')
            .leftJoinAndSelect('musician.user', 'user')
            .where('musician.musician_id = :id', { id })
            .getOne();
        if (!musician) {
            return null;
        }
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
    async create(createMusicianDto) {
        const user = await this.userRepository.findOne({
            where: { user_id: createMusicianDto.user_id },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
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
    async update(id, updateMusicianDto) {
        const existingMusician = await this.musicianRepository
            .createQueryBuilder('musician')
            .leftJoinAndSelect('musician.user', 'user')
            .where('musician.musician_id = :id', { id })
            .getOne();
        if (!existingMusician) {
            throw new common_1.NotFoundException(`Musician with ID ${id} not found`);
        }
        await this.musicianRepository.update(id, updateMusicianDto);
        const updatedMusician = await this.musicianRepository
            .createQueryBuilder('musician')
            .leftJoinAndSelect('musician.user', 'user')
            .where('musician.musician_id = :id', { id })
            .getOne();
        if (!updatedMusician) {
            throw new common_1.NotFoundException(`Musician with ID ${id} could not be found after update.`);
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
    async remove(id) {
        const existingMusician = await this.musicianRepository.findOne({
            where: { musician_id: id }
        });
        if (!existingMusician) {
            throw new common_1.NotFoundException(`Musician with ID ${id} not found`);
        }
        await this.musicianRepository.delete(id);
    }
};
exports.MusiciansService = MusiciansService;
exports.MusiciansService = MusiciansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(musician_profile_entity_1.MusicianProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MusiciansService);
//# sourceMappingURL=musicians.service.js.map