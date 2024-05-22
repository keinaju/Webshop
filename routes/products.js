const express = require('express');
const router = express.Router();
const products_query = require('../services/products_query');

router.get('/', respond);

async function respond(req, res, next) {
    try {
        const products = await products_query.getProducts();
        res.render('products', { "product_list": products } );
    }
    catch (err) {
        console.error('Error in product query.', err.message);
        next(err);
    }
}

module.exports = router;