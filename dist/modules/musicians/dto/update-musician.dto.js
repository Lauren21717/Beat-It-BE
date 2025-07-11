"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMusicianDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_musician_dto_1 = require("./create-musician.dto");
const mapped_types_2 = require("@nestjs/mapped-types");
class UpdateMusicianDto extends (0, mapped_types_1.PartialType)((0, mapped_types_2.OmitType)(create_musician_dto_1.CreateMusicianDto, ['user_id'])) {
}
exports.UpdateMusicianDto = UpdateMusicianDto;
//# sourceMappingURL=update-musician.dto.js.map