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