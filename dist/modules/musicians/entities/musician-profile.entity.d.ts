import { User } from '../../users/entities/user.entity';
export declare class MusicianProfile {
    musician_id: number;
    user: User;
    experience_level: string;
    instruments: string;
    bio: string;
    genres: string;
    available_for_gigs: boolean;
    location: string;
    created_at: Date;
}
