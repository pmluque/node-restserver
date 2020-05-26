// constants.js

'use strict';

let constant = {
    key1: "value1",
    key2: "value2",
    key3: {
        subkey1: "subvalue1",
        subkey2: "subvalue2"
    }
};

// =======================================
// ERRORES
// =======================================
let error = {
    USER_FINDBYID: {
        code: 'USER_FINDBYID',
        cause: 'Colección no existe o base de datos no accesible',
        solution: 'Revisar base de datos y colección USER',
        message: 'La búsqueda del ID no se pudo completar'
    },
    USER_ID_NOT_EXIST: {
        code: 'USER_ID_NOT_EXIST',
        cause: 'No existe el ID de usuario en la base de datos',
        solution: 'Registrar usuario de forma previa',
        message: 'El ID del usuario no existe'
    },
    USER_SAVE: {
        code: 'USER_SAVE',
        cause: 'Un error de base de datos al guardar',
        solution: 'Revisar el error específico devuelto por base de datos',
        message: 'Hubo un problema al guardar la información, reintentelo más tarde'
    },
    PRODUCT_FINDBYID: {
        code: 'PRODUCT_FINDBYID',
        cause: 'Colección no existe o base de datos no accesible',
        solution: 'Revisar base de datos y colección PRODUCT',
        message: 'La búsqueda del ID no se pudo completar'
    },
    PRODUCT_ID_NOT_EXIST: {
        code: 'PRODUCT_ID_NOT_EXIST',
        cause: 'No existe el ID de producto en la base de datos',
        solution: 'Registrar producto de forma previa',
        message: 'El ID del usuario no existe'
    },
    PRODUCT_SAVE: {
        code: 'PRODUCT_SAVE',
        cause: 'Un error de base de datos al guardar',
        solution: 'Revisar el error específico devuelto por base de datos',
        message: 'Hubo un problema al guardar la información, reintentelo más tarde'
    }
};


// =======================================
// INFO
// =======================================
let info = {
    USER_SAVE: {
        code: 'USER_SAVE',
        message: 'Usuario guardado correctamente'
    },
    PRODUCT_SAVE: {
        code: 'PRODUCT_SAVE',
        message: 'Producto guardado correctamente'
    }
}


module.exports = {
    error: Object.freeze(error),
    info: Object.freeze(info),
    constant: Object.freeze(constant)
}; // freeze prevents changes by users