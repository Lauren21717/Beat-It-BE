const express = require('express');
const { getApi } = require('./controllers/api.controllers.js');
const { getMusicians } = require('./controllers/musicians.controllers.js');

const app = express();
app.use(express.json());

app.get('/api', getApi);
app.get('/api/musicians', getMusicians);

module.exports = app;