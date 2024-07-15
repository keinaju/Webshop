const async_handler = require('express-async-handler');
const database = require('../../../services/database');
const validations = require('../../validations/validations');

module.exports = [
    validations.product_query,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    response.render('product_page', {
        user: request.user,
        modify: is_authorized(request.user),
        item: await database.get.product(request.query.code),
    });
}

function is_authorized(user) {
    if (user?.role == 'admin') return true;
    if (user?.role == 'merchant') return true;
    return false;
}