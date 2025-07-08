const { selectEndpoints } = require('../models/api.models.js');

exports.getApi = (req, res, next) => {
    selectEndpoints()
        .then((endpoints) => {
            res.status(200).send({ endpoints });
        })
        .catch(next);
};