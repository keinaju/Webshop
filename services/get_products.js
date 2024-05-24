const db = require('./db');

module.exports = async function get_products() {
    return await db.query('SELECT * FROM products;');
}