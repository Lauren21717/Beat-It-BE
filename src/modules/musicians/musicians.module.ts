import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MusiciansService } from './musicians.service';
import { MusiciansController } from './musicians.controller';
import { MusicianProfile } from './entities/musician-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MusicianProfile, User])],
  controllers: [MusiciansController],
  providers: [MusiciansService],
})
export class MusiciansModule {}