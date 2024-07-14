const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    validations.checkout.page,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        const user_data = await database.get.user(request.user.email);
        let shopping_cart = JSON.parse(user_data.shopping_cart);
        let total_price = 0;
        if (shopping_cart) {
            for (const product_in_cart of shopping_cart) {
                total_price += product_in_cart.price_per_pc * product_in_cart.quantity;
                const product_data = await database.get.product(product_in_cart.product_id);
                product_in_cart.name = product_data.name;
                product_in_cart.description = product_data.description;
                product_in_cart.image_file = product_data.image_file;
            }
        }
        response.render('order', {
            user: request.user,
            products: shopping_cart || null,
            products_as_json: user_data.shopping_cart || null,
            total_price: total_price,
        });
    }
    catch (error) {
        console.log('Error in GET /checkout.', error.message);
        next(error);
    }
}