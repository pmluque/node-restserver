const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// Cargamos configuración
require('./config/config');

// MIDDLEWARE - lineas por las que pasa siempre

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.get('/', function(req, res) {
    //res.send('Hello World')
    res.json('Hello World');
})

app.get('/user', function(req, res) {
    //res.send('Hello World')
    res.json('Get USERS');
})

/*
  Postman:   > body > x-www-form-urlencoded
*/
app.post('/user', function(req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: "Falta nombre de usuario"
        });

    } else {
        res.json({ "user": body });
    }

})

app.put('/user/:id', function(req, res) {
    //res.send('Hello World')
    let id = req.params.id;

    res.json({ "id": id });
})

app.delete('/user', function(req, res) {
    //res.send('Hello World')
    res.json('Delete USERS : deleting record');
})

app.listen(process.env.PORT, () => {
    console.log(`Listen on port ${process.env.PORT}`);
})