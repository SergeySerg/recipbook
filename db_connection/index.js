pgp = require('pg-promise')();
dbConfig = require('../config/db');
var cn = {
    host: dbConfig.host,
    port: dbConfig.port,
    database: dbConfig.database,
    user: dbConfig.user,
    password: dbConfig.password
};
var db = pgp(cn);
module.exports = db;