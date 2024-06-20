const express = require('express');
const router = express.Router();
const add_user = require('../services/add_user');
const multer = require('multer');
const multer_parser = multer();
const bcrypt = require('bcrypt');

router.get('/users/add', (req, res) => {
    res.render('add_user', { user: req.user });
});

router.post('/users/add', multer_parser.none(), async function (req, res, next) {
    const { email, password, first_name, last_name, role = 'customer' } = req.body;

    try {
        bcrypt.hash(password, 10, async (error, hashed_password) => {
            if (error)
                next(error);
            await add_user(email, hashed_password, first_name, last_name, role);
            res.send('User registered successfully.');
        });
    }
    catch (error) {
        console.error('Error in user registration.', error.message);
        next(error);
    }
});

module.exports = router;