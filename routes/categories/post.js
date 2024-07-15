const async_handler = require('express-async-handler');
const database = require('../../services/database');
const upload_file = require('../../services/upload_file');
const validations = require('../validations/validations');

module.exports = [
    upload_file.single('image'),
    validations.category.add,
    async_handler(request_handler),
];

async function request_handler(request, response, next) {
    await database.add.category(request.body.category_name, request.file?.filename ?? null);
    response.send('Category was uploaded successfully.');
}