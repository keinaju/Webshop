const async_handler = require('express-async-handler');
const database = require('../../services/database');
const multer = require('multer');
const multer_parser = multer();
const validations = require('../validations/validations');

module.exports = [
    validations.checkout.post,
    multer_parser.none(),
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    const products = JSON.parse(request.body.products_as_json);
    //Loop each ordered product and generate a promise with database upload
    let uploads = products.map(product => {
        return database.add.order(
            product.product_id,
            product.quantity,
            product.price_per_pc,
            request.body.instructions,
            request.user.id
        );
    });
    await Promise.all(uploads);
    await database.update.shopping_cart_to_empty(request.user.id);
    response.send('Order was uploaded successfully.');
}