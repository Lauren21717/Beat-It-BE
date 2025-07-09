const db = require('../db/connection');

exports.selectBands = () => {
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
        ORDER BY band_profiles.created_at DESC;
    `).then(({ rows }) => {
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