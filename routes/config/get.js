const validations = require('../validations/validations');

module.exports = [
    validations.shop,
    request_handler
];

function request_handler(request, response, next) {
    response.render('shop_configuration', {
        user: request.user,
        form_destination: '/config',
        form_method: 'post',
    });
}