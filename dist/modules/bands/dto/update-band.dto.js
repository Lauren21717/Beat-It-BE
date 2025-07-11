"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBandDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_band_dto_1 = require("./create-band.dto");
class UpdateBandDto extends (0, mapped_types_1.PartialType)((0, mapped_types_1.OmitType)(create_band_dto_1.CreateBandDto, ['user_id'])) {
}
exports.UpdateBandDto = UpdateBandDto;
//# sourceMappingURL=update-band.dto.js.map