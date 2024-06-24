const express = require('express');
const router = express.Router();
const body_parser = require('body-parser');
const get_user_by_email = require('../services/get_user_by_email');
const set_shopping_cart_by_email = require('../services/set_shopping_cart_by_email');
const get_product_by_id = require('../services/get_product_by_id');
const ShoppingCart = require('../types/shopping_cart');

router.post('/shoppingcart/add', body_parser.json(), async (req, res, next) => {
    if (!req.user) return res.json({ message: 'Please sign in before shopping.' });
    if (!req.body.product_id || !req.body.quantity) throw new Error('Request doesn\'t have product data.');
    //fetch user's existing cart from database
    const { shopping_cart: cart_content } = await get_user_by_email(req.user.email);
    const cart = new ShoppingCart(JSON.parse(cart_content) || []);
    const { price } = await get_product_by_id(req.body.product_id);
    cart.add_products(req.body.product_id, req.body.quantity, price);
    await set_shopping_cart_by_email(req.user.email, cart.get_contents_json());
    return res.json({ message: 'Product added to cart.\nCart now has ' + cart.get_short_info() });
});

module.exports = router;