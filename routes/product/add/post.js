const database = require('../../../services/database');
const upload_file = require('../../../services/upload_file');
const validations = require('../../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.products.add_post,
    request_handler
];

async function request_handler(request, response, next) {
    let product = {
        code: request.body.product_code || Date.now(),
        price: request.body.price,
        name: request.body.product_name,
        description: request.body.description,
        manufacturer: request.body.manufacturer,
        country_of_origin: request.body.country_of_origin,
        released: request.body.release_date,
        lead_time_workdays: request.body.lead_time_workdays,
        notes: request.body.notes
    };

    product.image_file = null;
    if (request.file)
        product.image_file = request.file.filename;

    try {
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
    catch (error) {
        console.error('Error in product addition.', error.message);
        next(error);
    }
}