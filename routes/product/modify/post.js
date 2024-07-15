const async_handler = require('express-async-handler');
const database = require('../../../services/database');
const upload_file = require('../../../services/upload_file');
const validations = require('../../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.products.modify_post,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    let product = get_product(request);
    await database.update.product(product);
    if (request.file)
        await database.update.product_image(product.code, request.file.filename);
    if (request.body.categories) {
        let categories;
        //req.body provides multiple categories as array, but one category as string
        //Array must be guaranteed when category is a single string:
        if (request.body.categories instanceof Array)
            categories = request.body.categories;
        else
            categories = [request.body.categories];
        await database.delete.category_links(product.code);
        await database.add.category_links(product.code, categories);
    }
    response.send('Product was updated successfully.');
}

function get_product(request) {
    return {
        code: request.query.code,
        price: request.body.price,
        name: request.body.product_name,
        description: request.body.description,
        manufacturer: request.body.manufacturer,
        country_of_origin: request.body.country_of_origin,
        released: request.body.release_date,
        lead_time_workdays: request.body.lead_time_workdays,
        notes: request.body.notes
    };
}