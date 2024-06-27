const express = require('express');
const get_product_by_id = require('../services/get_product_by_id');
const router = express.Router();

router.get('/product', async (req, res, next) => {
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
            item: await get_product_by_id(req.query.code),
        });
    }
    catch (error) {
        console.log('Error in product view.', error.message);
        next(error);
    }
});

module.exports = router;