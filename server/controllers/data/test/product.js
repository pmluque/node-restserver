// 12.2 - PRODUCTOS
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

// Interceptores
// -- De seguridad
let { checkToken, checkRoleAdmin } = require('../../../middlewares/authentication');

// Aplicación
let app = express();
let Entity = require('../../../models/product');

// Rutas

// ============================================================================
// Listado : mostrar todas las categorías
// GET
// Ordenaciòn
// Popular para poblar las entidades
//   - El nombre de la coleccion deben coincidir exactamente
//   - Restringir campos con espacios
// Paginado
// ============================================================================

app.get('/api/data/test/product', checkToken, (req, res) => {

    // Pagination
    let from = Number(req.query.from || 0);
    // pasarlo a número
    // from = Number(from);

    Entity.find({ stock: true })
        .skip(from * 3)
        .sort('name')
        .limit(3)
        .populate('user', 'name email')
        .populate('category', 'description')
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
                data: { products: entitiesList },
                message: 'Se retorno el listado'
            });
        });
});

// ======================================
// ConsultaById : localizar una categoría dado su id
// GET
// ======================================
app.get('/api/data/test/product/:id', checkToken, (req, res) => {

    let id = req.params.id;

    Entity.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, entityDB) => {

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
                data: { product: entityDB },
                message: 'Se retorno el registro solicitado'
            });
        });
});

// ======================================
// ConsultaByCriteria : localizar una categoría dado un criteiro
// GET
// Headers
//  1.  authorization : {{token}}
// 
// ======================================
app.get('/api/data/test/product/searchByName/:query', checkToken, (req, res) => {

    let query = req.params.query;

    let regex = new RegExp(query, 'i');

    Entity.find({ name: regex })
        .populate('category', 'description')
        .exec((err, entitiesDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: `Servidor no atendio la petición`
                });
            }

            if (!entitiesDB || entitiesDB.length == 0) {
                return res.status(400).json({
                    ok: false,
                    data: { error: 'ERR_QUERY_WITHOUT_CONTENT' },
                    message: `Base de datos no atendio la petición`
                });
            }

            return res.status(200).json({
                ok: true,
                data: { products: entitiesDB },
                message: 'Se retorno los registros solicitados'
            });
        });
});

// ======================================
// Create : nuevo Producto
// POST
// Headers
//  1.  authorization : {{token}}
// Body >> x-www-form-urlenconded
//  1.  description
// ======================================
app.post('/api/data/test/product', checkToken, (req, res) => {
    let body = req.body;
    let entity = new Entity({
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        stock: body.stock,
        category: body.category,
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
            data: { product: entityDB },
            message: 'Se registro nueva categoría'
        });

    });

});

// ======================================
// Update :  Producto
// PUT
// Headers
//  1.  authorization : {{token}}
// Body >> x-www-form-urlenconded
//  1.  description
// Controles
//   - Que llegue el parámetro
// ======================================
app.put('/api/data/test/product/:id', checkToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let field2change = {
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        stock: body.stock,
        category: body.category
    };

    // Control de que existe
    // Entity.findById(id, (err, entityDB) => {  ... err... !entityDB ... crear objeto a actualizar ... save })
    Entity.findByIdAndUpdate(id, field2change, { new: true, runValidators: true },
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
                data: { product: entityDB },
                message: 'Se actualizo el registro'
            });

        });

});

// ======================================
// Delete :  PRODUCT
// DELETE
// Rules:
//  1. Solo ROLE_ADMIN puede borrar
//  2. Borrado físico
// ======================================
app.delete('/api/data/test/product/:id', [checkToken, checkRoleAdmin], (req, res) => {

    let id = req.params.id;

    /* Borrado lógico : stock=false */
    Entity.findById(id, (err, entityDB) => {

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

        entityDB.stock = false;
        entityDB.save((err, entityDBfinal) => {
            return res.status(200).json({
                ok: true,
                data: { product: entityDBfinal },
                message: 'Se sacó del stock el producto'
            });
        });

    });

    /* Borrado físico 
    Entity.findByIdAndRemove(id,
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
                data: { product: entityDB },
                message: 'Se borró la categoría'
            });

        });

    */
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