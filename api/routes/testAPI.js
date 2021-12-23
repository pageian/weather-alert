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
            res.send(JSON.parse(body));
        }
    })
});

// gets all surf spots
router.get('/surfspots', function(req, res) {
    var response = []
    firebase.firestore().collection("Spots").get().then((snapshot) => {
        snapshot.docs.map((doc) => {
            response.push(doc.data())
        });
        res.send(response);
    });
});

// larf comment
// testing surfline endpoints
router.get('/testdata', function(req, res) {
    var requestOptions = {
        uri: 'https://services.surfline.com/kbyg/regions/forecasts/conditions?subregionId=58581a836630e24c44878fd4&days=6&accessToken=403e69522cbc2832dda6ef6513fc165440b12612',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer 403e69522cbc2832dda6ef6513fc165440b12612',
            'accept-language': 'en',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-fetch-dest': 'empty',
            'origin': 'https://www.surfline.com',
            'sec-ch-ua-platform': '"macOS"',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'accept': 'application/json',
            'credentials': 'same-origin',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'authority': 'services.surfline.com',
            // 'Cookie': 'connect.sid=s%3A6URcutTPKOMWgfj8hEaUT27bG5TV3B6L.PbimGct0HOOyjvTZUr7HbgG706XIvvskLnhFZNFZENQ'
        }
    }

    request(requestOptions, function(err0, res0, body0) {
        console.log('SURFDATA', err0, res0, body0);
        res.send(body0);
    });
}); 

// testing login
router.get('/testlogin', function(req, res) {
    var requestOptions = {
        uri: 'https://services.surfline.com/trusted/token?isShortLived=false',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic NWM1OWU3YzNmMGI2Y2IxYWQwMmJhZjY2OnNrX1FxWEpkbjZOeTVzTVJ1MjdBbWcz',
            'accept-language': 'en',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-fetch-dest': 'empty',
            'origin': 'https://www.surfline.com',
            'sec-ch-ua-platform': '"macOS"',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'accept': 'application/json',
            'credentials': 'same-origin',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'authority': 'services.surfline.com',
            // 'Cookie': 'connect.sid=s%3A6URcutTPKOMWgfj8hEaUT27bG5TV3B6L.PbimGct0HOOyjvTZUr7HbgG706XIvvskLnhFZNFZENQ'
        },
        body: JSON.stringify({
            "grant_type":"password",
            "username":"ian1239998@gmail.com",
            "password":"monkeys12399",
            "device_id":"Chrome-96.0.4664.110",
            "device_type":"Chrome 96.0.4664.110 on OS X 10.15.7 64-bit",
            "forced":true,
            "authorizationString":"Basic NWM1OWU3YzNmMGI2Y2IxYWQwMmJhZjY2OnNrX1FxWEpkbjZOeTVzTVJ1MjdBbWcz"
        })
    }

    request(requestOptions, function(err0, res0, body0) {
        console.log('LOGIN', err0, res0, body0);
        res.send(body0);
    });
}); 

// testing login
router.get('/securedata', function(req, res) {
    var loginRequest = {
        uri: 'https://services.surfline.com/trusted/token?isShortLived=false',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic NWM1OWU3YzNmMGI2Y2IxYWQwMmJhZjY2OnNrX1FxWEpkbjZOeTVzTVJ1MjdBbWcz',
            'accept-language': 'en',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'sec-fetch-dest': 'empty',
            'origin': 'https://www.surfline.com',
            'sec-ch-ua-platform': '"macOS"',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
            'accept': 'application/json',
            'credentials': 'same-origin',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
            'authority': 'services.surfline.com',
            // 'Cookie': 'connect.sid=s%3A6URcutTPKOMWgfj8hEaUT27bG5TV3B6L.PbimGct0HOOyjvTZUr7HbgG706XIvvskLnhFZNFZENQ'
        },
        body: JSON.stringify({
            "grant_type":"password",
            "username":"ian1239998@gmail.com",
            "password":"monkeys12399",
            "device_id":"Chrome-96.0.4664.110",
            "device_type":"Chrome 96.0.4664.110 on OS X 10.15.7 64-bit",
            "forced":true,
            "authorizationString":"Basic NWM1OWU3YzNmMGI2Y2IxYWQwMmJhZjY2OnNrX1FxWEpkbjZOeTVzTVJ1MjdBbWcz"
        })
    }

    request(loginRequest, function(err0, res0, body0) {
        console.log('LOGIN ATTEMPT');

        if(!err0 && res0.statusCode === 200) {
            var bearerString = `${JSON.parse(body0).token_type} ${JSON.parse(body0).access_token}`
            console.log('LOGGED IN', bearerString);

            var dataRequest = {
                uri: 'https://services.surfline.com/kbyg/regions/forecasts/conditions?subregionId=58581a836630e24c44878fd4&days=6&accessToken=403e69522cbc2832dda6ef6513fc165440b12612',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': bearerString,
                    'accept-language': 'en',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-site',
                    'sec-fetch-dest': 'empty',
                    'origin': 'https://www.surfline.com',
                    'sec-ch-ua-platform': '"macOS"',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                    'accept': 'application/json',
                    'credentials': 'same-origin',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
                    'authority': 'services.surfline.com',
                    // 'Cookie': 'connect.sid=s%3A6URcutTPKOMWgfj8hEaUT27bG5TV3B6L.PbimGct0HOOyjvTZUr7HbgG706XIvvskLnhFZNFZENQ'
                }
            }

            request(dataRequest, function(err1, res1, body1) {
                console.log('DATA ATTEMPT');

                if(!err1 && res1.statusCode === 200) {
                    console.log('SUCCESS');
                    res.send(body1);
                } else {
                    console.log('DATA ERROR');
                    res.send(err1);
                }
            });

        } else {
            console.log('LOGIN ERROR');
            res.send(err0);
        } 

        // res.send(body0);
    });
}); 


router.get('/surfdata', function(req, res) {
    var int_hour = 24;
    var data = {};

    var requestHeaders = {
        'Content-Type': 'application/json',
        'accept-language': 'en',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'sec-fetch-dest': 'empty',
        'origin': 'https://www.surfline.com',
        'sec-ch-ua-platform': '"macOS"',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
        'accept': 'application/json',
        'credentials': 'same-origin',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
        'authority': 'services.surfline.com',
    }

    var forecastRequest = {
        uri: 'https://services.surfline.com/kbyg/spots/forecasts/wave?spotId=' + req.query.spot_id + '&intervalHours=' + int_hour,
        method: 'GET',
        headers: requestHeaders
    }

    var tidesRequest = {
        uri: 'https://services.surfline.com/kbyg/spots/forecasts/tides?spotId=' + req.query.spot_id + '&intervalHours=' + int_hour,
        method: 'GET',
        headers: requestHeaders
    }

    var windRequest = {
        uri: 'https://services.surfline.com/kbyg/spots/forecasts/wind?spotId=' + req.query.spot_id + '&intervalHours=' + int_hour,
        method: 'GET',
        headers: requestHeaders
    }

    var weatherRequest = {
        uri: 'https://services.surfline.com/kbyg/spots/forecasts/weather?spotId=' + req.query.spot_id + '&intervalHours=' + int_hour,
        method: 'GET',
        headers: requestHeaders
    }

    // //test legacy
    // request('http://api.surfline.com/v1/forecasts/4991?resources=surf&days=1&getAllSpots=false&units=e&interpolate=true&showOptimal=false', function(err, res0, body) {
    //     console.log('LEGACY OUTPUT', err, res0.statusCode);
    // });

    // request('https://services.surfline.com/kbyg/regions/forecasts/conditions?subregionId=58581a836630e24c44878fd4&days=6', function(err, res, body) {
    //     console.log('NEW NEW', err, res.statusCode);
    // })

    // request('https://services.surfline.com/trusted/token?isShortLived=false', function(err, res, body) {
    //     console.log('LOGIN', err, res.statusCode);
    // });

    //surf forecast
    request(forecastRequest, function (err0, res0, body0) {
        console.log('GETTING FORECAST');
        if (!err0 && res0.statusCode === 200) {
            console.log('GOT FORECAST');
            // console.log(JSON.parse(body0));
            // console.log('GOT WAVE DATA');
            data.waves = JSON.parse(body0).data.wave;

            // tides query
            request(tidesRequest, function (err1, res1, body1) {
                console.log('GETTING TIDES');
                if (!err1 && res1.statusCode == 200) {
                    // console.log(JSON.parse(body1));
                    // console.log('GOT TIDE DATA');
                    console.log('GOT TIDES');
                    data.tides = JSON.parse(body1).data.tides;

                    // wind query
                    request(windRequest, function (err2, res2, body2) {
                        if (!err2 && res2.statusCode == 200) {
                            // console.log(JSON.parse(body2));
                            // console.log('GOT WIND DATA');
                            data.winds = JSON.parse(body2).data.wind;

                            // weather query
                            request(weatherRequest, function (err3, res3, body3) {
                                if (!err3 && res3.statusCode == 200) {
                                    // console.log(JSON.parse(body3));
                                    // console.log('GOT WEATHER DATA');
                                    data.weather = JSON.parse(body3).data;

                                    res.send(data);
                                }
                            });
                        }
                    });
                }
            });
        } else {
            console.log('ERROR RETRIEVING', err0, res0);
        }
    });

    

    //res.send(respose)
});

module.exports = router;