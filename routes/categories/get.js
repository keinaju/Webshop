const validations = require('../validations/validations');

module.exports = [
    validations.category.page,
    request_handler,
];

function request_handler(request, response, next) {
    response.render('add_category', { user: request.user });
}
