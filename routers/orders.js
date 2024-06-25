const express = require('express');
const router = express.Router();
const pass = require('../services/pass');

router.get('/orders', pass('merchant', 'admin'), (req, res, next) => {
    res.render('orders');
});

module.exports = router;