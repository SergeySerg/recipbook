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
var mailer = require('../../libs/mailer');

//Reset password
router.get('/reset/:token', function(req, res){
    user.findOne({where: {resetpasswordtoken: req.params.token, resetpasswordexpires: { $gt: Date.now() }}})
        .then(user => {
            console.log(user);
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/forgot');
            }
            res.render('reset');
            console.log('Find user ======>', user.email);
        })
        .catch(err => {
            console.log('Error reset token ======>', err);
        })
});

//Reset password
router.post('/reset/:token', function(req, res) {
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    var errors = req.validationErrors();
    if(errors) {
        res.render('reset', {
            errors: errors
        });
    }
    user.findOne({where: {resetpasswordtoken: req.params.token, resetpasswordexpires: { $gt: Date.now() }}})
        .then(user => {
            console.log(user);
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('back');
            }
            console.log('==============Пользователь до сохранения=========================');
            console.log(user);
            console.log('==============/Пользователь до сохранения========================');
            console.log('Пароль пользователя до сохранения ======>', user.password);

            user.password = req.body.password;
            console.log("Новий пароль======>",req.body.password);
            user.resetpasswordtoken = undefined;
            console.log("Хеш======>",user.resetpasswordtoken);
            user.resetpasswordexpires = undefined;
            console.log("Срок действия======>",user.resetpasswordexpires);
            return user.save();
        })
        .then((user) => {
            console.log('Пароль пользователя после сохранения ======>', user.password);
            console.log('==============Пользователь после сохранения=========================');
            console.log(user);
            console.log('==============/Пользователь после сохранения========================');
            //req.logIn(user);
            mailer.sendMail(user, req.headers.host);
            res.send('Password change and send message to email');

        })
        .catch(Sequelize.ValidationError, function(error){
            console.log(error);
            res.redirect('/');
        })
});

module.exports = router;