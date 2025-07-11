import { CreateMusicianDto } from './create-musician.dto';
declare const UpdateMusicianDto_base: import("@nestjs/mapped-types").MappedType<Partial<Omit<CreateMusicianDto, "user_id">>>;
export declare class UpdateMusicianDto extends UpdateMusicianDto_base {
}
export {};
