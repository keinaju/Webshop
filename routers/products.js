const express = require('express');
const router = express.Router();
const get_products = require('../services/get_products');
const add_product = require('../services/add_product');
const path = require('path');

router.get('/products/add', (req, res) => {
    res.render('add_product');
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1_000_000 }, //Limit files to 1MB,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/^image/)) cb(null, true);
        else cb(new Error('File type not valid.'));
    }
});

router.post('/products/add', upload.single('image'), async function (req, res, next) {
    let { product_code, product_name, description, price, category } = req.body;
    if (product_code == '') product_code = Date.now();

    let filename;
    if (req.file) filename = req.file.filename;
    else filename = null;

    try {
        await add_product(product_code, price, product_name, description, filename);
        res.send('Product was uploaded successfully.');
    }
    catch (error) {
        console.error('Error in product addition.', error.message);
        next(error);
    }
});

router.get('/products/list/:page(\\d+)', async function (req, res, next) {
    const page = req.params.page;
    try {
        res.render('products_page', {
            'product_list': await get_products(20, 20 * page),
            'page_number': page,
        });
    }
    catch (error) {
        console.error('Error in product query.', error.message);
        next(error);
    }
});

module.exports = router;