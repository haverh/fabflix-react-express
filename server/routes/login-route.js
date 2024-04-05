const session = require('express-session');
const middleware = require('../middleware/jwt_middleware')

module.exports = function (pool, app) {

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

      resObj.user = userObj;
      
      const accessToken = middleware.generateAccessToken(resObj.user);
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      res.status(200).json({data: resObj, msg: 'Login successful'});
    } else {
      resObj.status = false;
      resObj.message = "Incorrect email or password. Please try again.";
      res.status(401).json({data: resObj, msg: 'Unauthorized - Invalid credentials'});
    }
    console.log(resObj)
    // res.json(resObj);

    } catch (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  })

  app.post('/api/admin/login', async (req, res) => {
    try {
      // Email and Password
      const email = req.body.email;
      const password = req.body.password;
      
      const client = await pool.connect();

      let queryString = {
        text: 'SELECT firstname, lastname, email FROM employees WHERE email=$1 AND password=$2',
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

        resObj.user = userObj;
        
        const accessToken = middleware.generateAccessToken(resObj.user);
        res.cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
        res.status(200).json({data: resObj, msg: 'Login successful'});
      } else {
        resObj.status = false;
        resObj.message = "Incorrect email or password. Please try again.";
        res.status(401).json({data: resObj, msg: 'Unauthorized - Invalid credentials'});
      }
      console.log(resObj)
      // res.json(resObj);

    } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
  })
}