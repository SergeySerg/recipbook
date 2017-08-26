pgp = require('pg-promise')();
dbConfig = require('../../config/db');
var Sequelize = require('sequelize');
const connection = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});
/*connection.sync()
    .then(() => {
        console.log('Sync successfully.');
    })
    .catch(err => {
        console.error('Sync faily:', err);
    });*/

connection
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = connection;