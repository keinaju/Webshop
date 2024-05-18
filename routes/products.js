const express = require('express');
const router = express.Router();
const products = require('../services/products');

router.get('/', respond);

async function respond(req, res, next) {
    try {
        res.json(await products.getProducts());
    }
    catch (err) {
        console.error('Error in product query.', err.message);
        next(err);
    }
}

module.exports = router;