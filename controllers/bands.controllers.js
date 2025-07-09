const { selectBands } = require('../models/bands.models');

exports.getBands = (req, res, next) => {
    selectBands()
        .then((bands) => {
            res.status(200).send({ bands });
        })
        .catch(next);
};

