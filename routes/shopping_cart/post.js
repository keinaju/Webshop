const body_parser = require('body-parser');
const database = require('../../services/database');
const validations = require('../validations/validations');
const ShoppingCart = require('../../utilities/shopping_cart');

module.exports = [
    body_parser.json(),
    validations.shopping_cart,
    request_handler
];

async function request_handler(request, response, next) {
    if (!request.user)
        return response.json({
            message: 'Please sign in before shopping.'
        });

    try {
        const [product, user] = await Promise.all([
            database.get.product(request.body.product_id),
            database.get.user(request.user.email)
        ]);
        const contents = JSON.parse(user.shopping_cart);
        const cart = new ShoppingCart(contents || []);
        cart.add_products(request.body.product_id, request.body.quantity, product.price);
        await database.update.shopping_cart(request.user.email, cart.get_contents_json());
        return response.json({ message: 'Product added to cart.\nCart now has ' + cart.get_short_info() });
    }
    catch (error) {
        console.log('Error while adding to shopping cart.', error.message);
        next(error);
    }
}