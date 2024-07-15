const async_handler = require('express-async-handler');
const database = require('../../services/database');

module.exports = async_handler(request_handler);

async function request_handler(request, response, next) {
    const shop_config = await database.get.webshop();
    if (shop_config)
        response.sendFile(
            `${process.env.PUBLIC_DIRECTORY_PATH}/${shop_config.logo_file}`,
            error => { if (error) next(error); }
        );
    else response.sendStatus(404);
};