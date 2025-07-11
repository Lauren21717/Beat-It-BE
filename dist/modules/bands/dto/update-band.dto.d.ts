import { CreateBandDto } from "./create-band.dto";
declare const UpdateBandDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateBandDto, "user_id">>>;
export declare class UpdateBandDto extends UpdateBandDto_base {
}
export {};
