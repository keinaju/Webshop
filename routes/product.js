const express = require('express');
const router = express.Router();
const database = require('../services/database');
const validations = require('./validations/validations');

router.get('/product', validations.product_query, async (req, res, next) => {
    let modify;
    if (req.user) {
        switch (req.user.role) {
            case 'admin':
                modify = true;
                break;
            case 'merchant':
                modify = true;
                break;
            default:
                modify = false;
        }
    }
    try {
        res.render('product_page', {
            user: req.user,
            modify: modify,
            item: await database.get.product(req.query.code),
        });
    }
    catch (error) {
        console.log('Error in product view.', error.message);
        next(error);
    }
});

module.exports = router;