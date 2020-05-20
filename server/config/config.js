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

    urlDB = 'mongodb+srv://scmongo:9KYnjdlSoAVH0GrP@cluster0-jqetk.mongodb.net/test';

}

urlDB = 'mongodb+srv://scmongo:9KYnjdlSoAVH0GrP@cluster0-jqetk.mongodb.net/test';

process.env.URL_DB = urlDB;