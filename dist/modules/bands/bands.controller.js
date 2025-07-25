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
exports.BandsController = void 0;
const common_1 = require("@nestjs/common");
const bands_service_1 = require("./bands.service");
const band_query_dto_1 = require("./dto/band-query.dto");
const create_band_dto_1 = require("./dto/create-band.dto");
const update_band_dto_1 = require("./dto/update-band.dto");
let BandsController = class BandsController {
    bandsService;
    constructor(bandsService) {
        this.bandsService = bandsService;
    }
    async findAll(query) {
        const bands = await this.bandsService.findAll(query);
        return { bands };
    }
    async findOne(id) {
        const band = await this.bandsService.findOne(id);
        if (!band) {
            throw new common_1.NotFoundException(`Band with ID ${id} not found`);
        }
        return { band };
    }
    async create(createBandDto) {
        const band = await this.bandsService.create(createBandDto);
        return { band };
    }
    async update(id, updateBandDto) {
        const band = await this.bandsService.update(id, updateBandDto);
        return { band };
    }
    async remove(id) {
        await this.bandsService.remove(id);
    }
};
exports.BandsController = BandsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [band_query_dto_1.BandQueryDto]),
    __metadata("design:returntype", Promise)
], BandsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BandsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_band_dto_1.CreateBandDto]),
    __metadata("design:returntype", Promise)
], BandsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_band_dto_1.UpdateBandDto]),
    __metadata("design:returntype", Promise)
], BandsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BandsController.prototype, "remove", null);
exports.BandsController = BandsController = __decorate([
    (0, common_1.Controller)('api/bands'),
    __metadata("design:paramtypes", [bands_service_1.BandsService])
], BandsController);
//# sourceMappingURL=bands.controller.js.map