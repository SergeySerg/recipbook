var express = require('express');
var router = express.Router();
var user = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');


//Get Register
router.get('/register', function(req, res){
    res.render('register');
});

//Get Login
router.get('/login', function(req, res){
    res.render('login');
});

//Get Register
router.post('/register', function(req, res){
    var telephone = req.body.telephone;
    var email = req.body.email;
    var name = req.body.name;
    var city = req.body.city;
    var username = req.body.username;
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
        res.render('register', {
            errors:errors
        });
    }else{
        var data = {
            telephone: telephone,
            email: email,
            name: name,
            city: city,
            username: username,
            password: password
        };
        user.createUser(data)
            .then((data) => {
                console.log(data.id);
                console.log('Пользователь успешно записан в БД');
                req.flash('success_msg', "You are registered and can now login");
                res.redirect('/users/login');
            })
            .catch(error => {
                console.log("Error write User in DB", error);
                res.end('error');
            });

    }
});
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Пароль з формы", password)
        user.getUserByUsername(username)
        .then(data => {
            bcrypt.compare(password, data.password)
                .then((isMatch) => {
                    if(isMatch){
                        console.log('Correct password');
                        return done(null, data);
                    }else{
                        console.log('Invalid password');
                        return done(null, false, {message: 'Invalid password'});
                    }

                });
            console.log('ХЕШ====>', data.password);
            console.log('Пароль з форми====>', password);
            console.log('Доступен пользователь====>', data.username);
            console.log('Пароль====>', data.password);
            console.log('Пароль з форми====>', password);
        })
        .catch((data,error) => {
            if(!data.username){
                console.log("Error get User from DB", error);
                return done(null, false, {message: 'Unknow user'});
            }
         });
    }
));
passport.serializeUser(function(user, done) {
    console.log('ID пальзователя',user.id );
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    user.getUserdById(id)/*, function(err, user)*/
    .then((user,err) =>{
            if(err){
                console.log('Ошибка deserializeUser ', err);
            }
        done(err, user);
    })
    .catch(err => {
        console.log('Ошибка deserializeUser', err);
    });
});
//Get Login
router.post('/login',
    passport.authenticate('local', {successRedirect: '/',failureRedirct: '/users/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });
module.exports = router;
