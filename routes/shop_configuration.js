const express = require('express');
const router = express.Router();
const database = require('../services/database');
const validations = require('./validations/validations');
const upload_file = require('../services/upload_file');

router.get('/shop_configuration', validations.shop, (req, res, next) => {
    res.render('shop_configuration', {
        user: req.user,
        form_destination: '/shop_configuration',
        form_method: 'post',
    });
});

router.post('/shop_configuration', validations.shop, upload_file.single('logo'), async (req, res, next) => {
    try {
        let filename = null;
        if (req.file)
            filename = req.file.filename;
        let config = {
            logo_file: filename,
            business_name: req.body.business_name,
            slogan: req.body.slogan,
            main_color: req.body.main_color,
        };
        await database.update.webshop(config);
        res.send('Shop was updated.');
    }
    catch (error) {
        console.log('Error while updating shop configuration.', error.message);
        next(error);
    }
});

module.exports = router;