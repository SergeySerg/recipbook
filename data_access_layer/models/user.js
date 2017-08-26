var pgp = require('pg-promise')();
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');
var Sequelize = require('sequelize');
var connection = require('../config/db_config');

var User = connection.define('users', {
    login: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            /*isUnique: true,*/
            notEmpty: true
        }

    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
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
    password: {
        type: Sequelize.STRING,
        allowNull: false,
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
    city: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
            isNumeric: true
        }
    },
    gender: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: null
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
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
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    visibility: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: true
    },
    institution_page: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    },
    private: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    resetpasswordtoken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resetpasswordexpires: {
        type: Sequelize.DATE,
        allowNull: true
    }
});

module.exports = User;
