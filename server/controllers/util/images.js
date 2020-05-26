const express = require('express');
const app = express();

// Cargamos diccionario de constantes
let constants = require('../../lib/constants');

// Controlar contenidos guardados en el filesytem
const fs = require('fs');
// Crear path absolutos
const path = require('path');

// Proteger el acceso al servicio para evitar que visto la URL busquen otras imágenes
const { checkTokenUrl } = require('../../middlewares/authentication');

/**
 *  Consulta de un tipo de imagen e imagen concreta
 */
app.get('/api/utils/image/:type/:img', checkTokenUrl, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;

    // Estamos en controller y hay que llegar a uploads
    let pathImg = path.resolve(__dirname, `../../../uploads/${type}s/${img}`);
    console.log(`pathImg=${pathImg}`);
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        let noImagePath = path.resolve(__dirname, '../../assets/img/no-image.jpg')
        res.sendFile(noImagePath);
    }


})

// ======================================
//  HACER PÚBLICOS SERVICIOS
// ======================================
module.exports = app;