var express = require('express');
var router = express.Router();
var user = require('../../data_access_layer/models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');
var Sequelize = require('sequelize');
var crypto = require('crypto-promise');
var nodemailer = require('nodemailer');

// Logout user
router.get('/', function(req, res){
    //req.logout(); res.redirect('/users/login');
    console.log("User successfully logout");
    res.json({
        sucess: true,
        message: "User successfully logout"
    });
//Recivery password




});

module.exports = router;
