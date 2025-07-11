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
exports.MusiciansController = void 0;
const common_1 = require("@nestjs/common");
const musicians_service_1 = require("./musicians.service");
const musician_query_dto_1 = require("./dto/musician-query.dto");
const create_musician_dto_1 = require("./dto/create-musician.dto");
const update_musician_dto_1 = require("./dto/update-musician.dto");
let MusiciansController = class MusiciansController {
    musiciansService;
    constructor(musiciansService) {
        this.musiciansService = musiciansService;
    }
    async findAll(query) {
        const musicians = await this.musiciansService.findAll(query);
        return { musicians };
    }
    async findOne(id) {
        const musician = await this.musiciansService.findOne(id);
        if (!musician) {
            throw new common_1.NotFoundException(`Musician with ID ${id} not found`);
        }
        return { musician };
    }
    async create(createMusicianDto) {
        const musician = await this.musiciansService.create(createMusicianDto);
        return { musician };
    }
    async update(id, updateMusicianDto) {
        const musician = await this.musiciansService.update(id, updateMusicianDto);
        return { musician };
    }
    async remove(id) {
        await this.musiciansService.remove(id);
    }
};
exports.MusiciansController = MusiciansController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [musician_query_dto_1.MusicianQueryDto]),
    __metadata("design:returntype", Promise)
], MusiciansController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MusiciansController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_musician_dto_1.CreateMusicianDto]),
    __metadata("design:returntype", Promise)
], MusiciansController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_musician_dto_1.UpdateMusicianDto]),
    __metadata("design:returntype", Promise)
], MusiciansController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MusiciansController.prototype, "remove", null);
exports.MusiciansController = MusiciansController = __decorate([
    (0, common_1.Controller)('api/musicians'),
    __metadata("design:paramtypes", [musicians_service_1.MusiciansService])
], MusiciansController);
//# sourceMappingURL=musicians.controller.js.map