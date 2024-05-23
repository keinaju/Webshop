const db = require('./db');

async function add_product(code, price, name, description, image_file) {
    return await db.query('CALL add_product(?, ?, ?, ?, ?);', [code, price, name, description, image_file]);
}

module.exports = add_product;