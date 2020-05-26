/*
  Propósito: Subir imágenes.
  Variaciones:
    - Subir imágenes asociadas a usuarios
    - Subir imágenes asociadas a productos

  1. Cargar módulos para subida de ficheros.
  2. Cargar las constantes
  3. Cargar los modelos : usuario y productos
  4. Implementar un post para subir imagen de prueba al raiz
    - Control de extensiones
  5. Implementar un put para subir y actualizar imágenes a subdirectorios asociados a los tipos
    - Control de tipos (variaciones)
    - Subir imagen al directorio.
    - Localizar objeto afectado usuario o producto
    - Asociar nueva imagen en la entidad.
      - Si hay algún problema, retirar la imagen subida.
      - Si no hay problema, retirar la imagen anterior del objeto del directorio.

*/
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// Cargamos diccionario de errores, avisos y mensajes informativos 
let constants = require('../../lib/constants');


// Cargamos este modelo para actualizar la imagen usando este servicio
const User = require('../../models/user');
const Product = require('../../models/product');

// Controlar contenidos guardados en el filesytem
const fs = require('fs');
// Para definir ubicaciones path
const path = require('path');
const { constant } = require('underscore');

// default options
// app.use(fileUpload());
app.use(fileUpload({ useTempFiles: true }));

/**
 * UPLOAD ficheros
 * POST - Podría ser un POST pero es para hacer modificaciones 
 * body : form-data -> file   type:file   xxxxx.jpg
 * More:
        https://firebase.google.com/docs/firestore/quickstart
        https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
        https://github.com/googleapis/nodejs-firestore/tree/master/samples

   Ojo!!! Content-type : application/x-www-form-urlencoded  => no , que va por form-data     
 */
app.post('/api/util/upload', function(req, res) {

    //const { body, files } = req;
    console.log('upload:', req.files);

    //if (!req.files || Object.keys(req.files).length === 0) {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            data: { error: 'ERR_NO_FILES_WERE_UPLOADED' },
            message: 'Faltan ficheros'
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //let sampleFile = req.files.sampleFile; => El control del interfaz se llama "sampleFile"
    let file = req.files.file;
    //let filename = req.files.FormFieldName;  // here is the field name of the form

    // control de extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    // Recoger extensión recibida y validarla con el array anterior
    let filenameSplit = file.name.split('.'); // split nombre y extension
    let extension = filenameSplit[filenameSplit.length - 1]; // ultimo termino
    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            data: { error: 'ERR_EXTENSION_NOT_VALID' },
            message: `El tipo de fichero no está permitido. Permitidas : ${validExtensions}`
        });
    }

    // Use the mv() method to place the file somewhere on your server
    let pathfile = `${process.env.UPLOAD_PATH}/${file.name}`;

    console.log(`Creado pathfile  ${pathfile}`);
    file.mv(pathfile, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: 'No se pudo subir el fichero'
            });
        }

        console.log(`Subido a  ${pathfile}`);
        return res.json({
            ok: true,
            data: { pathfile },
            message: 'Fichero subido correctamente'
        });

    });

});

/**
 * UPLOAD ficheros
 * PUT - Podría ser un POST pero es para hacer modificaciones 
 * body : form-data -> file   type:file   xxxxx.jpg
 * More:
        https://firebase.google.com/docs/firestore/quickstart
        https://medium.com/@stardusteric/nodejs-with-firebase-storage-c6ddcf131ceb
        https://github.com/googleapis/nodejs-firestore/tree/master/samples

   Ojo!!! Content-type : application/x-www-form-urlencoded  => no , que va por form-data     
 */
/**
 *  type : tipo de fichero : PRODUCT | USER
 *  id   : id de fichero para actualizar
 * 
 *  Para el producto habrá que pasarle el id del usuario: 5ec2c88dec4e6d0160e610ef
 */
app.put('/api/util/upload/:type/:id', function(req, res) {

    //const { body, files } = req;

    // Tal como están , se esperan obligatorios
    let type = req.params.type;
    let id = req.params.id;

    // Validar tipos 
    let validTypes = ['product', 'user'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            data: { error: 'ERR_TYPE_FILE_NOT_VALID' },
            message: `El tipo de fichero no está permitido. Permitidas : ${validTypes}`
        });
    }

    console.log('upload:', req.files);

    //if (!req.files || Object.keys(req.files).length === 0) {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            data: { error: 'ERR_NO_FILES_WERE_UPLOADED' },
            message: 'Faltan ficheros'
        });
    }
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    //let sampleFile = req.files.sampleFile; => El control del interfaz se llama "sampleFile"
    let file = req.files.file;
    //let filename = req.files.FormFieldName;  // here is the field name of the form

    // control de extensiones permitidas
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    // Recoger extensión recibida y validarla con el array anterior
    let filenameSplit = file.name.split('.'); // split nombre y extension
    let extension = filenameSplit[filenameSplit.length - 1]; // ultimo termino
    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            data: { error: 'ERR_EXTENSION_NOT_VALID' },
            message: `La extensión del fichero no está permitido. Permitidas : ${validExtensions}`
        });
    }

    // Use the mv() method to place the file somewhere on your server
    // let pathfile = `${process.env.UPLOAD_PATH}/${type}s/${file.name}`;
    // Para el control de cache del navegador hay que agregar siempre algo diferente en cada subida.
    let filename = `${id}-${new Date().getMilliseconds() }.${extension}`;
    let pathfile = `${process.env.UPLOAD_PATH}/${type}s/${filename}`;

    console.log(`Creado pathfile  ${pathfile}`);
    file.mv(pathfile, function(err) {
        if (err) {
            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: 'No se pudo subir el fichero'
            });
        }

        /*
        return res.json({
            ok: true,
            data: { pathfile },
            message: 'Fichero subido correctamente'
        });
        */

        if (type === 'product') {
            imgProduct(id, res, filename);
        } else {
            imgUser(id, res, filename);
        }

    });

});

// ======================================
//   Funciones internas
//   Los objetos pasan por referencia por lo que al actualizar retornaran con los cambios
// =====================================
function imgUser(id, res, filename) {
    type = 'user';
    console.log(`imgUser: id=${id}   res=${res}   filename=${filename}`);

    User.findById(id, (err, entityDB) => {

        if (err) {
            // borrar imagen que he subido porque no existe un usuario
            delFile(filename, type);

            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: constants.error.USER_FINDBYID.message
            });
        }

        if (!entityDB) {
            // Borrar la imagen si el id de usuario no existe , retiro la imagen subida
            delFile(filename, type);

            return res.status(500).json({
                ok: false,
                data: { error: constants.error.USER_ID_NOT_EXIST.code },
                message: constants.error.USER_ID_NOT_EXIST.message
            });
        }

        // Borro imagen anterior del usuario si existe en el directorio
        delFile(entityDB.img, type);

        // Establezco la nueva imagen    
        entityDB.img = filename;
        entityDB.save((err, entityDBfinal) => {

            if (err) {
                // borrar imagen ya que cuando entra aqui ya se cargo y subio

                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: constants.error.USER_SAVE.message
                });
            }

            return res.json({
                ok: true,
                data: {
                    id,
                    user: entityDBfinal,
                    img: filename
                },
                message: constants.info.USER_SAVE.message
            });
        });
    });
}

function imgProduct(id, res, filename) {

    let type = 'product';

    console.log(`imgProduct: id=${id}   res=${res}   filename=${filename}`);

    Product.findById(id, (err, entityDB) => {

        if (err) {
            // borrar imagen que he subido porque no existe un usuario
            delFile(filename, type);

            return res.status(500).json({
                ok: false,
                data: { error: err },
                message: constants.error.PRODUCT_FINDBYID.message
            });
        }

        if (!entityDB) {
            // Borrar la imagen si el id de usuario no existe , retiro la imagen subida
            delFile(filename, type);

            return res.status(500).json({
                ok: false,
                data: { error: constants.error.PRODUCT_ID_NOT_EXIST.code },
                message: constants.error.PRODUCT_ID_NOT_EXIST.message
            });
        }

        // Borro imagen anterior del usuario si existe en el directorio
        delFile(entityDB.img, type);

        // Establezco la nueva imagen    
        entityDB.img = filename;
        entityDB.save((err, entityDBfinal) => {

            if (err) {
                // borrar imagen ya que cuando entra aqui ya se cargo y subio

                return res.status(500).json({
                    ok: false,
                    data: { error: err },
                    message: constants.error.PRODUCT_SAVE.message
                });
            }

            return res.json({
                ok: true,
                data: {
                    id,
                    product: entityDBfinal,
                    img: filename
                },
                message: constants.info.PRODUCT_SAVE.message
            });
        });
    });
}

function delFile(filename, type) {

    // Estamos en controller y hay que llegar a uploads
    let pathImg = path.resolve(__dirname, `../../../uploads/${type}s/${filename}`);
    // Si existe la borro : fs.exists-> usa callbacks
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

// ======================================
//
//  HACER PÚBLICOS SERVICIOS
//
// ======================================
module.exports = app;