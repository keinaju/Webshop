const async_handler = require('express-async-handler');
const body_parser = require('body-parser');
const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    body_parser.json(),
    validations.orders.update,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    await database.update.order_status(request.body.order_id, request.body.new_status);
    return response.json({
        message: `Order ID ${request.body.order_id} was updated to ${request.body.new_status}.`
    });
}