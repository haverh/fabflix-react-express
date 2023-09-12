require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_KEY);

module.exports = function (app) {
    app.use(express.static('public'));
    app.use(express.json());

    app.post('/checkout', async (req, res) => {
        console.log(req.body);
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
                            unit_amount: parseFloat(item.price * 100),
                        },
                        quantity: item.quantity,
                        tax_rates: ['txr_1NljgCEzmVUmdbD6jgXDrmN6']
                    }
                }),
                success_url: 'http://localhost:3000/success',
                cancel_url: 'http://localhost:3000/cancel'
            })
            res.json({ url: session.url })
        } catch (e) {
            res.status(500).json({ error: e.message })
        }
    })
}