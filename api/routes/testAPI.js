var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
    res.send('API is working properly');

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'surf.forecast.alert',
            pass: 'SurfPassword'
        }
    });
      
    var mailOptions = {
        from: 'surf.forecast.alert@gmail.com',
        to: 'ian1239998@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
      
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
});

module.exports = router;