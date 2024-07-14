const database = require('../../services/database');

module.exports = async function request_handler(request, response, next) {
    const page = Number(request.query.page) || 0;
    const chosen_categories = request.query.categories || null;
    //Convert user input to MySQL regular expression
    let regex = '.*';
    if (request.query.search)
        regex = request.query.search.replaceAll(/ +/g, '|');
    try {
        const list_length = 20;
        const [product_list, product_count, categories_list] = await Promise.all([
            database.get.products(list_length, list_length * page, chosen_categories, regex),
            database.get.products_count(chosen_categories, regex),
            database.get.categories(),
        ]);
        const total_of_pages = Math.ceil(product_count / list_length);
        response.render('products_list', {
            product_list: product_list,
            product_count: product_count,
            categories_list: categories_list,
            page_number: page,
            total_of_pages: total_of_pages,
            showing_first: list_length * page + 1,
            showing_last: Math.min(list_length * (page + 1), product_count),
            chosen_categories: chosen_categories ? chosen_categories.split(',') : [],
            search_string: request.query.search,
            user: request.user,
        });
    }
    catch (error) {
        console.error('Error in product query.', error.message);
        next(error);
    }
};