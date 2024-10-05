require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
  app.use(express.static('public'));
  app.use(express.json());

  app.post('/api/checkout', middleware.authenticateToken, async (req, res) => {
    // console.log(req.body);
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: req.body.map(item => {
          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.title
              },
              unit_amount: parseInt(item.price * 100),
            },
            quantity: item.quantity,
            tax_rates: ['txr_1NljgCEzmVUmdbD6jgXDrmN6']
          }
        }),
        mode: 'payment',
        success_url: `${process.env.LOCAL_CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.LOCAL_CLIENT_URL}/cart`
      })
      res.json({ url: session.url })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  });


  app.post('/api/sale', middleware.authenticateToken, async (req, res) => {
    try {
      // Email and Password
      let saleid = null;
      let cart = req.body.cart;
      let stripeSessionId = req.body.session_id;
      let email = req.body.email;
      let date = req.body.date;
      let tax = req.body.tax;
      let total = req.body.total;
      let grandTotal = req.body.grandTotal;

      // console.log(cart)
      // console.log(email, date, typeof date)
      // console.log(total, typeof total, tax, typeof tax, grandTotal, typeof grandTotal);

      const client = await pool.connect();


      let checkSessionQuery = {
        text: 'SELECT id, email, saledate, total, tax, grandtotal FROM new_sales WHERE stripesessionid = $1',
        values: [stripeSessionId]
      };

      const checkResult = await client.query(checkSessionQuery);

      if (checkResult.rows.length > 0) {

        cart = [];
        saleid = checkResult.rows[0].id;
        email = checkResult.rows[0].email;
        date = checkResult.rows[0].date;
        tax = checkResult.rows[0].tax;
        total = checkResult.rows[0].total;
        grandTotal = checkResult.rows[0].grandtotal;

        let getCartItemsQuery = {
          text: 'SELECT movieid, quantity, unitprice FROM new_sales_items WHERE saleid = $1',
          values: [saleid]
        }

        const itemsResult = await client.query(getCartItemsQuery);
        client.release();

        for ( let i=0; i < itemsResult.rows.length; ++i ) {

          let item = {};
          item.id = itemsResult.rows[i].movieid;
          item.quantity = itemsResult.rows[i].quantity;
          item.price = itemsResult.rows[i].unitprice;

          let movieQuery = {
            text: 'SELECT title, poster FROM movies WHERE id = $1',
            values: [itemsResult.rows[i].movieid]
          }

          const movieResult = await client.query(movieQuery);

          if (movieResult.rows.length) {
            item.title = movieResult.rows[0].title;
            item.poster = movieResult.rows[0].poster;
          }
          
          cart.push(item);
        }

        return res.status(200).json({ 
          saleId: saleid, cart: cart, 
          email: email, date: date,
          tax: tax, total: total,
          grandTotal: grandTotal
        });

      } else {

        let queryString = {
          text: 'INSERT INTO new_sales (stripesessionid, email, saledate, total, tax, grandtotal) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          values: [stripeSessionId, email, date, total, tax, grandTotal]
        }
  
        const result = await client.query(queryString)
  
        const saleId = result.rows[0].id;
  
        for (const item of cart) {
          const queryString = {
            text: 'INSERT INTO new_sales_items (saleid, movieid, quantity, unitprice, totalprice)' +
                    'VALUES ($1, $2, $3, $4, $5)',
            values: [saleId, item.id, item.quantity, item.price, item.quantity*item.price]
          };
  
          await client.query(queryString)
        }
        
        client.release();
        return res.status(200).json({ 
          saleId: saleid, cart: cart, 
          email: email, date: date,
          tax: tax, total: total,
          grandTotal: grandTotal
        });
      }

      } catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
  });


  app.get('/api/payment-verify', middleware.authenticateToken, async (req, res) => {
    const sessionId = req.query.session_id;

    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is missing.' });
    }

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)

      if (session.payment_status === "paid") {
        res.json({ success: true });
      } else {
        res.json({ success: false, message: 'Payment not completed or failed.' });
      }
    } catch (error) {
      console.error("Error retrieving Stripe session:", error);
      res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  })
}