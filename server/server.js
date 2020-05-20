const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

// Cargamos configuración
require('./config/config');

// MIDDLEWARE - lineas por las que pasa siempre

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// importar las rutas
app.use(require('./controllers/user'))

console.log(`Connecting to DB: ${process.env.URL_DB} ...`);
mongoose.connect(process.env.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Database MONGO on 27017 connected !');
    }
);


app.listen(process.env.PORT, () => {
    console.log(`RestServer listen on port ${process.env.PORT}`);
})