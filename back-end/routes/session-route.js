const session = require('express-session');
const axios = require('axios');

module.exports = function (app) {
    
    const loginMiddleware = (req, res, next) => {
        console.log("IN MIDDLEWARE");
        console.log(req.session);
        if ( !req.session.user ) {

            console.log("IN IF");
            // console.log(res);
            // return res.redirect('http://localhost:3000/login');

            return axios.get('https://www.google.com')
                        .then(res => {
                            res.send(res.data);
                        })
                        .catch(err => {
                            res.status(500).send('Redirection Error');
                        });
        }
        next();
    };

    app.use(loginMiddleware);
};

