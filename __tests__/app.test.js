const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const endpointsJson = require('../endpoints.json');

require('jest-sorted');

// Seed test data BEFORE EACH test
beforeEach(() => {
  return seed(testData);
});

// Close database connection AFTER ALL tests
afterAll(() => {
  return db.end();
});

describe('GET /api', () => {
  test('200: responds with an object detailing the documentation for each endpoint', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe('GET /api/musicians', () => {
  test('200: responds with status 200', () => {
    return request(app)
      .get('/api/musicians')
      .expect(200);
  });

  test('200: responds with an object containing musicians array', () => {
    return request(app)
      .get('/api/musicians')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('musicians');
        expect(Array.isArray(body.musicians)).toBe(true);
      });
  });

  test('200: responds with correct number of musicians', () => {
    return request(app)
      .get('/api/musicians')
      .expect(200)
      .then(({ body }) => {
        expect(body.musicians).toHaveLength(2);
      });
  });

  test('200: musicians are sorted by created_at in descending order', () => {
    return request(app)
      .get('/api/musicians')
      .expect(200)
      .then(({ body }) => {
        expect(body.musicians).toBeSortedBy('created_at', { descending: true });
      });
  });

  test('200: each musician has the correct properties', () => {
    return request(app)
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
            created_at: expect.any(String)
          });
        });
      });
  });

  describe('filtering queries', () => {
    test('200: filters musicians by a single instrument', () => {
      return request(app)
        .get('/api/musicians?instrument=guitar')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians).toHaveLength(1);
          expect(body.musicians[0].instruments).toMatch(/guitar/i);
        });
    });

    test('200: filters musicians by genre', () => {
      return request(app)
        .get('/api/musicians?genre=rock')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians.length).toBeGreaterThan(0);
          body.musicians.forEach((musician) => {
            expect(musician.genres.toLowerCase()).toMatch(/rock/);
          });
        });
    });

    test('200: filters musicians by location', () => {
      return request(app)
        .get('/api/musicians?location=London')
        .expect(200)
        .then(({ body }) => {
            expect(body.musicians.length).toBeGreaterThan(0);
          body.musicians.forEach((musician) => {
            expect(musician.location).toMatch(/London/i);
          });
        });
    });

    test('200: filters musicians by experience level', () => {
      return request(app)
        .get('/api/musicians?experience_level=advanced')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians.length).toBeGreaterThan(0);
          body.musicians.forEach((musician) => {
            expect(musician.experience_level).toMatch('advanced');
          });
        });
    });

    test('200: supports multiple filters simultaneously (genre and experience)', () => {
      return request(app)
        .get('/api/musicians?genre=rock&experience_level=advanced')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians.length).toBeGreaterThan(0);
          body.musicians.forEach((musician) => {
            expect(musician.genres.toLowerCase()).toMatch(/rock/);
            expect(musician.experience_level).toMatch('advanced');
          });
        });
    });

    test('200: filtering is case-insensitive', () => {
      return request(app)
        .get('/api/musicians?instrument=GUITAR')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians).toHaveLength(1);
          expect(body.musicians[0].instruments.toLowerCase()).toMatch(/guitar/);
        });
    });

    test('200: returns an empty an empty arry when no musicians match the filter', () => {
      return request(app)
        .get('/api/musicians?instrument=violin')
        .expect(200)
        .then(({ body }) => {
          expect(body.musicians).toEqual([]);
        });
    });
  });
});

describe('GET /api/musicians/:musician_id', () => {
  test('200: responds with status 200', () => {
    return request(app)
      .get('/api/musicians/1')
      .expect(200);
  });

  test('200: responds with a single musician object', () => {
    return request(app)
      .get('/api/musicians/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('musician');
        expect(body.musician).toBeInstanceOf(Object);
      });
  });

  test('200: musician has correct properties and values', () => {
    return request(app)
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
          created_at: expect.any(String)
        });
      });
  });

  test('404: responds with error when musician does not exist', () => {
    return request(app)
      .get('/api/musicians/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Musician not found');
      });
  });

  test('400: responds with error when given invalid musician_id', () => {
    return request(app)
      .get('/api/musicians/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});

describe('GET /api/bands', () => {
  test('200: responds with status 200', () => {
    return request(app)
      .get('/api/bands')
      .expect(200);
  });

  test('200: responds with an object containing bands array', () => {
    return request(app)
      .get('/api/bands')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('bands');
        expect(Array.isArray(body.bands)).toBe(true);
      });
  });

  test('200: responds with correct number of bands', () => {
    return request(app)
      .get('/api/bands')
      .expect(200)
      .then(({ body }) => {
        expect(body.bands).toHaveLength(2);
      });
  });

  test('200: bands are sorted by created_at in descending order', () => {
    return request(app)
      .get('/api/bands')
      .expect(200)
      .then(({ body }) => {
        expect(body.bands).toBeSortedBy('created_at', { descending: true });
      });
  });

  test('200: each band has the correst properties', () => {
    return request(app)
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
            created_at: expect.any(String)
          });
        });
      });
  });
});

describe('GET /api/bands/:band_id', () => {
  test('200: responds with status 200', () => {
    return request(app)
      .get('/api/bands/1')
      .expect(200);
  });

  test('200: responds with a single band object', () => {
    return request(app)
      .get('/api/bands/1')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('band');
        expect(body.band).toBeInstanceOf(Object);
      });
  });

  test('200: band has correct properties and values', () => {
    return request(app)
      .get('/api/bands/1')
      .expect(200)
      .then(({ body }) => {
        expect(body.band).toMatchObject({
          band_id: 1,
          band_name: 'The Rock Stars',
          username: 'rockband2023',
          bio: expect.any(String),
          genre: 'rock',
          location: 'Manchester',
          looking_for_instruments: expect.any(String),
          experience_level: 'intermediate',
          created_at: expect.any(String)
        });
      });
  });

  test('404: responds with error when band does not exist', () => {
    return request(app)
      .get('/api/bands/999')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Band not found');
      });
  });

  test('400: responds with error when given invalid band_id', () => {
    return request(app)
      .get('/api/bands/not-a-number')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });
});