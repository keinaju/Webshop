const express = require('express');
const router = express.Router();
const get_user_by_email = require('../services/get_user_by_email');
const pass = require('../services/pass');
const get_product_by_id = require('../services/get_product_by_id');
const multer = require('multer');
const add_order = require('../services/add_order');
const reset_shopping_cart_by_user = require('../services/reset_shopping_cart_by_user');
const multer_parser = multer();

router.get('/order', pass('customer', 'merchant', 'admin'), async (req, res, next) => {
    try {
        const user_data = await get_user_by_email(req.user.email);
        let shopping_cart = JSON.parse(user_data.shopping_cart);
        let total_price = 0;
        if (shopping_cart) {
            for (const product_in_cart of shopping_cart) {
                total_price += product_in_cart.price_per_pc * product_in_cart.quantity;
                const product_data = await get_product_by_id(product_in_cart.product_id);
                product_in_cart.name = product_data.name;
                product_in_cart.description = product_data.description;
                product_in_cart.image_file = product_data.image_file;
            }
        }
        res.render('order', {
            user: req.user,
            products: shopping_cart || null,
            products_as_json: user_data.shopping_cart || null,
            total_price: total_price,
        });
    }
    catch (error) {
        console.log('Error in GET /order process.', error.message);
        next(error);
    }
});

router.post('/order', pass('customer', 'merchant', 'admin'), multer_parser.none(), async (req, res) => {
    //req.body

    const ordered_products = JSON.parse(req.body.products_as_json);
    try {
        await Promise.all(
            //Loop each ordered product, and generate a promise with database upload
            ordered_products.map(element => {
                const { product_id, quantity, price_per_pc } = element;
                add_order(product_id, quantity, price_per_pc, req.body.instructions, req.user.id);
            })
        );
        await reset_shopping_cart_by_user(req.user.id);
        res.send('Order was uploaded successfully.');
    }
    catch (error) {
        console.log('Error in order upload.', error.message);
        next(error);
    }
});

module.exports = router;