import { MusicianProfile } from '../../musicians/entities/musician-profile.entity';
import { BandProfile } from '../../bands/entities/band-profile.entity';
export declare class User {
    user_id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    location: string;
    avatar_url: string;
    user_type: string;
    created_at: Date;
    musicianProfile: MusicianProfile;
    bandProfile: BandProfile;
}
