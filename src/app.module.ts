import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MusiciansModule } from './modules/musicians/musicians.module';
import { BandsModule } from './modules/bands/bands.module';
import { User } from './modules/users/entities/user.entity';
import { MusicianProfile } from './modules/musicians/entities/musician-profile.entity';
import { BandProfile } from './modules/bands/entities/band-profile.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [User, MusicianProfile, BandProfile],
      synchronize: process.env.NODE_ENV !== 'production',
      dropSchema: false,
      autoLoadEntities: true,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
    }),
    MusiciansModule,
    BandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
