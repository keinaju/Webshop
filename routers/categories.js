const express = require('express');
const router = express.Router();
const add_category = require('../services/add_category');
const upload_file = require('../services/upload_file');

router.get('/categories/add', (req, res) => {
    res.render('add_category', { user: req.user });
});

router.post('/categories/add', upload_file.single('image'), async function (req, res, next) {
    let { category_name } = req.body;

    let filename = null;
    if (req.file) filename = req.file.filename;

    try {
        await add_category(category_name, filename);
        res.send('Category was uploaded successfully.');
    }
    catch (error) {
        console.error('Error in category addition.', error.message);
        next(error);
    }
});

module.exports = router;