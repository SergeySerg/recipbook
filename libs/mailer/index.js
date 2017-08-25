var nodemailer = require('nodemailer');
var email = require('../../config/email');
var Mailer = {
    sendMail: function sendMail(data, host){
        var smtpTransport = nodemailer.createTransport({
            host: email.host,
            port: email.port,
            auth: {
                user: email.user,
                pass: email.pass
            }
        });
        var mailOptions = {
            to: data.email,
            from: email.user,
            subject: 'Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + host + '/reset/' + data.resetpasswordtoken + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('info', 'An e-mail has been sent to ' + data.email + ' with further instructions.');
        });

    }
}

module.exports = Mailer;


