const database = require('../../services/database');
const upload_file = require('../../services/upload_file');
const validations = require('../validations/validations');

module.exports = [
    validations.shop,
    upload_file.single('logo'),
    request_handler
];

async function request_handler(request, response, next) {
    try {
        let filename = null;
        if (request.file)
            filename = request.file.filename;
        let config = {
            logo_file: filename,
            business_name: request.body.business_name,
            slogan: request.body.slogan,
            main_color: request.body.main_color,
        };
        await database.update.webshop(config);
        response.send('Shop was updated.');
    }
    catch (error) {
        console.log('Error while updating shop configuration.', error.message);
        next(error);
    }
}