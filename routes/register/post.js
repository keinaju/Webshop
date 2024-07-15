const async_handler = require('express-async-handler');
const bcrypt = require('bcrypt');
const database = require('../../services/database');
const multer = require('multer');
const multer_parser = multer();
const validations = require('../validations/validations');

module.exports = [
    multer_parser.none(),
    validations.user,
    async_handler(request_handler)
];

async function request_handler(request, response, next) {
    const { email, password, first_name, last_name, role = 'customer' } = request.body;
    bcrypt.hash(password, 10, async (error, hashed_password) => {
        if (error) return next(error);
        else await database.add.user(email, hashed_password, first_name, last_name, role);
    });
    response.send('User registered successfully.');
}