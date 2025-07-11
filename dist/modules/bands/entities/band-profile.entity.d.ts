import { User } from '../../users/entities/user.entity';
export declare class BandProfile {
    band_id: number;
    user: User;
    band_name: string;
    bio: string;
    genre: string;
    location: string;
    looking_for_instruments: string;
    experience_level: string;
    created_at: Date;
}
