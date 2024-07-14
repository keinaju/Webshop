const body_parser = require('body-parser');
const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    body_parser.json(),
    validations.orders.update,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        await database.update.order_status(request.body.order_id, request.body.new_status);
        return response.json({
            message: `Order ID ${request.body.order_id} was updated to ${request.body.new_status}.`
        });
    }
    catch (error) {
        console.log('Error in order status update.', error.message);
        next(error);
    }
}