const session = require('express-session');

module.exports = function (pool, app) {

    app.get('/api/login', async (req, res) => {
        res.oidc.login({
            
        })
        // if ( req.session.user ) {
        //     res.json({signedIn: true, user: req.session.user});
        // } else {
        //     res.json({signedIn: false});
        // }
    })

    app.post('/api/login', async (req, res) => {
        try {
            // Email and Password
            const email = req.body.email;
            const password = req.body.password;
            
            const client = await pool.connect();

            let queryString = {
                text: 'SELECT firstname, lastname, ccid, address, email FROM customers WHERE email=$1 AND password=$2',
                values: [email, password]
            }

            const result = await client.query(queryString)
            
            client.release();

            let resObj = {};

            if ( result.rows.length ) {
                resObj.status = true;

                let userObj = {};
                userObj.firstname = result.rows[0].firstname
                userObj.lastname = result.rows[0].lastname
                userObj.ccid = result.rows[0].ccid
                userObj.address = result.rows[0].address
                userObj.email = result.rows[0].email

                req.session.user = userObj;
                resObj.user = userObj;
                console.log(req.session.user)
            } else {
                resObj.status = false;
                resObj.message = "The email or password you entered is incorrect.";
            }
            console.log(resObj)
            res.json(resObj);

            } catch (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'An error occurred' });
            }
    })
}