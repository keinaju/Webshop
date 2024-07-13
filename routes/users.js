const express = require('express');
const router = express.Router();
const database = require('../services/database');
const validations = require('./validations/validations');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multer_parser = multer();

router.get('/users/add', (req, res) => {
    res.render('add_user', { user: req.user });
});

router.post('/users/add',
    multer_parser.none(),
    validations.user,
    async function (req, res, next) {
        const { email, password, first_name, last_name, role = 'customer' } = req.body;
        try {
            bcrypt.hash(password, 10, async (error, hashed_password) => {
                if (error)
                    next(error);
                try {
                    await database.add.user(email, hashed_password, first_name, last_name, role);
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