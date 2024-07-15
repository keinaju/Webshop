const async_handler = require('express-async-handler');
const database = require('../../../services/database');
const upload_file = require('../../../services/upload_file');
const validations = require('../../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.products.add_post,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    const product = get_product(request);
    await database.add.product(product);
    if (request.body.categories) {
        let categories;
        //req.body provides multiple categories as array, but one category as string
        //Array must be guaranteed when category is a single string:
        if (request.body.categories instanceof Array)
            categories = request.body.categories;
        else
            categories = [request.body.categories];
        await database.add.category_links(product.code, categories);
    }
    response.send('Product was uploaded successfully.');
}

function get_product(request) {
    return {
        code: request.body.product_code || Date.now(),
        price: request.body.price,
        name: request.body.product_name,
        description: request.body.description,
        manufacturer: request.body.manufacturer,
        country_of_origin: request.body.country_of_origin,
        released: request.body.release_date,
        lead_time_workdays: request.body.lead_time_workdays,
        notes: request.body.notes,
        image_file: request.file?.filename || null
    };
}