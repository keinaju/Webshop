const express = require('express');
const router = express.Router();
const database = require('../services/database');
const validations = require('./validations/validations');
const body_parser = require('body-parser');
const ShoppingCart = require('../types/shopping_cart');

router.post('/shoppingcart/add',
    body_parser.json(),
    validations.shopping_cart,
    async (req, res, next) => {
        if (!req.user)
            return res.json({ message: 'Please sign in before shopping.' });

        try {
            const [product, user] = await Promise.all([
                database.get.product(req.body.product_id),
                database.get.user(req.user.email)
            ]);
            const contents = JSON.parse(user.shopping_cart);
            const cart = new ShoppingCart(contents || []);
            cart.add_products(req.body.product_id, req.body.quantity, product.price);
            await database.update.shopping_cart(req.user.email, cart.get_contents_json());
            return res.json({ message: 'Product added to cart.\nCart now has ' + cart.get_short_info() });
        }
        catch (error) {
            console.log('Error while adding to shopping cart.', error.message);
            next(error);
        }
    }
);

module.exports = router;