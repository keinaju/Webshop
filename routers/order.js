const express = require('express');
const router = express.Router();
const get_user_by_email = require('../services/get_user_by_email');
const pass = require('../services/pass');
const get_product_by_id = require('../services/get_product_by_id');

router.get('/order', pass('customer', 'merchant', 'admin'), async (req, res) => {
    const user_data = await get_user_by_email(req.user.email);
    let shopping_cart = JSON.parse(user_data.shopping_cart);
    let total_price = 0;
    for (const product_in_cart of shopping_cart) {
        total_price += product_in_cart.price_per_pc * product_in_cart.quantity;
        const product_data = await get_product_by_id(product_in_cart.product_id);
        product_in_cart.name = product_data.name;
        product_in_cart.description = product_data.description;
        product_in_cart.image_file = product_data.image_file;
    }
    res.render('order', {
        user: req.user,
        products: shopping_cart,
        total_price: total_price,
    });
});

module.exports = router;