const database = require('../../../services/database');
const upload_file = require('../../../services/upload_file');
const validations = require('../../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.products.modify_post,
    request_handler
];

async function request_handler(request, response, next) {
    try {
        let product = {
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
    catch (error) {
        console.error('Error in product addition.', error.message);
        next(error);
    }
}