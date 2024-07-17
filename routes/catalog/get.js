const async_handler = require('express-async-handler');
const database = require('../../services/database');

module.exports = async_handler(request_handler);

async function request_handler(request, response, next) {
    const page = Number(request.query.page) || 0;
    const chosen_categories = request.query.categories || null;
    const search_string = request.query.search;
    const regex = get_regex(search_string);
    const list_length = 16;
    const offset = list_length * page;
    const [product_list, product_count, categories_list] = await Promise.all([
        database.get.products(list_length, offset, chosen_categories, regex),
        database.get.products_count(chosen_categories, regex),
        database.get.categories(),
    ]);
    response.render('products_list', {
        product_list: product_list,
        categories_list: categories_list,
        chosen_categories: chosen_categories ? chosen_categories.split(',') : [],
        search_string: search_string,
        user: request.user,
        head_text: product_count == 0 ?
            '' : `${offset + 1}-${Math.min(offset + list_length, product_count)} of ${product_count}`,
        prev_page_href: page - 1 < 0 ?
            null : get_url(search_string, chosen_categories, page - 1),
        next_page_href: (offset + list_length) < product_count ?
            get_url(search_string, chosen_categories, page + 1) : null,
    });
};

//Convert user input to MySQL regular expression
function get_regex(search_string) {
    //Replace white space with |
    if (search_string) return search_string.replaceAll(/ +/g, '|');
    return '.*';
}

//Get url for catalog page with query arguments
function get_url(search_string, categories, page_num) {
    return '/catalog?' +
        `search=${search_string ?? ''}` +
        `&categories=${categories ?? ''}` +
        `&page=${page_num ?? ''}`;
}