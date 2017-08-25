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

//Get Register
router.get('/', function(req, res){
    res.render('register');
});
//Post Register
router.post('/', function(req, res){
    var phone = req.body.telephone;
    var email = req.body.email;
    var name = req.body.name;
    var city = req.body.city;
    var login = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //Validation
    req.checkBody('telephone','Telephone is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('name','Name is required').notEmpty();
    req.checkBody('city','City is required').notEmpty();
    req.checkBody('username', 'Login is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if(errors){
        console.log('Ошибки валидации===>', errors.message);
        res.render('register', {
            errors:errors
        });
    }else{
        var data = {
            phone: phone,
            email: email,
            name: name,
            city: city,
            login: login,
            password: password
        };
        user.create(data)
            .then((user) => {
                console.log('Пользователь ' + user.id + ' успешно записан в БД');
                res.json({
                    success: true,
                    message: "Registration completed successfully"
                });
                /*res.redirect('/users/login');*/
            })
            .catch(Sequelize.ValidationError, function(error) {
                var error_messages = {
                    success: false,
                    message: error.errors
                };
                console.log('Ошибки валидации===>', error.message);
                return res.status(422).send(error_messages);
                /*res.json({
                 success: false,
                 message: error.message
                 });*/
            })
            .catch(error => {
                res.json({
                    success: false,
                    message: error.message
                });
                console.log("Error write User in DB", error);

            });
    }
});

module.exports = router;