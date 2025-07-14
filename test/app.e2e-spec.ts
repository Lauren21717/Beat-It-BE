import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { MusicianProfile } from '../src/modules/musicians/entities/musician-profile.entity';
import { BandProfile } from '../src/modules/bands/entities/band-profile.entity';
import { userData } from '../src/database/data/test-data/users';
import { musicianData } from '../src/database/data/test-data/musicians';
import { bandData } from '../src/database/data/test-data/bands';

require('jest-sorted');

describe('Beat It API E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    dataSource = moduleFixture.get<DataSource>(DataSource);
    await seedTestData();
  });

  afterEach(async () => {
    await app.close();
  });

  async function seedTestData() {
    // Clear existing data
    await dataSource.getRepository(BandProfile).delete({});
    await dataSource.getRepository(MusicianProfile).delete({});
    await dataSource.getRepository(User).delete({});

    // Insert test data
    await dataSource.getRepository(User).save(userData);
    await dataSource.getRepository(MusicianProfile).save(musicianData);
    await dataSource.getRepository(BandProfile).save(bandData);
  }

  describe('GET /api', () => {
    test('200: responds with an object detailing the documentation for each endpoint', () => {
      return request(app.getHttpServer())
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('GET /api');
          expect(body['GET /api']).toHaveProperty('description');
        });
    });
  });

  describe('GET /api/musicians', () => {
    test('200: responds with status 200', () => {
      return request(app.getHttpServer()).get('/api/musicians').expect(200);
    });

    test('200: responds with an object containing musicians array', () => {
      return request(app.getHttpServer())
        .get('/api/musicians')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('musicians');
          expect(Array.isArray(body.musicians)).toBe(true);
        });
    });

    test('200: responds with correct number of musicians', () => {
      return request(app.getHttpServer())
        .get('/api/musicians')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians).toHaveLength(2);
        });
    });

    test('200: musicians are sorted by created_at in descending order', () => {
      return request(app.getHttpServer())
        .get('/api/musicians')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });

    test('200: each musician has the correct properties', () => {
      return request(app.getHttpServer())
        .get('/api/musicians')
        .expect(200)
        .then(({ body }) => {
          body.musicians.forEach((musician) => {
            expect(musician).toMatchObject({
              musician_id: expect.any(Number),
              username: expect.any(String),
              bio: expect.any(String),
              experience_level: expect.any(String),
              instruments: expect.any(String),
              genres: expect.any(String),
              available_for_gigs: expect.any(Boolean),
              location: expect.any(String),
              created_at: expect.any(String),
            });
          });
        });
    });

    // filtering queries
    it('200: filters musicians by instrument', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?instrument=guitar')
        .expect(200)
        .then((response) => {
          expect(response.body.musicians).toHaveLength(1);
          expect(response.body.musicians[0].instruments).toMatch(/guitar/i);
        });
    });

    it('200: filters musicians by genre', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?genre=rock')
        .expect(200)
        .then((response) => {
          response.body.musicians.forEach((musician) => {
            expect(musician.genres.toLowerCase()).toMatch(/rock/);
          });
        });
    });

    it('200: filters musicians by location', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?location=London')
        .expect(200)
        .then((response) => {
          response.body.musicians.forEach((musician) => {
            expect(musician.location.toLowerCase()).toMatch(/london/i);
          });
        });
    });

    it('200: filters musicians by experience level', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?experience_level=advanced')
        .expect(200)
        .then((response) => {
          response.body.musicians.forEach((musician) => {
            expect(musician.experience_level).toBe('advanced');
          });
        });
    });

    it('200: supports multiple filters simultaneously', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?genre=rock&experience_level=advanced')
        .expect(200)
        .then((response) => {
          response.body.musicians.forEach((musician) => {
            expect(musician.genres.toLowerCase()).toMatch(/rock/);
            expect(musician.experience_level).toBe('advanced');
          });
        });
    });

    it('200: case-insensitive filtering', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?instrument=GUITAR')
        .expect(200)
        .then((response) => {
          expect(response.body.musicians).toHaveLength(1);
          expect(response.body.musicians[0].instruments.toLowerCase()).toMatch(
            /guitar/,
          );
        });
    });

    it('200: returns empty array when no matches found', () => {
      return request(app.getHttpServer())
        .get('/api/musicians?instrument=violin')
        .expect(200)
        .then((response) => {
          expect(response.body.musicians).toEqual([]);
        });
    });
  });

  describe('GET /api/bands (filtering queries)', () => {
    it('200: filters bands by genre', () => {
      return request(app.getHttpServer())
        .get('/api/bands?genre=rock')
        .expect(200)
        .then((response) => {
          response.body.bands.forEach((band) => {
            expect(band.genre.toLowerCase()).toMatch(/rock/i);
          });
        });
    });

    it('200: filters bands by location', () => {
      return request(app.getHttpServer())
        .get('/api/bands?location=Manchester')
        .expect(200)
        .then((response) => {
          response.body.bands.forEach((band) => {
            expect(band.location.toLowerCase()).toMatch(/manchester/i);
          });
        });
    });

    it('200: filters bands by looking_for_instrument', () => {
      return request(app.getHttpServer())
        .get('/api/bands?looking_for_instrument=guitar')
        .expect(200)
        .then((response) => {
          response.body.bands.forEach((band) => {
            expect(band.looking_for_instruments.toLowerCase()).toMatch(
              /guitar/,
            );
          });
        });
    });

    it('200: supports multiple filters simultaneously for bands', () => {
      return request(app.getHttpServer())
        .get('/api/bands?genre=rock&location=Manchester')
        .expect(200)
        .then((response) => {
          response.body.bands.forEach((band) => {
            expect(band.genre.toLowerCase()).toMatch(/rock/);
            expect(band.location.toLowerCase()).toMatch(/manchester/i);
          });
        });
    });

    it('200: returns empty array when no band matches found', () => {
      return request(app.getHttpServer())
        .get('/api/bands?genre=metal')
        .expect(200)
        .then((response) => {
          expect(response.body.bands).toEqual([]);
        });
    });
  });

  describe('GET /api/musicians/:musician_id', () => {
    test('200: responds with status 200', () => {
      return request(app.getHttpServer()).get('/api/musicians/1').expect(200);
    });

    test('200: responds with a single musician object', () => {
      return request(app.getHttpServer())
        .get('/api/musicians/1')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('musician');
          expect(body.musician).toBeInstanceOf(Object);
        });
    });

    test('200: musician has correct properties and values', () => {
      return request(app.getHttpServer())
        .get('/api/musicians/1')
        .expect(200)
        .then(({ body }) => {
          expect(body.musician).toMatchObject({
            musician_id: 1,
            username: 'guitarmaster',
            bio: expect.any(String),
            experience_level: 'advanced',
            instruments: expect.any(String),
            genres: expect.any(String),
            available_for_gigs: expect.any(Boolean),
            location: 'London',
            created_at: expect.any(String),
          });
        });
    });

    test('404: responds with error when musician does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/musicians/999')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toContain('Musician with ID 999 not found');
        });
    });

    test('400: responds with error when given invalid musician_id', () => {
      return request(app.getHttpServer())
        .get('/api/musicians/not-a-number')
        .expect(400);
    });
  });

  describe('GET /api/bands', () => {
    test('200: responds with status 200', () => {
      return request(app.getHttpServer()).get('/api/bands').expect(200);
    });

    test('200: responds with an object containing bands array', () => {
      return request(app.getHttpServer())
        .get('/api/bands')
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('bands');
          expect(Array.isArray(body.bands)).toBe(true);
        });
    });

    test('200: responds with correct number of bands', () => {
      return request(app.getHttpServer())
        .get('/api/bands')
        .expect(200)
        .then(({ body }) => {
          expect(body.bands).toHaveLength(2);
        });
    });

    test('200: bands are sorted by created_at in descending order', () => {
      return request(app.getHttpServer())
        .get('/api/bands')
        .expect(200)
        .then(({ body }) => {
          expect(body.bands).toBeSortedBy('created_at', { descending: true });
        });
    });

    test('200: each band has the correct properties', () => {
      return request(app.getHttpServer())
        .get('/api/bands')
        .expect(200)
        .then(({ body }) => {
          body.bands.forEach((band) => {
            expect(band).toMatchObject({
              band_id: expect.any(Number),
              band_name: expect.any(String),
              username: expect.any(String),
              bio: expect.any(String),
              genre: expect.any(String),
              location: expect.any(String),
              looking_for_instruments: expect.any(String),
              experience_level: expect.any(String),
              created_at: expect.any(String),
            });
          });
        });
    });
  });

  describe('GET /api/bands/:id', () => {
    it('200: responds with status 200', () => {
      return request(app.getHttpServer()).get('/api/bands/1').expect(200);
    });

    it('200: responds with a single band object', () => {
      return request(app.getHttpServer())
        .get('/api/bands/1')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('band');
          expect(response.body.band).toBeInstanceOf(Object);
        });
    });

    it('200: band has correct properties and values', () => {
      return request(app.getHttpServer())
        .get('/api/bands/1')
        .expect(200)
        .then((response) => {
          expect(response.body.band).toMatchObject({
            band_id: 1,
            band_name: 'The Rock Stars',
            username: 'rockband2023',
            bio: expect.any(String),
            genre: 'rock',
            location: 'Manchester',
            looking_for_instruments: expect.any(String),
            experience_level: 'intermediate',
            created_at: expect.any(String),
          });
        });
    });

    it('404: responds with error when band does not exist', () => {
      return request(app.getHttpServer())
        .get('/api/bands/999')
        .expect(404)
        .then((response) => {
          expect(response.body.message).toContain('Band with ID 999 not found');
        });
    });

    it('400: responds with error when given invalid band_id', () => {
      return request(app.getHttpServer())
        .get('/api/bands/not-a-number')
        .expect(400);
    });
  });

  describe('POST /api/musicians', () => {
    test('201: responds with status 201', () => {
      const newMusician = {
        user_id: 1,
        bio: 'New musician bio',
        experience_level: 'intermediate',
        instruments: 'piano, vocals',
        genres: 'jazz, blues',
        available_for_gigs: true,
        location: 'Bristol',
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(newMusician)
        .expect(201);
    });

    test('201: responds with the created musician object', () => {
      const newMusician = {
        user_id: 2,
        bio: 'Experienced keyboardist',
        experience_level: 'advanced',
        instruments: 'keyboard, synthesizer',
        genres: 'electronic, ambient',
        available_for_gigs: false,
        location: 'Glasgow',
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(newMusician)
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty('musician');
          expect(body.musician).toMatchObject({
            musician_id: expect.any(Number),
            username: expect.any(String),
            bio: 'Experienced keyboardist',
            experience_level: 'advanced',
            instruments: 'keyboard, synthesizer',
            genres: 'electronic, ambient',
            available_for_gigs: false,
            location: 'Glasgow',
            created_at: expect.any(String),
          });
        });
    });

    test('400: responds with error when required fields are missing', () => {
      const incompleteMusician = {
        bio: 'Missing required fields',
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(incompleteMusician)
        .expect(400);
    });

    test('400: responds with error when user_id does not exist', () => {
      const newMusician = {
        user_id: 999,
        experience_level: 'beginner',
        instruments: 'guitar',
        genres: 'rock',
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(newMusician)
        .expect(400);
    });

    test('400: responds with error for invalid experience_level', () => {
      const newMusician = {
        user_id: 1,
        experience_level: 'invalid_level',
        instruments: 'guitar',
        genres: 'rock',
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(newMusician)
        .expect(400);
    });
  });

  describe('POST /api/bands', () => {
    test('201: responds with status 201', () => {
      const newBand = {
        user_id: 1,
        band_name: 'New Jazz Quartet',
        bio: 'Modern jazz ensemble',
        genre: 'jazz',
        location: 'Edinburgh',
        looking_for_instruments: 'saxophone, upright bass',
        experience_level: 'professional',
      };

      return request(app.getHttpServer())
        .post('/api/bands')
        .send(newBand)
        .expect(201);
    });

    test('201: responds with the created band object', () => {
      const newBand = {
        user_id: 2,
        band_name: 'Electric Dreams',
        bio: 'Electronic music collective',
        genre: 'electronic',
        location: 'Brighton',
        looking_for_instruments: 'synthesizer, drum machine',
        experience_level: 'intermediate',
      };

      return request(app.getHttpServer())
        .post('/api/bands')
        .send(newBand)
        .expect(201)
        .then(({ body }) => {
          expect(body).toHaveProperty('band');
          expect(body.band).toMatchObject({
            band_id: expect.any(Number),
            band_name: 'Electric Dreams',
            username: expect.any(String),
            bio: 'Electronic music collective',
            genre: 'electronic',
            location: 'Brighton',
            looking_for_instruments: 'synthesizer, drum machine',
            experience_level: 'intermediate',
            created_at: expect.any(String),
          });
        });
    });

    test('400: responds with error when required fields are missing', () => {
      const incompleteBand = {
        bio: 'Missing required fields',
      };

      return request(app.getHttpServer())
        .post('/api/bands')
        .send(incompleteBand)
        .expect(400);
    });

    test('400: responds with error when user_id does not exist', () => {
      const newBand = {
        user_id: 999,
        band_name: 'Test Band',
        genre: 'rock',
        looking_for_instruments: 'guitar',
      };

      return request(app.getHttpServer())
        .post('/api/bands')
        .send(newBand)
        .expect(400);
    });
  });

  describe('PATCH /api/musicians/:id', () => {
    test('200: responds with status 200', () => {
      const updateMusician = {
        bio: 'Updated musician bio',
        available_for_gigs: false,
      };

      return request(app.getHttpServer())
        .patch('/api/musicians/1')
        .send(updateMusician)
        .expect(200);
    });

    test('200: responds with the updated musician', () => {
      const updateMusician = {
        bio: 'Completely new bio',
        experience_level: 'professional',
        location: 'Newcastle',
      };

      return request(app.getHttpServer())
        .patch('/api/musicians/1')
        .send(updateMusician)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('musician');
          expect(body.musician).toMatchObject({
            musician_id: 1,
            bio: 'Completely new bio',
            experience_level: 'professional',
            location: 'Newcastle',
          });
        });
    });

    test('200: only updates provided fields', () => {
      const updateMusician = {
        available_for_gigs: false,
      };

      return request(app.getHttpServer())
        .patch('/api/musicians/1')
        .send(updateMusician)
        .expect(200)
        .then(({ body }) => {
          expect(body.musician.available_for_gigs).toBe(false);
          expect(body.musician.bio).toBeDefined();
          expect(body.musician.instruments).toBeDefined();
        });
    });

    test('404: responds with error when musician does not exist', () => {
      const updateMusician = { bio: 'Updated bio' };

      return request(app.getHttpServer())
        .patch('/api/musicians/999')
        .send(updateMusician)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toContain('Musician with ID 999 not found');
        });
    });

    test('400: responds with error for invalid experience_level', () => {
      const updateMusician = {
        experience_level: 'invalid_level',
      };

      return request(app.getHttpServer())
        .patch('/api/musicians/1')
        .send(updateMusician)
        .expect(400);
    });

    test('400: responds with error for invalid musician_id', () => {
      const updateMusician = { bio: 'Updated bio' };

      return request(app.getHttpServer())
        .patch('/api/musicians/not-a-number')
        .send(updateMusician)
        .expect(400);
    });
  });

  describe('PATCH /api/bands/:id', () => {
    test('200: responds with status 200', () => {
      const updateBand = {
        bio: 'Updated band bio',
        genre: 'alternative rock',
      };

      return request(app.getHttpServer())
        .patch('/api/bands/1')
        .send(updateBand)
        .expect(200);
    });

    test('200: responds with the updated band', () => {
      const updateBand = {
        band_name: 'The Updated Stars',
        bio: 'Completely new bio',
        location: 'Cardiff',
      };

      return request(app.getHttpServer())
        .patch('/api/bands/1')
        .send(updateBand)
        .expect(200)
        .then(({ body }) => {
          expect(body).toHaveProperty('band');
          expect(body.band).toMatchObject({
            band_id: 1,
            band_name: 'The Updated Stars',
            bio: 'Completely new bio',
            location: 'Cardiff',
          });
        });
    });

    test('200: only updates provided fields', () => {
      const updateBand = {
        genre: 'indie rock',
      };

      return request(app.getHttpServer())
        .patch('/api/bands/1')
        .send(updateBand)
        .expect(200)
        .then(({ body }) => {
          expect(body.band.genre).toBe('indie rock');
          expect(body.band.band_name).toBeDefined();
          expect(body.band.looking_for_instruments).toBeDefined();
        });
    });

    test('404: responds with error when band does not exist', () => {
      const updateBand = { bio: 'Updated bio' };

      return request(app.getHttpServer())
        .patch('/api/bands/999')
        .send(updateBand)
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toContain('Band with ID 999 not found');
        });
    });

    test('400: responds with error for invalid band_id', () => {
      const updateBand = { bio: 'Updated bio' };

      return request(app.getHttpServer())
        .patch('/api/bands/not-a-number')
        .send(updateBand)
        .expect(400);
    });
  });

  describe('DELETE /api/musicians/:id', () => {
    test('204: responds with status 204 and no content', () => {
      return request(app.getHttpServer())
        .delete('/api/musicians/1')
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    test('204: musician is deleted from database', () => {
      return request(app.getHttpServer())
        .delete('/api/musicians/1')
        .expect(204)
        .then(() => {
          return request(app.getHttpServer()).get('/api/musicians/1');
        })
        .then((response) => {
          expect(response.status).toBe(404);
        });
    });

    test('204: total musician count decreases after deletion', () => {
      let originalCount;

      return request(app.getHttpServer())
        .get('/api/musicians')
        .then(({ body }) => {
          originalCount = body.musicians.length;
          return request(app.getHttpServer()).delete('/api/musicians/1');
        })
        .then(() => {
          return request(app.getHttpServer()).get('/api/musicians');
        })
        .then(({ body }) => {
          expect(body.musicians.length).toBe(originalCount - 1);
        });
    });

    test('404: responds with error when musician does not exist', () => {
      return request(app.getHttpServer())
        .delete('/api/musicians/999')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toContain('Musician with ID 999 not found');
        });
    });

    test('400: responds with error for invalid musician_id', () => {
      return request(app.getHttpServer())
        .delete('/api/musicians/not-a-number')
        .expect(400);
    });
  });

  describe('DELETE /api/bands/:id', () => {
    test('204: responds with status 204 and no content', () => {
      return request(app.getHttpServer())
        .delete('/api/bands/1')
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  
    test('204: band is deleted from database', () => {
      return request(app.getHttpServer())
        .delete('/api/bands/1')
        .expect(204)
        .then(() => {
          return request(app.getHttpServer()).get('/api/bands/1');
        })
        .then((response) => {
          expect(response.status).toBe(404);
        });
    });
  
    test('204: total band count decreases after deletion', () => {
      let originalCount;
      
      return request(app.getHttpServer())
        .get('/api/bands')
        .then(({ body }) => {
          originalCount = body.bands.length;
          return request(app.getHttpServer()).delete('/api/bands/1');
        })
        .then(() => {
          return request(app.getHttpServer()).get('/api/bands');
        })
        .then(({ body }) => {
          expect(body.bands.length).toBe(originalCount - 1);
        });
    });
  
    test('404: responds with error when band does not exist', () => {
      return request(app.getHttpServer())
        .delete('/api/bands/999')
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toContain('Band with ID 999 not found');
        });
    });
  
    test('400: responds with error for invalid band_id', () => {
      return request(app.getHttpServer())
        .delete('/api/bands/not-a-number')
        .expect(400);
    });
  });

  describe('Error Handling', () => {
    test('500: handles upexpected server errors gracefully', () => {
      const invalidMusician = {
        user_id: null,
        experience_level: 'advanced',
        instruments: 'guitar',
        genres: 'rock'
      };

      return request(app.getHttpServer())
        .post('/api/musicians')
        .send(invalidMusician)
        .expect(400);
    });

    test('404: responds consistently for all non-existent routes', () => {
      return request(app.getHttpServer())
        .post('/api/musicians')
        .expect(400)
        .then(({ body }) => {
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('statusCode');
          expect(body.statusCode).toBe(404);
        });
    });

    test('400: validation errors have consistent format', () => {
      const invalidMusician = {
        bio: 'Only bio provided'
      };

      return request(app.getHttpServer())
      .post('/api/musicians')
      .send(invalidMusician)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('statusCode');
        expect(body.statusCode).toBe(400);
        expect(Array.isArray(body.message)).toBe(true);
      });
    });
  });
});
