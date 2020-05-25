// =======================================
// port
// =======================================
process.env.PORT = process.env.PORT || 3000;

//========================================
// environment : dev | pro
//========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========================================
// database
//========================================
let urlDB;
if (process.env.NODE_ENV === 'dev') {

    urlDB = 'mongodb://localhost:27017/test';

} else {

    // heroku config:set MONGO_URI="<URL MONGO-ATLAS>"
    urlDB = process.env.MONGO_URI;

}

process.env.URL_DB = urlDB;

//========================================
// JWT: Token expiration
//========================================
// 1000milisegundos(1s) x 60s(1m) x 60m(1h) x 24h(1dia) x 30d(dias)
process.env.TOKEN_EXPIRATION = 1000 * 60 * 60 * 24 * 30;

//========================================
// JWT: SEED for authentication
// Declarar en Heroku una variable de entorno
// heroku config
// heroku config:set TOKEN_SEED="*****"
//========================================
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'seed-developer-$%&';

//========================================
// CLIENT_ID: GOOGLE Sign-In
// Crear variable en heroku si es valor es variable
//========================================
process.env.OAUTH_CLIENT_ID = process.env.OAUTH_CLIENT_ID || '972780077903-b82lscqo5vhp95s7k81lqmrqqvuhc47d.apps.googleusercontent.com';