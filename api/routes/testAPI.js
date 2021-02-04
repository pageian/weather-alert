var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var firebase = require('firebase');
var request = require('request');

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
      
    // Commented out for now
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         console.log('Email sent: ' + info.response);
    //     }
    // });
});

// logs user in
router.post('/login', function(req, res) {
    if(req.body.email != "" && req.body.password != "") {
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
                msg: err.message
            });
        });
    } else { res.send({ uid: "", msg: "ERROR make sure to fill all fields" }); }
});

// creates new user account
router.post('/signup', function(req, res) {
    console.log(req.body.name, req.body.email, req.body.conf_email, req.body.password, req.body.conf_password);
    if(req.body.name != "" && req.body.email != "" && req.body.conf_email != "" && req.body.password != "" && req.body.conf_password != "") {
        if(req.body.email == req.body.conf_email) {
            if(req.body.password == req.body.conf_password) {

                // create user auth account w/ firebase
                firebase.auth().createUserWithEmailAndPassword(req.body.email, req.body.password).then((user_auth) => {

                    // base user account
                    var new_user = {
                        name: req.body.name,
                        metric: true,
                        notifs: false,
                        min_height: 0,
                        max_height: 0,
                        min_period: 0,
                        max_period: 0
                    }

                    // create firestore user record
                    firebase.firestore().collection('Users').doc(user_auth.user.uid).set(new_user).then((user) => {
                        console.log(user_auth.user.uid);
                        res.send({
                            uid: user_auth.user.uid,
                            msg: ""
                        });

                    }).catch((err) => {
                        console.log(err);
                        res.send({
                            uid: "",
                            msg: err.message
                        });
                    });
                }).catch((err) => {
                    console.log(err);
                    res.send({
                        uid: "",
                        msg: err.message
                    });
                });
            } else { res.send({ uid: "", msg: "ERROR make sure password match" }); }
        } else { res.send({ uid: "", msg: "ERROR make sure emails match" }); }
    } else { res.send({ uid: "", msg: "ERROR make sure to fill all fields" }); }
});

// retrieves settings for user
router.get('/settings', function(req, res) {
    console.log("TEST", req.query.uid)
    firebase.firestore().collection('Users').doc(req.query.uid).get().then((user) => {
        console.log(user.data());
        res.send(user.data());
    }).catch((err) => {
        console.log(err);
        res.send({
            uid: "",
            msg: err.message
        });
    });
});

// updates settings
router.put('/settings', function(req, res) {
    console.log("TEST", req.body)

    var user_settings = {
        name: req.body.name,
        metric: req.body.metric,
        notifs: req.body.notifs,
        min_height: req.body.min_height,
        max_height: req.body.max_height,
        min_period: req.body.min_period,
        max_period: req.body.max_period
    }

    firebase.firestore().collection('Users').doc(req.body.uid).update(user_settings).then(() => {
        console.log();
        res.send({
            msg: ""
        });
    }).catch((err) => {
        console.log(err);
        res.send({
            msg: err.message
        });
    });
});

// get weather data for halifax
router.get('/weather', function(req, res) {
    request('http://api.openweathermap.org/data/2.5/onecall?lat=44.648618&lon=-63.5859487&exclude=minutely,hourly&units=metric&appid=a28eff83ec6108abef556025bece0213', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body)
            res.send(JSON.parse(body));
        }
    })
});

router.get('/allspots', function(req, res) {

});

module.exports = router;