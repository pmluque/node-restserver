/*

http://10.10.3.153:3000/user

*/

const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const app = express();
const User = require('../models/user');
// Importar interceptores
const { checkToken, checkRoleAdmin } = require('../middlewares/authentication');


// El 2 parámetro es un middleware o interceptor
app.get('/api/core/user', checkToken, (req, res) => {

    console.log('Requester:', {
        user: req.user,
        name: req.user.name,
        email: req.user.email
    });

    //res.send('Hello World')
    //res.json('Get USERS local');
    // Ej. http://localhost:3000/user

    // Ej. http://localhost:3000/user?from=10
    let from = req.query.from || 0; // Si llega desde un inicio lo cojo y sino desde la página 1 (0)
    from = Number(from);

    // http://localhost:3000/user?from=0&limit=3
    let limit = req.query.limit || 5; // Si llega desde un inicio lo cojo y sino desde la página 1 (0)
    limit = Number(limit);

    //User.find({ google: true })
    User.find({ status: true }, 'name  email status')
        .skip(from)
        .limit(limit)
        .exec((err, lUsers) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    data: { error: err },
                    message: `No se pudo consultar los usuarios.`
                });
            }

            // v.4.2.1 - Deprecate
            // User.count({google: true}, (err, counter) => {
            /*    
            User.count({ status: true }, (err, counter) => {

                res.json({
                    ok: true,
                    data: { users: lUsers, total: counter },
                    message: 'Listado de usuarios'
                });

            });
            */

            // Nuevo método:
            // User.countDocuments( { ord_dt: { $gt: new Date('01/01/2012') } }, { limit: 100 } )            
            User.countDocuments({ status: true }, (err, counter) => {

                res.json({
                    ok: true,
                    data: { users: lUsers, total: counter },
                    message: 'Listado de usuarios'
                });

            });

        });
})

/*
  Postman:   > body > x-www-form-urlencoded
*/
app.post('/api/core/user', [checkToken, checkRoleAdmin], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        status: body.status
    });

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                data: { error: err },
                message: `Usuario no pudo crearse en la base de datos.`
            });
        }

        // solución 1
        // userDB.password = null;

        res.json({
            ok: true,
            data: { user: userDB },
            message: 'Usuario creado'
        })
    });

    /*
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: "Falta nombre de usuario"
        });

    } else {
        res.json({ "user": body });
    }
    */

})

//https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
app.put('/api/core/user/:id', [checkToken, checkRoleAdmin], (req, res) => {

    let id = req.params.id;
    // Especificar qué campos enviamos para ser actualizados: retiramos password, email (es único)
    let body = _.pick(req.body, ['name', 'img', 'role', 'status', 'google']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                data: { error: err },
                message: `Usuario no pudo actualizarse en la base de datos.`
            });
        }

        res.json({
            ok: true,
            data: { user: userDB },
            message: 'Usuario actualizado'
        })

    });



})

/**
 *  Borrado de registros
 * 
 * Estándares : https://moz-services-docs.readthedocs.io/en/latest/storage/apis-1.5.html#api-instructions
                DELETE https://<endpoint-url>/storage/<collection>/<id>
                DELETE https://<endpoint-url>/storage/<collection>?ids=<ids>

 */

app.delete('/api/core/user/:id', [checkToken, checkRoleAdmin], (req, res) => {

    let id = req.params.id;
    console.log('id: ' + id);

    // res.send('Hello World')
    // code: 'ERR_HTTP_HEADERS_SENT' : Si dejo la siguiente linea que hace
    // un envio de respuesta, la realizar las siguientes se produce el error
    // indicado
    // res.json(`USER: deleting record id=${id}`);

    // Eliminación de registro (borrado físico) 
    // -----------------------------------------
    /*
    User.findByIdAndRemove(id, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                message: `Usuario no pudo borrarse en la base de datos. ${err}`
            });
        }

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                message: `Usuario no existe o puede que ya fuera borrado.`
            });
        }

        res.status(200).json({
            ok: true,
            data: { user: userDB },
            message: 'Usuario borrado'
        });

    });
    */

    // Eliminación de registro (borrado lógico: cambios de status) 
    // -----------------------------------------------------------    
    let opts = {
        status: false
    }

    User.findByIdAndUpdate(id, opts, { new: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                data: { error: err },
                message: `Usuario no pudo actualizarse en la base de datos.`
            });
        }

        res.json({
            ok: true,
            data: { user: userDB },
            message: 'Usuario actualizado'
        })

    });


})

module.exports = app;