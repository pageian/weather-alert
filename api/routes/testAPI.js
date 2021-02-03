var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var firebase = require('firebase');

firebaseConfig = {
    apiKey: "AIzaSyBO0CU3zMrooSatIMswabol6ZFWi2X5ev8",
    authDomain: "surf-alert-b0142.firebaseapp.com",
    projectId: "surf-alert-b0142",
    storageBucket: "surf-alert-b0142.appspot.com",
    messagingSenderId: "842072331646",
    appId: "1:842072331646:web:7bf6068e6717f16056cf2f",
    measurementId: "G-M9TKCX42Z4"
  }

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

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

router.post('/login', function(req, res) {
    if(req.email != "" || req.password != "") {
        console.log(req.body.email, req.body.password)
        firebase.auth().signInWithEmailAndPassword(req.body.email, req.body.password).then((user_auth) => {
          console.log(user_auth.user.uid);
          res.send({
                uid: user_auth.user.uid,
                msg: ""
            });
        }).catch((err) => {
            console.log(err);
            res.send({
                uid: "",
                msg: err
            });
        });
      }
});

module.exports = router;