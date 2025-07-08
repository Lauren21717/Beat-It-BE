const { selectMusicians, selectMusicianById } = require('../models/musicians.models.js');

exports.getMusicians = (req, res, next) => {
    selectMusicians()
        .then((musicians) => {
            res.status(200).send({ musicians });
        })
        .catch(next);
};

exports.getMusicianById = (req, res, next) => {
    const { musician_id } = req.params;
    
    selectMusicianById(musician_id)
        .then((musician) => {
            res.status(200).send({ musician });
        })
        .catch(next);
};