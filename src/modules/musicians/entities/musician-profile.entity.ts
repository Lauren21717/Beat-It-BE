import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('musician_profiles')
export class MusicianProfile {
  @PrimaryGeneratedColumn()
  musician_id: number;

  @OneToOne(() => User, (user) => user.musicianProfile)
  @JoinColumn()
  user: User;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
  })
  experience_level: string;

  @Column({ type: 'text' })
  instruments: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text' })
  genres: string;

  @Column({ default: true })
  available_for_gigs: boolean;

  @Column({ nullable: true })
  location: string;

  @CreateDateColumn()
  created_at: Date;
}
