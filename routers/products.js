const express = require('express');
const router = express.Router();
const add_product = require('../services/add_product');
const get_products = require('../services/get_products');
const get_products_count = require('../services/get_products_count');
const add_category_links = require('../services/add_category_links');
const get_categories = require('../services/get_categories');
const get_categories_by_id = require('../services/get_categories_by_id');
const upload_file = require('../services/upload_file');
const pass = require('../services/pass');
const get_date_yyyy_mm_dd = require('../services/get_date_yyyy_mm_dd');
const get_product_by_id = require('../services/get_product_by_id');


router.get('/products/add', pass('merchant', 'admin'), async (req, res, next) => {
    res.render('product_form', {
        headline: 'Fill form to add new product to database:',
        post_destination: '/products/add',
        categories_list: await get_categories(),
        chosen_categories: [],
        user: req.user,
        product: {}
    });
});

router.post('/products/add', pass('merchant', 'admin'), upload_file.single('image'), async function (req, res, next) {
    let { product_code, product_name, description, price, manufacturer, country_of_origin, release_date, lead_time_workdays, notes } = req.body;
    if (product_code == '') product_code = Date.now();

    let filename = null;
    if (req.file) filename = req.file.filename;

    try {
        await add_product(product_code, price, product_name, description, filename, manufacturer, country_of_origin, release_date, lead_time_workdays, notes);

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
    if (req.query.search) regex = req.query.search.replaceAll(/ +/g, '|');
    try {
        const list_length = 20;
        const [product_list, product_count, categories_list] = await Promise.all([
            get_products(list_length, list_length * page, chosen_categories, regex),
            get_products_count(chosen_categories, regex),
            get_categories(),
        ]);
        const total_of_pages = Math.ceil(product_count / list_length);
        res.render('products_list', {
            product_list: product_list,
            product_count: product_count,
            categories_list: categories_list,
            page_number: page,
            total_of_pages: total_of_pages,
            showing_first: list_length * page + 1,
            showing_last: Math.min(list_length * (page + 1), product_count),
            chosen_categories: chosen_categories ? chosen_categories.split(',') : [],
            search_string: req.query.search,
            user: req.user,
        });
    }
    catch (error) {
        console.error('Error in product query.', error.message);
        next(error);
    }
});

router.get('/products/modify', pass('merchant', 'admin'), async (req, res, next) => {
    try {
        if (!req.query.code) return res.send('Missing product code.');
        let [product, categories_list, chosen_categories] = await Promise.all([
            get_product_by_id(req.query.code),
            get_categories(),
            get_categories_by_id(req.query.code)
        ]);
        //Ensure correct format of categories for view engine
        chosen_categories = chosen_categories.map(element => element.category.toString());
        console.log(chosen_categories);
        //Ensure correct date format for view engine
        if (product.released) product.released = get_date_yyyy_mm_dd(product.released);

        res.render('product_form', {
            headline: 'Modify product data:',
            post_destination: '/products/modify',
            product: product,
            categories_list: categories_list,
            chosen_categories: chosen_categories,
            user: req.user,
        });
    }
    catch (error) {
        console.log('Error in GET /products/modify', error.message);
        next(error);
    }
});

module.exports = router;