import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('band_profiles')
export class BandProfile {
  @PrimaryGeneratedColumn()
  band_id: number;

  @OneToOne(() => User, (user) => user.bandProfile)
  @JoinColumn()
  user: User;

  @Column()
  band_name: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column()
  genre: string;

  @Column({ nullable: true })
  location: string;

  @Column({ type: 'text' })
  looking_for_instruments: string;

  @Column({
    type: 'enum',
    enum: ['beginner', 'intermediate', 'advanced', 'professional'],
    nullable: true,
  })
  experience_level: string;

  @CreateDateColumn()
  created_at: Date;
}
