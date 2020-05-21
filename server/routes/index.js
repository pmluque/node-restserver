const express = require('express');
const app = express();

app.use(require('../controllers/user'))
app.use(require('../controllers/login'))

module.exports = app;