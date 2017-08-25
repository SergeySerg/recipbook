//var db = require('../config/db_config');
var pgp = require('pg-promise')();
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');
var Sequelize = require('sequelize');
var connection = require('../config/db_config');

var User = connection.define('users', {
    phone: {
        type: Sequelize.STRING,
        unique: true,
        validate:{
            isNumeric: true
        }
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isUnique: function (value, next) {
                var self = this;
                User.find({where: {email: value}})
                    .then(function (user) {
                        // reject if a different user wants to use the same email
                        if (user && self.id !== user.id) {
                            return next('Email already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            },
            notEmpty: true,
            len: [1, 255]
        }
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            isUnique: function (value, next) {
                var self = this;
                User.find({where: {name: value}})
                    .then(function (user) {
                        // reject if a different user wants to use the same email
                        if (user && self.id !== user.id) {
                            return next('Name already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    });
            },
        len: [1,70]
        }
    },
    city: {
        type: Sequelize.STRING
    },
    login: {
        type: Sequelize.STRING,
        validate: {
            /*isUnique: true,*/
            notEmpty: true
        }

    },
    password: {
        type: Sequelize.STRING,
        set: function (val) {
            var hash = bcrypt.hashSync(val, 10);
            this.setDataValue('password', hash);
        },
        validate: {
            isLongEnough: function (val) {
                if (val.length < 6) {
                    throw new Error("Please choose a longer password")
                }
            }
        }
    },
    resetpasswordtoken: {
        type: Sequelize.STRING
    },
    resetpasswordexpires: {
        type: Sequelize.DATE
    },
    active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
    }

});


// force: true will drop the table if it already exists
/*User.sync({force: true})
    .then(() => {
    // Table created
    return User.create({
        firstName: 'John',
        lastName: 'Hancock'
    });
});*/


/*User = {
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
};*/
module.exports = User;
