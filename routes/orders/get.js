const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    validations.orders.page,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        const page = request.query.page || 0;
        const status = request.query.status || 'new';
        const [orders, orders_count] = await Promise.all([
            database.get.orders_by_status(status, 20, page * 20),
            database.get.orders_count_by_status(status),
        ]);
        response.render('orders', {
            user: request.user,
            orders: orders,
            orders_count: orders_count,
            current_status: status,
            current_page: page,
        });
    }
    catch (error) {
        console.log('Error in getting orders.', error.message);
        next(error);
    }
}