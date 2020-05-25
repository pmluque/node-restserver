// 12.1 - CATEGORIAS
// ------------------------------
// 1. Crear aplicación express
// 2. Importar los middleware de seguridad
// 3. Importar los middleware de negocio
// 4. Importar la entidad de base de datos
// 5. Crear los metodos 
// 6. Exportar la aplicación
// 7. Regitrar las rutas en el routes/index.js
// ------------------------------
const express = require('express');

// Importar interceptores
let { checkToken, checkRoleAdmin } = require('../middlewares/authentication');

// Aplicación
let app = express();
let Category = require('../models/category');

// Rutas

// ============================================================================
// Listado : mostrar todas las categorías
// GET
// Usar populate para poblar las entidades
//   - El nombre de la coleccion deben coincidir exactamente
//   - Restringir campos con espacios
// Ordenaciòn
// ============================================================================

app.get('/api/data/test/category', checkToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, entitiesList) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: `Servidor no atendio la petición`
                });
            }

            return res.status(200).json({
                ok: true,
                data: { categories: entitiesList },
                message: 'Se retorno el listado'
            });
        });
});

// ======================================
// ConsultaById : localizar una categoría dado su id
// GET
// ======================================
app.get('/api/data/test/category/:id', checkToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, entityDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: `Servidor no atendio la petición`
            });
        }

        if (!entityDB) {
            return res.status(400).json({
                ok: false,
                data: { error: 'ERR_ID_UNKNOWN' },
                message: `Base de datos no atendio la petición`
            });
        }

        return res.status(200).json({
            ok: true,
            data: { category: entityDB },
            message: 'Se retorno el registro solicitado'
        });
    });

});

// ======================================
// Create : nueva categoria
// POST
// Headers
//  1.  authorization : {{token}}
// Body >> x-www-form-urlenconded
//  1.  description
// ======================================
app.post('/api/data/test/category', checkToken, (req, res) => {
    let body = req.body;
    let entity = new Category({
        description: body.description,
        user: req.user._id
    });
    entity.save((err, entityDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: `Servidor no atendio la petición`
            });
        }

        if (!entityDB) {
            return res.status(400).json({
                ok: false,
                data: { error: 'ERR_ID_UNKNOWN' },
                message: `Base de datos no atendio la petición`
            });
        }

        return res.status(200).json({
            ok: true,
            data: { category: entityDB },
            message: 'Se registro nueva categoría'
        });

    });

});

// ======================================
// Update :  categoria
// PUT
// Headers
//  1.  authorization : {{token}}
// Body >> x-www-form-urlenconded
//  1.  description
// ======================================
app.put('/api/data/test/category/:id', checkToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true },
        (err, entityDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: `Servidor no atendio la petición`
                });
            }

            if (!entityDB) {
                return res.status(400).json({
                    ok: false,
                    data: { error: 'ERR_ID_UNKNOWN' },
                    message: `Base de datos no atendio la petición`
                });
            }

            return res.status(200).json({
                ok: true,
                data: { category: entityDB },
                message: 'Se actualizo la categoría'
            });

        });

});

// ======================================
// Delete :  categoria
// DELETE
// Rules:
//  1. Solo ROLE_ADMIN puede borrar
//  2. Borrado físico
// ======================================
app.delete('/api/data/test/category/:id', [checkToken, checkRoleAdmin], (req, res) => {

    let id = req.params.id;

    Category.findByIdAndRemove(id,
        (err, entityDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: `Servidor no atendio la petición`
                });
            }

            if (!entityDB) {
                return res.status(400).json({
                    ok: false,
                    data: { error: 'ERR_ID_UNKNOWN' },
                    message: `Base de datos no atendio la petición`
                });
            }

            return res.status(200).json({
                ok: true,
                data: { category: entityDB },
                message: 'Se borró la categoría'
            });

        });
});


// ======================================
// METODOS INTERNOS
// ======================================



// ======================================
//
//  HACER PÚBLICOS SERVICIOS
//
// ======================================
module.exports = app;