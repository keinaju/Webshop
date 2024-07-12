const express = require('express');
const router = express.Router();
const database = require('../services/database');
const { body, query } = require('express-validator');
const handle_validation_result = require('../services/handle_validation_result');
const pass = require('../services/pass');
const add_product = require('../services/add_product');
const add_category_links = require('../services/add_category_links');
const get_date_yyyy_mm_dd = require('../services/get_date_yyyy_mm_dd');
const update_product = require('../services/update_product');
const update_product_image = require('../services/update_product_image');
const upload_file = require('../services/upload_file');

router.get('/products/add', pass('merchant', 'admin'), async (req, res, next) => {
    try {
        res.render('product_form', {
            form_method: 'post',
            headline: 'Fill form to add new product to database:',
            form_destination: '/products/add',
            categories_list: await database.get.categories(),
            chosen_categories: [],
            product_code_locked: false,
            user: req.user,
            product: {}
        });
    }
    catch (error) {
        console.log('Error in GET /products/add', error.message);
        next(error);
    }
});

router.post('/products/add',
    pass('merchant', 'admin'),
    upload_file.single('image'),
    body('product_name').notEmpty().withMessage('Product name missing.'),
    body('price').isNumeric().withMessage('Invalid price.'),
    handle_validation_result,
    async function (req, res, next) {
        let product = {
            code: req.body.product_code || Date.now(),
            price: req.body.price,
            name: req.body.product_name,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            country_of_origin: req.body.country_of_origin,
            released: req.body.release_date,
            lead_time_workdays: req.body.lead_time_workdays,
            notes: req.body.notes
        };

        product.image_file = null;
        if (req.file)
            product.image_file = req.file.filename;

        try {
            await add_product(product);

            if (req.body.categories) {
                let categories;
                //req.body provides multiple categories as array, but one category as string
                //Array must be guaranteed when category is a single string:
                if (req.body.categories instanceof Array) categories = req.body.categories;
                else categories = [req.body.categories];
                await add_category_links(product.code, categories);
            }

            res.send('Product was uploaded successfully.');
        }
        catch (error) {
            console.error('Error in product addition.', error.message);
            next(error);
        }
    }
);

router.get('/products', async function (req, res, next) {
    const page = Number(req.query.page) || 0;
    const chosen_categories = req.query.categories || null;
    //Convert user input to MySQL regular expression
    let regex = '.*';
    if (req.query.search) regex = req.query.search.replaceAll(/ +/g, '|');
    try {
        const list_length = 20;
        const [product_list, product_count, categories_list] = await Promise.all([
            database.get.products(list_length, list_length * page, chosen_categories, regex),
            database.get.products_count(chosen_categories, regex),
            database.get.categories(),
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

router.get('/products/modify',
    pass('merchant', 'admin'),
    query('code')
        .notEmpty()
        .withMessage('Missing product code.')
        .custom(async product_code => {
            const product = await database.get.product(product_code);
            if (product) return true;
            else throw new Error('Product doesn\'t exist.');
        }),
    handle_validation_result,
    async (req, res, next) => {
        try {
            if (!req.query.code) return res.send('Missing product code.');
            let [product, categories_list, chosen_categories] = await Promise.all([
                database.get.product(req.query.code),
                database.get.categories(),
                database.get.categories_by_product(req.query.code)
            ]);
            //Ensure correct format of categories for view engine
            chosen_categories = chosen_categories.map(element => element.category.toString());
            //Ensure correct date format for view engine
            if (product.released) product.released = get_date_yyyy_mm_dd(product.released);

            res.render('product_form', {
                form_method: 'post',
                headline: 'Modify product data:',
                form_destination: '/products/modify?code=' + req.query.code,
                product: product,
                categories_list: categories_list,
                chosen_categories: chosen_categories,
                product_code_locked: true,
                user: req.user,
            });
        }
        catch (error) {
            console.log('Error in GET /products/modify', error.message);
            next(error);
        }
    }
);

router.post('/products/modify',
    pass('merchant', 'admin'),
    upload_file.single('image'),
    query('code')
        .notEmpty().withMessage('Product code is missing.')
        .custom(async product_code => {
            const product = await database.get.product(product_code);
            if (product) return true;
            else throw new Error('Product doesn\'t exist.');
        }),
    handle_validation_result,
    async (req, res, next) => {
        try {
            let product = {
                code: req.query.code,
                price: req.body.price,
                name: req.body.product_name,
                description: req.body.description,
                manufacturer: req.body.manufacturer,
                country_of_origin: req.body.country_of_origin,
                released: req.body.release_date,
                lead_time_workdays: req.body.lead_time_workdays,
                notes: req.body.notes
            };

            await update_product(product);

            if (req.file)
                await update_product_image(product.code, req.file.filename);

            if (req.body.categories) {
                let categories;
                //req.body provides multiple categories as array, but one category as string
                //Array must be guaranteed when category is a single string:
                if (req.body.categories instanceof Array) categories = req.body.categories;
                else categories = [req.body.categories];
                await database.delete.category_links(product.code);
                await add_category_links(product.code, categories);
            }

            res.send('Product was updated successfully.');
        }
        catch (error) {
            console.error('Error in product addition.', error.message);
            next(error);
        }
    }
);

module.exports = router;