const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const app = express();

app.post('/api/core/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        // Validar que no hay un problema de servidor

        if (err) {
            // ERROR de servidor: 500
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: `No se pudo consultar los usuarios.`
            });
        }

        // Validar que existe el usuario

        if (!userDB) {
            // ERROR no encontrado
            return res.status(400).json({
                ok: false,
                data: { error: 'ERR-L-0001' },
                message: `Usuario o contraseña incorrectos`
            });
        }

        // Validar la contraseña
        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                data: { error: 'ERR-L-0002' },
                message: `Usuario o contraseña incorrectos`
            });
        }

        // Generar el token porque tengo que devolverlo : contenido usuario, semilla y expiración (milisegundos) 30 dias.
        let token = jwt.sign({
            user: userDB
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION })

        // Todo OK, retornamos respuesta
        res.json({
            ok: true,
            data: { "user": userDB, token },
            message: 'Login OK!'
        });

        // Apartir de ahora todos los servicios que se hagan deben de enviar el token. 
        // Para ello, en los HEADERS en la key "Authorization" copiaremos el token recibido en este servicio de login


    })



});

module.exports = app;