const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

app.post('/api/auth/o', (req, res) => {

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

// ---- OAUTH : Configuracion para GOOGLE

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.OAUTH_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

    // Ir al post /api/auth/g

}

app.post('/api/auth/g', async(req, res) => {

    let token = req.body.idtoken;

    // verify es una función asincrona, por lo que debo poner await 
    // y además por async en esta función que contiene el nuevo await.
    let userGoogle = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                data: { error: err },
                message: `Acceso no autorizado o no reconocido`
            });
        });
    console.log('userGoogle', userGoogle);

    User.findOne({ email: userGoogle.email }, (err, userDB) => {

        if (err) {
            // ERROR de servidor: 500
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: `No se pudo consultar al sistema`
            });
        }


        // Si existe el usuario , se comprueba si se ha conectado a través de google.
        // En caso contrario, hay que indicarle que se autentique con credenciales propias
        if (userDB) {
            if (!userDB.google) {
                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: `Debe conectarse con sus credenciales de aplicación.`
                });
            } else {
                // entonces, actualizo su token para que siga trabajando.
                // Generar el token porque tengo que devolverlo : contenido usuario, semilla y expiración (milisegundos) 30 dias.
                let token = jwt.sign({
                    user: userDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                // Todo OK, retornamos respuesta
                res.json({
                    ok: true,
                    data: { "user": userDB, token },
                    message: 'Login OK!'
                });
            }
        } else {
            // Si no existe, entonces hay que registrarlo en nuestra base de datos
            let user = new User();
            user.name = userGoogle.name;
            user.email = userGoogle.email;
            user.img = userGoogle.img;
            user.google = true;
            user.password = 'required-password-will-not-use-in-the-future';

            user.save((err, userDB) => {

                if (err) {
                    // ERROR de servidor: 500
                    return res.status(500).json({
                        ok: false,
                        data: { error: err },
                        message: `No se pudo registrar el usuario.`
                    });
                }

                let token = jwt.sign({
                    user: userDB
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                // Todo OK, retornamos respuesta
                res.json({
                    ok: true,
                    data: { "user": userDB, token },
                    message: 'Login OK!'
                });
            });
        }
    });
});


module.exports = app;