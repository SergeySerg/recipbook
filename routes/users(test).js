var express = require('express');
var router = express.Router();
var user = require('../data_access_layer/models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var bcyrpt = require('bcrypt-nodejs-as-promised');
var Sequelize = require('sequelize');
var crypto = require('crypto-promise');
var nodemailer = require('nodemailer');


//Get Register
router.get('/register', function(req, res){
    res.render('register');
});
//Post Register
router.post('/register', function(req, res){
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

//Get Login
router.get('/login', function(req, res){
    res.render('login');
});



//Get Login
router.post('/login',
passport.authenticate('local', {successRedirect: '/',failureRedirct: '/users/login', failureFlash: true }),
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

//Recovery password
router.post('/forgot', function(req, res){
    user.findOne({where: {email: req.body.email}})
    .then(user => {
        if(!user){
            console.log('=========Incorrect email=========');
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/users/forgot');
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
                var smtpTransport = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    auth: {
                        user: 'webtestingstudio@gmail.com',
                        pass: 'PD&hP+CWQ(LL'
                    }
                });
                var mailOptions = {
                    to: user.email,
                    from: 'webtestingstudio@gmail.com',
                    subject: 'Password Reset',
                    text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/users/reset/' + user.resetpasswordtoken + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                };
                smtpTransport.sendMail(mailOptions, function(err) {
                    req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                });
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
        res.redirect('/users/forgot');
        console.log('=========/Ошибка токена============');
    });

});

//Recovery password
router.get('/forgot', function(req, res){
    res.render('forgot');
});

//Reset password
router.get('/reset/:token', function(req, res){
    user.findOne({where: {resetpasswordtoken: req.params.token, resetpasswordexpires: { $gt: Date.now() }}})
        .then(user => {
            if (!user) {
                req.flash('error', 'Password reset token is invalid or has expired.');
                return res.redirect('/users/forgot');
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
            var smtpTransport = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 465,
                auth: {
                    user: 'webtestingstudio@gmail.com',
                    pass: 'PD&hP+CWQ(LL'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'webtestingstudio@gmail.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(error) {
                if(error){
                    throw new Error;
                }
                req.flash('success', 'Success! Your password has been changed.');
            });
            res.send('Password change and send message to email');

        })
        .catch(Sequelize.ValidationError, function(error){
            console.log(error);
            res.redirect('/');
        })
});

// Logout user
router.get('/logout', function(req, res){
    //req.logout(); res.redirect('/users/login');
    console.log("User successfully logout");
    res.json({
        sucess: true,
        message: "User successfully logout"
    });
//Recivery password




});
module.exports = router;
