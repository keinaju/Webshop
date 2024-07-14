const database = require('../../services/database');
const upload_file = require('../../services/upload_file');
const validations = require('../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.category.add,
    request_handler,
];

async function request_handler(request, response, next) {
    let { category_name } = request.body;
    let filename = null;
    if (request.file) filename = request.file.filename;
    try {
        await database.add.category(category_name, filename);
        response.send('Category was uploaded successfully.');
    }
    catch (error) {
        console.error('Error in category addition.', error.message);
        next(error);
    }
}