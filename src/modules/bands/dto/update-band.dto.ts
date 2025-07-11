import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateBandDto } from "./create-band.dto";

export class UpdateBandDto extends PartialType(
    OmitType(CreateBandDto, ['user_id'] as const)
) {}