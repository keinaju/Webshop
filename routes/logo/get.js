const database = require('../../services/database');

module.exports = async function (request, response, next) {
    try {
        const shop_configuration = await database.get.webshop();
        if (shop_configuration) {
            response.sendFile(`${process.env.PUBLIC_DIRECTORY_PATH}/${shop_configuration.logo_file}`, (error) => {
                if (error) {
                    console.log('Error while sending logo file.', error.message);
                    next(error);
                }
            });
        }
        else response.sendStatus(404);
    }
    catch (error) {
        console.log('Error in GET /logo.', error.message);
        next(error);
    }
};