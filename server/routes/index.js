const express = require('express');
const app = express();

app.use(require('../controllers/data/core/user'))
app.use(require('../controllers/auth/login'))
app.use(require('../controllers/data/test/category'))
app.use(require('../controllers/data/test/product'))
app.use(require('../controllers/util/uploads'))
app.use(require('../controllers/util/images'))

module.exports = app;