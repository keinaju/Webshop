const express = require('express');
const router = express.Router();
const pass = require('../services/pass');

router.get('/shop_configuration', pass('merchant', 'admin'), (req, res, next) => {
    res.render('shop_configuration', {
        user: req.user,
        form_destination: '/shop_configuration',
        form_method: 'post',
    });
});

module.exports = router;