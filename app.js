const express = require('express');
const { getApi } = require('./controllers/api.controllers.js');

const app = express();
app.use(express.json());

app.get('/api', getApi);

module.exports = app;