var db = require('../db_connection');
var pgp = require('pg-promise')();
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');



var User = {
    createUser: function(data){
        return new Promise((resolve, reject) => {
            bcrypt.hash(data.password, 10)
                .then(hash => {
                    var dbInsertPromise = db.one('INSERT INTO users(telephone,email,username,name,password,city) VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
                        [data.telephone,data.email,data.username,data.name,hash,data.city]
                    );
                    resolve(dbInsertPromise);
                    console.log('Hash------->',hash);
                })
                .catch(error => {
                    console.log("Error hash", error);
                })
        });
    },
    getUserByUsername: function(username){
            console.log(username);
            return db.oneOrNone('SELECT * FROM users WHERE username=${username}', {
                username: username
            });



    },
    getUserdById: function(id) {
        console.log(id);
        return db.oneOrNone('SELECT * FROM users WHERE id=${id}', {
            id: id
        });
    }
};
module.exports = User;