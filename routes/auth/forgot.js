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
var email = require('../../config/email');
var mailer = require('../../libs/mailer');

//Recovery password
router.post('/', function(req, res){
    user.findOne({where: {email: req.body.email}})
        .then(user => {
            if(!user){
                console.log('=========Incorrect email=========');
                req.flash('error', 'No account with that email address exists.');
                return res.redirect('/forgot');
            }
            var rand = crypto.randomBytes(20)
                .then(rand => {
                    var token = rand.toString('hex');
                    console.log(token);
                    return token;
                })
                .then(token => {
                    user.resetpasswordtoken = token;
                    user.resetpasswordexpires = Date.now() + 3600000;
                    console.log(user.resetpasswordexpires = Date.now() + 3600000);
                    return user;
                })
                .then((user) => {
                    user.save(user)
                        .then((user, err) => {
                            mailer.sendMail(user, req.headers.host);
                            res.send('Token create and send message to email');
                            console.log('Добавлен токен====>', user.resetpasswordtoken);
                        })
                        .catch(err => {
                            console.log('Error mail=======', err);
                        })

                })
                .catch(err => {
                    console.log(err);
                });
        })
        .catch(err => {
            console.log('=========Ошибка токена============');
            console.log(err);
            res.redirect('/forgot');
            console.log('=========/Ошибка токена============');
        });

});

//Recovery password
router.get('/', function(req, res){
    res.render('forgot');
});

module.exports = router;