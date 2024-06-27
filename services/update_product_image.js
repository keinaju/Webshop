const db = require('./db');

module.exports = async function update_product_image(code, image_file) {
    return await db.query('CALL update_product_image(?, ?);', [code, image_file]);
};