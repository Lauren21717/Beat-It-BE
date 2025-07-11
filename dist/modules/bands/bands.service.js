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
exports.BandsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const band_profile_entity_1 = require("./entities/band-profile.entity");
const user_entity_1 = require("../users/entities/user.entity");
let BandsService = class BandsService {
    bandRepository;
    userRepository;
    constructor(bandRepository, userRepository) {
        this.bandRepository = bandRepository;
        this.userRepository = userRepository;
    }
    async findAll(query) {
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
            queryBuilder.andWhere('band.looking_for_instruments ILIKE :looking_for_instrument', {
                looking_for_instrument: `%${query.looking_for_instrument}%`,
            });
        }
        if (query?.experience_level) {
            queryBuilder.andWhere('band.experience_level = :experience_level', {
                experience_level: query.experience_level,
            });
        }
        const results = await queryBuilder
            .orderBy('band.created_at', 'DESC')
            .getMany();
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
    async findOne(id) {
        const band = await this.bandRepository
            .createQueryBuilder('band')
            .leftJoinAndSelect('band.user', 'user')
            .where('band.band_id = :id', { id })
            .getOne();
        if (!band) {
            return null;
        }
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
    async create(createBandDto) {
        const user = await this.userRepository.findOne({
            where: { user_id: createBandDto.user_id },
        });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
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
};
exports.BandsService = BandsService;
exports.BandsService = BandsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(band_profile_entity_1.BandProfile)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], BandsService);
//# sourceMappingURL=bands.service.js.map