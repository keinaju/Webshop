const bcrypt = require('bcrypt');
const database = require('../../services/database');
const multer = require('multer');
const multer_parser = multer();
const validations = require('../validations/validations');

module.exports = [
    multer_parser.none(),
    validations.user,
    request_handler
];

async function request_handler(request, response, next) {
    const { email, password, first_name, last_name, role = 'customer' } = request.body;
    try {
        bcrypt.hash(password, 10, async (error, hashed_password) => {
            if (error)
                next(error);
            try {
                await database.add.user(email, hashed_password, first_name, last_name, role);
                response.send('User registered successfully.');
            }
            catch (error) {
                console.error('Error in user registration.', error.message);
                next(error);
            }
        });
    }
    catch (error) {
        console.error('Error in user registration.', error.message);
        next(error);
    }
}