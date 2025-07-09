const { selectBands, selectBandById } = require('../models/bands.models');

exports.getBands = (req, res, next) => {
    selectBands()
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