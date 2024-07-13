const express = require('express');
const router = express.Router();
const database = require('../services/database');
const upload_file = require('../services/upload_file');
const validations = require('./validations/validations');

router.get('/categories/add', validations.category.page, (req, res) => {
    res.render('add_category', { user: req.user });
});

router.post('/categories/add', upload_file.single('image'), validations.category.add, async function (req, res, next) {
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
});

module.exports = router;