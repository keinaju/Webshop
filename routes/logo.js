const express = require('express');
const router = express.Router();
const database = require('../services/database');

router.get('/logo', async (req, res, next) => {
    try {
        const shop_configuration = await database.get.webshop();
        if (shop_configuration) {
            res.sendFile(`${process.env.PUBLIC_DIRECTORY_PATH}/${shop_configuration.logo_file}`, (error) => {
                if (error) {
                    console.log('Error while sending logo file.', error.message);
                    next(error);
                }
            });
        }
        else res.sendStatus(404);
    }
    catch (error) {
        console.log('Error in GET /logo.', error.message);
        next(error);
    }
});

module.exports = router;