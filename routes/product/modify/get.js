const database = require('../../../services/database');
const get_short_date = require('../../../utilities/get_short_date');
const validations = require('../../validations/validations');

module.exports = [
    validations.products.modify_page,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        let [product, categories_list, chosen_categories] = await Promise.all([
            database.get.product(request.query.code),
            database.get.categories(),
            database.get.categories_by_product(request.query.code)
        ]);
        //Ensure correct format of categories for view engine
        chosen_categories = chosen_categories.map(element => element.category.toString());
        //Ensure correct date format for view engine
        if (product.released)
            product.released = get_short_date(product.released);

        response.render('product_form', {
            form_method: 'post',
            headline: 'Modify product data:',
            form_destination: '/products/modify?code=' + request.query.code,
            product: product,
            categories_list: categories_list,
            chosen_categories: chosen_categories,
            product_code_locked: true,
            user: request.user,
        });
    }
    catch (error) {
        console.log('Error in GET /products/modify', error.message);
        next(error);
    }
}