const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');

router.post('/shoppingcart/add', body_parser.json(), async (req, res, next) => {
    //check that user exists
    if (!req.user) return res.json({ message: 'Please sign in before shopping.' });
    else return res.json({ message: 'So you are a user trying to shop ' + req.body.product_id + '...' });
    //check request body for products
    //fetch user's existing cart from database, convert to object, create shopping cart
    //add new products to cart object
    //convert to json-string, and update database
});

module.exports = router;