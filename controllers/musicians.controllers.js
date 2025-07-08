const { selectMusicians } = require('../models/musicians.models.js');

exports.getMusicians = (req, res, next) => {
    selectMusicians()
        .then((musicians) => {
            res.status(200).send({ musicians });
        })
        .catch(next);
};