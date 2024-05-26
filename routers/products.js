const express = require('express');
const router = express.Router();
const add_product = require('../services/add_product');
const get_products_by_categories = require('../services/get_products_by_categories');
const add_category_links = require('../services/add_category_links');
const get_categories = require('../services/get_categories');
const upload_file = require('../services/upload_file');

router.get('/products/add', async (req, res) => {
    res.render('add_product', { categories_list: await get_categories() });
});

router.post('/products/add', upload_file.single('image'), async function (req, res, next) {
    let { product_code, product_name, description, price } = req.body;
    if (product_code == '') product_code = Date.now();

    let filename = null;
    if (req.file) filename = req.file.filename;

    try {
        await add_product(product_code, price, product_name, description, filename);
        
        if (req.body.categories) {
            let categories;
            //req.body provides multiple categories as array, but one category as string
            //Array must be guaranteed when category is a single string:
            if (req.body.categories instanceof Array) categories = req.body.categories;
            else categories = [req.body.categories];
            await add_category_links(product_code, categories);
        } 
        
        res.send('Product was uploaded successfully.');
    }
    catch (error) {
        console.error('Error in product addition.', error.message);
        next(error);
    }
});

router.get('/products', async function (req, res, next) {
    const page = req.query.page || 0;
    const chosen_categories = req.query.categories || null;
    try {
        res.render('products_list', {
            'product_list': await get_products_by_categories(20, 20 * page, chosen_categories),
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