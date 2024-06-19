const express = require('express');
const router = express.Router();
const add_user = require('../services/add_user');
const multer = require('multer');
const multer_parser = multer();

router.get('/users/add', (req, res) => {
    res.render('add_user');
});

router.post('/users/add', multer_parser.none(), async function (req, res, next) {
    const { email, password, first_name, last_name, role } = req.body;

    try {
        await add_user(email, password, first_name, last_name, role);
        res.send('User registered successfully.');
    }
    catch (error) {
        console.error('Error in user registration.', error.message);
        next(error);
    }
});

module.exports = router;