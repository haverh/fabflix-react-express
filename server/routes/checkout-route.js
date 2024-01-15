require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const middleware = require('../middleware/jwt_middleware');

module.exports = function (pool, app) {
    app.use(express.static('public'));
    app.use(express.json());

    app.post('/checkout', middleware.authenticateToken, async (req, res) => {
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
                success_url: `${process.env.LOCAL_CLIENT_URL}/success`,
                cancel_url: `${process.env.LOCAL_CLIENT_URL}/cancel`
            })
            res.json({ url: session.url })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    });


    app.post('/sale', middleware.authenticateToken, async (req, res) => {
        try {
            // Email and Password
            const cart = req.body.cart;
            const email = req.body.email;
            const date = req.body.date;
            const tax = req.body.tax;
            const total = req.body.total;
            const grandTotal = req.body.grandTotal;

            // console.log(cart)
            // console.log(email, date, typeof date)
            // console.log(total, typeof total, tax, typeof tax, grandTotal, typeof grandTotal);

            const client = await pool.connect();

            let queryString = {
                text: 'INSERT INTO new_sales (email, saledate, total, tax, grandtotal) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                values: [email, date, total, tax, grandTotal]
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
            res.json(saleId);

            } catch (error) {
                console.error('Error executing query:', error);
                res.status(500).json({ error: 'An error occurred' });
            }
    });
}