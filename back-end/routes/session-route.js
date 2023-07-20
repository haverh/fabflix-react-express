const session = require('express-session');
const axios = require('axios');

module.exports = function (app) {
    
    const loginMiddleware = (req, res, next) => {
        console.log("SESSION ROUTE", req.session.user);
        if ( req.session.user ) {
            console.log("SIGNED IN - REDIRECTING");
            next();
        } else {
            res.redirect('http://localhost:3000/login');
            console.log("NOT SIGNED IN");

            // return axios.get('https://www.google.com')
            //             .then(res => {
            //                 res.send(res.data);
            //             })
            //             .catch(err => {
            //                 res.status(500).send('Redirection Error');
            //             });
        }
    };

    app.use(loginMiddleware);
};

