const seed = require('./seed.js');
const db = require('../connection.js');
const devData = require('../data/development-data/index.js');

const runSeed = () => {
    return seed(devData).then(() => db.end());
};

runSeed();