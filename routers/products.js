const express = require('express');
const router = express.Router();
const add_product = require('../services/add_product');
const get_products = require('../services/get_products');
const get_products_count = require('../services/get_products_count');
const add_category_links = require('../services/add_category_links');
const get_categories = require('../services/get_categories');
const upload_file = require('../services/upload_file');

router.get('/products/add', async (req, res) => {
    res.render('add_product', { categories_list: await get_categories(), chosen_categories: [] });
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
    const page = Number(req.query.page) || 0;
    const chosen_categories = req.query.categories || null;
    //Convert user input to MySQL regular expression
    let regex = '.*';
    if(req.query.search) regex = req.query.search.replaceAll(/ +/g, '|');
    try {
        const list_length = 20;
        const product_list = await get_products(list_length, list_length * page, chosen_categories, regex);
        const product_count = await get_products_count(chosen_categories, regex);
        const categories_list = await get_categories();
        const total_of_pages = Math.ceil(product_count / list_length);
        res.render('products_list', {
            'product_list': product_list,
            'product_count': product_count,
            'categories_list': categories_list,
            'page_number': page,
            'total_of_pages': total_of_pages,
            'showing_first': list_length * page + 1,
            'showing_last': Math.min(list_length * (page + 1), product_count),
            'chosen_categories': chosen_categories ? chosen_categories.split(',') : [],
            'search_string': req.query.search,
        });
    }
    catch (error) {
        console.error('Error in product query.', error.message);
        next(error);
    }
});

module.exports = router;