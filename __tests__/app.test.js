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
});