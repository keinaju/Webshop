const express = require('express');
const router = express.Router();
const get_products = require('../services/get_products');
const add_product = require('../services/add_product');
const upload_file = require('../services/upload_file');
const get_categories = require('../services/get_categories');

router.get('/products/add', async (req, res) => {
    res.render('add_product', { categories_list: await get_categories() });
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
        res.render('products_list', {
            'product_list': await get_products(20, 20 * page),
            'page_number': page,
            'categories_list': await get_categories(),
        });
    }
    catch (error) {
        console.error('Error in product query.', error.message);
        next(error);
    }
});

module.exports = router;