const db = require('../connection.js');
const format = require('pg-format');

const seed = ({ userData, musicianData, bandData }) => {
  return db
    .query(`DROP TABLE IF EXISTS band_profiles;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS musician_profiles;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users;`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE users (
          user_id SERIAL PRIMARY KEY,
          username VARCHAR NOT NULL UNIQUE,
          email VARCHAR NOT NULL UNIQUE,
          first_name VARCHAR,
          last_name VARCHAR,
          location VARCHAR,
          avatar_url VARCHAR,
          user_type VARCHAR CHECK (user_type IN ('musician', 'band', 'both')),
          created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE musician_profiles (
          musician_id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
          bio TEXT,
          experience_level VARCHAR CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
          instruments TEXT,
          genres TEXT,
          available_for_gigs BOOLEAN DEFAULT true,
          location VARCHAR,
          created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      return db.query(`
        CREATE TABLE band_profiles (
          band_id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
          band_name VARCHAR NOT NULL,
          bio TEXT,
          genre VARCHAR,
          location VARCHAR,
          looking_for_instruments TEXT,
          experience_level VARCHAR CHECK (experience_level IN ('beginner', 'intermediate', 'advanced', 'professional')),
          created_at TIMESTAMP DEFAULT NOW()
        );`);
    })
    .then(() => {
      const insertUsersQueryStr = `INSERT INTO users (username, email, first_name, last_name, location, avatar_url, user_type) VALUES %L;`;
      const userValues = userData.map(({ username, email, first_name, last_name, location, avatar_url, user_type }) => [
        username, email, first_name, last_name, location, avatar_url, user_type
      ]);
      
      const formattedQuery = format(insertUsersQueryStr, userValues);
      return db.query(formattedQuery);
    })
    .then(() => {
      if (musicianData && musicianData.length > 0) {
        const insertMusiciansQueryStr = `INSERT INTO musician_profiles (user_id, bio, experience_level, instruments, genres, available_for_gigs, location) VALUES %L;`;
        const musicianValues = musicianData.map(({ user_id, bio, experience_level, instruments, genres, available_for_gigs, location }) => [
          user_id, bio, experience_level, instruments, genres, available_for_gigs, location
        ]);
        
        const formattedQuery = format(insertMusiciansQueryStr, musicianValues);
        return db.query(formattedQuery);
      }
    })
    .then(() => {
      if (bandData && bandData.length > 0) {
        const insertBandsQueryStr = `INSERT INTO band_profiles (user_id, band_name, bio, genre, location, looking_for_instruments, experience_level) VALUES %L;`;
        const bandValues = bandData.map(({ user_id, band_name, bio, genre, location, looking_for_instruments, experience_level }) => [
          user_id, band_name, bio, genre, location, looking_for_instruments, experience_level
        ]);
        
        const formattedQuery = format(insertBandsQueryStr, bandValues);
        return db.query(formattedQuery);
      }
    });
};

module.exports = seed;