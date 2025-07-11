import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BandsService } from './bands.service';
import { BandsController } from './bands.controller';
import { BandProfile } from './entities/band-profile.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BandProfile, User])
  ],
  controllers: [BandsController],
  providers: [BandsService],
})
export class BandsModule {}