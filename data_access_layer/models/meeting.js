var pgp = require('pg-promise')();
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');
var Sequelize = require('sequelize');
var connection = require('../config/db_config');

var Meeting = connection.define('users', {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        notEmpty: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    date_create_meeting: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_actual_meeting: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_start_meeting: {
        type: Sequelize.STRING,
        allowNull: false
    },
    meeting_city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    meeting_address: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    short_description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: true
    },
    chat_id: {
        type: Sequelize.INTEGER,
        allowNull: true,

    }


});
module.exports = Meeting;
