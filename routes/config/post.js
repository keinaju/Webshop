const async_handler = require('express-async-handler');
const database = require('../../services/database');
const upload_file = require('../../services/upload_file');
const validations = require('../validations/validations');

module.exports = [
    validations.shop,
    upload_file.single('logo'),
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    let config = {
        logo_file: request.file?.filename ?? null,
        business_name: request.body.business_name,
        slogan: request.body.slogan,
        main_color: request.body.main_color,
    };
    await database.update.webshop(config);
    response.send('Shop was updated.');
}