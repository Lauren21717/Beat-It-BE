import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
} from 'typeorm';
import { MusicianProfile } from '../../musicians/entities/musician-profile.entity';
import { BandProfile } from '../../bands/entities/band-profile.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  avatar_url: string;

  @Column({
    type: 'enum',
    enum: ['musician', 'band', 'both'],
    default: 'musician',
  })
  user_type: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToOne(() => MusicianProfile, (profile) => profile.user)
  musicianProfile: MusicianProfile;

  @OneToOne(() => BandProfile, (profile) => profile.user)
  bandProfile: BandProfile;
}
