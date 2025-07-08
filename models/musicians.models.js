const db = require('../db/connection');

exports.selectMusicians = () => {
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
        ORDER BY musician_profiles.created_at DESC;
    `).then(({ rows }) => {
        return rows;
    });
};