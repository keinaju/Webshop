const database = require('../../../services/database');
const validations = require('../../validations/validations');

module.exports = [
    validations.products.add_page,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        response.render('product_form', {
            form_method: 'post',
            headline: 'Fill form to add new product to database:',
            form_destination: '/product/add',
            categories_list: await database.get.categories(),
            chosen_categories: [],
            product_code_locked: false,
            user: request.user,
            product: {}
        });
    }
    catch (error) {
        console.log('Error in GET /product/add', error.message);
        next(error);
    }
}