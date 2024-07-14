const database = require('../../services/database');
const multer = require('multer');
const multer_parser = multer();
const validations = require('../validations/validations');

module.exports = [
    validations.checkout.post,
    multer_parser.none(),
    request_handler
];

async function request_handler(request, response, next) {
    const ordered_products = JSON.parse(request.body.products_as_json);
    try {
        await Promise.all(
            //Loop each ordered product, and generate a promise with database upload
            ordered_products.map(element => {
                const { product_id, quantity, price_per_pc } = element;
                database.add.order(
                    product_id,
                    quantity,
                    price_per_pc,
                    request.body.instructions,
                    request.user.id
                );
            })
        );
        await database.update.shopping_cart_to_empty(request.user.id);
        response.send('Order was uploaded successfully.');
    }
    catch (error) {
        console.log('Error in order upload.', error.message);
        next(error);
    }
}