const express = require('express');
const router = express.Router();
const multer = require('multer');
const multer_parser = multer();

router.post('/shoppingcart/add', multer_parser.none(), async (req, res, next) => {
    //check that user exists
    if (!req.user) return res.send('Please sign in before shopping.');
    //check request body for products
    //fetch user's existing cart from database, convert to object, create shopping cart
    //add new products to cart object
    //convert to json-string, and update database
});

module.exports = router;