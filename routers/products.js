const express = require('express');
const router = express.Router();
const get_products = require('../services/get_products');
const add_product = require('../services/add_product');
const upload_file = require('../services/upload_file');

router.get('/products/add', (req, res) => {
    res.render('add_product');
});

router.post('/products/add', upload_file.single('image'), async function (req, res, next) {
    let { product_code, product_name, description, price, categories } = req.body;
    if (product_code == '') product_code = Date.now();

    let filename = null;
    if (req.file) filename = req.file.filename;

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