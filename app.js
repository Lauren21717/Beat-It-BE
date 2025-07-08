const express = require('express');
const { getApi } = require('./controllers/api.controllers.js');
const { getMusicians, getMusicianById } = require('./controllers/musicians.controllers.js');

const app = express();
app.use(express.json());

app.get('/api', getApi);
app.get('/api/musicians', getMusicians);
app.get('/api/musicians/:musician_id', getMusicianById);

// Error handling middleware
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request' });
    } else if (err.code === '23503') {
        res.status(404).send({ msg: 'Not found' });
    } else if (err.code === '23502') {
        res.status(400).send({ msg: 'Bad request' });
    } else if (err.code === '23505') {
        res.status(400).send({ msg: 'Bad request' });
    } else {
        next(err);
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error' });
});

module.exports = app;