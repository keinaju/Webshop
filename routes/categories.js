const express = require('express');
const router = express.Router();
const database = require('../services/database');
const upload_file = require('../services/upload_file');
const pass = require('../services/pass');
const { body } = require('express-validator');
const handle_validation_result = require('../services/handle_validation_result');

router.get('/categories/add', pass('merchant', 'admin'), (req, res) => {
    res.render('add_category', { user: req.user });
});

router.post('/categories/add',
    pass('merchant', 'admin'),
    upload_file.single('image'),
    body('category_name').notEmpty().withMessage('Category name missing.'),
    handle_validation_result,
    async function (req, res, next) {
        let { category_name } = req.body;
        let filename = null;
        if (req.file) filename = req.file.filename;
        try {
            await database.add.category(category_name, filename);
            res.send('Category was uploaded successfully.');
        }
        catch (error) {
            console.error('Error in category addition.', error.message);
            next(error);
        }
    }
);

module.exports = router;