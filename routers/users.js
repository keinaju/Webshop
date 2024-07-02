const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const handle_validation_result = require('../services/handle_validation_result');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multer_parser = multer();
const add_user = require('../services/add_user');
const get_user_by_email = require('../services/get_user_by_email');

router.get('/users/add', (req, res) => {
    res.render('add_user', { user: req.user });
});

const validation_chain = [
    body('email')
        .trim()
        .isLength({ max: 100 })
        .withMessage('Max length is 100 characters.')
        .isEmail()
        .normalizeEmail({ all_lowercase: true })
        //Custom validator to check if user with this email already exists
        .custom(async email => {
            const user = await get_user_by_email(email);
            if (user)
                throw new Error('Email is in use.');
            else
                return true;
        }),
    body('password')
        .isLength({ min: 8, max: 100 })
        .withMessage('Max length is 100 characters.'),
    body('confirm_password')
        .custom((confirm_password, { req }) => {
            if (confirm_password != req.body.password)
                throw new Error('Mismatch in password fields.');
            else
                return true;
        }),
    body('first_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Max length is 100 characters.'),
    body('last_name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Max length is 100 characters.'),
];

router.post('/users/add',
    multer_parser.none(),
    validation_chain,
    handle_validation_result,
    async function (req, res, next) {
        const { email, password, first_name, last_name, role = 'customer' } = req.body;
        try {
            bcrypt.hash(password, 10, async (error, hashed_password) => {
                if (error)
                    next(error);
                try {
                    await add_user(email, hashed_password, first_name, last_name, role);
                    res.send('User registered successfully.');
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
);

module.exports = router;