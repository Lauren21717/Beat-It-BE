"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BandsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bands_service_1 = require("./bands.service");
const bands_controller_1 = require("./bands.controller");
const band_profile_entity_1 = require("./entities/band-profile.entity");
const user_entity_1 = require("../users/entities/user.entity");
let BandsModule = class BandsModule {
};
exports.BandsModule = BandsModule;
exports.BandsModule = BandsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([band_profile_entity_1.BandProfile, user_entity_1.User])
        ],
        controllers: [bands_controller_1.BandsController],
        providers: [bands_service_1.BandsService],
    })
], BandsModule);
//# sourceMappingURL=bands.module.js.map