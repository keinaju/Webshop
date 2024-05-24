const db = require('./db');

module.exports = async function add_product(code, price, name, description, image_file) {
    return await db.query('CALL add_product(?, ?, ?, ?, ?);', [code, price, name, description, image_file]);
}