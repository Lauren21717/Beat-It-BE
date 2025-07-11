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
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, MusicianProfile, BandProfile],
      synchronize: process.env.NODE_ENV !== 'production',
      dropSchema: process.env.NODE_ENV === 'test',
    }),
    MusiciansModule,
    BandsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
