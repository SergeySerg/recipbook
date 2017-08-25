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

//Get Login
router.get('/', function(req, res){
    res.render('login');
});
//Get Login
router.post('/',
    passport.authenticate('local', {successRedirect: '/',failureRedirct: '/login', failureFlash: true }),
    function(req, res) {
        res.json({
            success: true,
            message: "Redirect to dashboard successfully"
        });
    });
//Password
passport.use(new LocalStrategy(
    function(username, password, done) {
        console.log("Пароль з формы", password)
        user.findOne({where: {login: username} })
            .then(user => {
                if (!user) {
                    console.log('Incorrect username.');
                    return done(null, false, { message: 'Incorrect username.' });
                }
                bcrypt.compare(password, user.password)
                    .then((isMatch) => {
                        if(isMatch){
                            console.log('Correct password');
                            return done(null, user);
                        }else{
                            console.log('Invalid password');
                            return done(null, false, {message: 'Invalid password'});
                        }
                    });

            })
            .catch((user,error) => {
                if(!user.login){
                    console.log("Error get User from DB", error);
                    return done(null, false, {message: 'Unknow user'});
                }
            });
    }
));
//Passport Serialize
passport.serializeUser(function(user, done) {
    console.log('ID пальзователя',user.id );
    done(null, user.id);
});

//Passport Deserialize
passport.deserializeUser(function(id, done) {
    user.findById(id)/*, function(err, user)*/
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
module.exports = router;