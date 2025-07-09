const db = require('../db/connection');

exports.selectBands = (genre, location, looking_for_instrument, experience_level) => {
    let queryStr = `
        SELECT 
            band_profiles.band_id,
            band_profiles.band_name,
            users.username,
            band_profiles.bio,
            band_profiles.genre,
            band_profiles.location,
            band_profiles.looking_for_instruments,
            band_profiles.experience_level,
            band_profiles.created_at
        FROM band_profiles
        JOIN users ON band_profiles.user_id = users.user_id`;

    const queryValues = [];
    const conditions = [];

    if (genre) {
        conditions.push(`LOWER(band_profiles.genre) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${genre.toLowerCase()}%`);
    }

    if (location) {
        conditions.push(`LOWER(band_profiles.location) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${location.toLowerCase()}%`);
    }

    if (looking_for_instrument) {
        conditions.push(`LOWER(band_profiles.looking_for_instruments) LIKE $${conditions.length + 1}`);
        queryValues.push(`%${looking_for_instrument.toLowerCase()}%`);
    }

    if (experience_level) {
        conditions.push(`band_profiles.experience_level = $${conditions.length + 1}`);
        queryValues.push(experience_level);
    }

    if (conditions.length > 0) {
        queryStr += ` WHERE ${conditions.join(' AND ')}`;
    }

    queryStr += ` ORDER BY band_profiles.created_at DESC;`;

    return db.query(queryStr, queryValues).then(({ rows }) => {
        return rows;
    });
};

exports.selectBandById = (band_id) => {
    return db.query(`
        SELECT 
            band_profiles.band_id,
            band_profiles.band_name,
            users.username,
            band_profiles.bio,
            band_profiles.genre,
            band_profiles.location,
            band_profiles.looking_for_instruments,
            band_profiles.experience_level,
            band_profiles.created_at
        FROM band_profiles
        JOIN users ON band_profiles.user_id = users.user_id
        WHERE band_profiles.band_id = $1;
    `, [band_id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Band not found' });
            }
            return rows[0];
        });
};