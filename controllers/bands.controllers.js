const { selectBands, selectBandById } = require('../models/bands.models.js');

exports.getBands = (req, res, next) => {
    const { genre, location, looking_for_instrument, experience_level } = req.query;

    selectBands(genre, location, looking_for_instrument, experience_level)
        .then((bands) => {
            res.status(200).send({ bands });
        })
        .catch(next);
};

exports.getBandById = (req, res, next) => {
    const { band_id } = req.params;

    selectBandById(band_id)
        .then((band) => {
            res.status(200).send({ band });
        })
        .catch(next);
};