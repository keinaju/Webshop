const async_handler = require('express-async-handler');
const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    validations.checkout.page,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    const customer = await database.get.user(request.user.email);
    let cart = JSON.parse(customer.shopping_cart);
    let total_price = 0;
    if (cart) {
        for (const item of cart) {
            total_price += item.price_per_pc * item.quantity;
            const product = await database.get.product(item.product_id);
            item.name = product.name;
            item.description = product.description;
            item.image_file = product.image_file;
        }
    }
    response.render('order', {
        user: request.user,
        products: cart || null,
        products_as_json: customer.shopping_cart || null,
        total_price: total_price,
    });
}