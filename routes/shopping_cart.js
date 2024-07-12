const express = require('express');
const router = express.Router();
const database = require('../services/database');
const { body } = require('express-validator');
const handle_validation_result = require('../services/handle_validation_result');
const body_parser = require('body-parser');
const get_user_by_email = require('../services/get_user_by_email');
const set_shopping_cart_by_email = require('../services/set_shopping_cart_by_email');
const ShoppingCart = require('../types/shopping_cart');

const validation_chain = [
    body('product_id').notEmpty().withMessage('Product id missing.'),
    body('quantity').isInt().withMessage('Invalid quantity.'),
];

router.post('/shoppingcart/add',
    body_parser.json(),
    validation_chain,
    handle_validation_result,
    async (req, res, next) => {
        if (!req.user)
            return res.json({ message: 'Please sign in before shopping.' });

        try {
            const [product, user] = await Promise.all([
                database.get.product(req.body.product_id),
                get_user_by_email(req.user.email)
            ]);
            const contents = JSON.parse(user.shopping_cart);
            const cart = new ShoppingCart(contents || []);
            cart.add_products(req.body.product_id, req.body.quantity, product.price);
            await set_shopping_cart_by_email(req.user.email, cart.get_contents_json());
            return res.json({ message: 'Product added to cart.\nCart now has ' + cart.get_short_info() });
        }
        catch (error) {
            console.log('Error while adding to shopping cart.', error.message);
            next(error);
        }
    }
);

module.exports = router;