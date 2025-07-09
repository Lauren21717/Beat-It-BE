const db = require('../db/connection');

exports.selectMusicians = (instrument, genre, location, experience_level) => {
    let queryStr = `
        SELECT 
            musician_profiles.musician_id,
            users.username,
            musician_profiles.bio,
            musician_profiles.experience_level,
            musician_profiles.instruments,
            musician_profiles.genres,
            musician_profiles.available_for_gigs,
            musician_profiles.location,
            musician_profiles.created_at
        FROM musician_profiles
        JOIN users ON musician_profiles.user_id = users.user_id`;

    const queryValues = [];
    const conditions = [];

    if (instrument) {
        conditions.push(`LOWER(musician_profiles.instruments) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${instrument.toLowerCase()}%`);
    }

    if (genre) {
        conditions.push(`LOWER(musician_profiles.genres) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${genre.toLowerCase()}%`);
    }

    if (location) {
        conditions.push(`LOWER(musician_profiles.location) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${location.toLowerCase()}%`);
    }

    if (experience_level) {
        conditions.push(`musician_profiles.experience_level = $${conditions.length + 1}`);
        queryValues.push(experience_level);
    }

    if (conditions.length > 0) {
        queryStr += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryStr += ` ORDER BY musician_profiles.created_at DESC;`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectMusicianById = (musician_id) => {
    return db.query(`
        SELECT 
            musician_profiles.musician_id,
            users.username,
            musician_profiles.bio,
            musician_profiles.experience_level,
            musician_profiles.instruments,
            musician_profiles.genres,
            musician_profiles.available_for_gigs,
            musician_profiles.location,
            musician_profiles.created_at
        FROM musician_profiles
        JOIN users ON musician_profiles.user_id = users.user_id
        WHERE musician_profiles.musician_id = $1;
    `, [musician_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Musician not found' });
            }
            return rows[0];
        });
};