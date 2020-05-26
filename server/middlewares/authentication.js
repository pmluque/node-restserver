const jwt = require('jsonwebtoken');

// ==========================================
// Middleware o Interceptor : Authetication
// ------------------------
// Verificar token
// ==========================================
let checkToken = (req, res, next) => {

    // Le doy el nombre del key de los headers inyectado
    let token = req.get('authorization');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

            if (err) {
                // 401 no autorizado
                return res.status(401).json({
                    ok: false,
                    data: { error: err },
                    message: `No se pudo verificar el token.`
                });
            }

            req.user = decoded.user;
            // El next debe de estar en el punto donde todo está verificado como OK.
            next();

        })
        /*
        res.json({
            token
        });
        */
};

// ==========================================
// Middleware o Interceptor : Authetication
// ------------------------
// Verificar token recodigo de URL
// ==========================================
let checkTokenUrl = (req, res, next) => {

    // Cojo el contenido enviado a partir de ?
    // {{url}}/api/utils/image/user/5ec2c88dec4e6d0160e610ef-112.png?token=123
    let token = req.query.token;

    //res.json({
    //    token
    //});


    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {

        if (err) {
            // 401 no autorizado
            return res.status(401).json({
                ok: false,
                data: { error: err },
                message: `No se pudo verificar el token.`
            });
        }

        req.user = decoded.user;
        // El next debe de estar en el punto donde todo está verificado como OK.
        next();

    })
};

// ==========================================
// Middleware o Interceptor : Authetication
// ------------------------
// Verificar ROLE
// ==========================================
let checkRoleAdmin = (req, res, next) => {

    // Le doy el nombre del key de los headers inyectado
    let user = req.user;

    if (user.role === 'ADMIN_ROLE') {
        next();
    } else {
        // ERROR
        return res.json({
            ok: false,
            data: { error: 'ERR-X' },
            message: 'Usuario requiere ser administrador'
        });

    }
};

module.exports = { checkToken, checkRoleAdmin, checkTokenUrl }