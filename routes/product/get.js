const database = require('../../services/database');
const validations = require('../validations/validations');

module.exports = [
    validations.product_query,
    request_handler
];

async function request_handler(request, response, next) {
    let modify;
    if (request.user) {
        switch (request.user.role) {
            case 'admin':
                modify = true;
                break;
            case 'merchant':
                modify = true;
                break;
            default:
                modify = false;
        }
    }
    try {
        response.render('product_page', {
            user: request.user,
            modify: modify,
            item: await database.get.product(request.query.code),
        });
    }
    catch (error) {
        console.log('Error in product view.', error.message);
        next(error);
    }
}