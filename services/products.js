const db = require('./db');

async function getProducts() {
    return await db.query('SELECT * FROM products;');
}

module.exports = { getProducts };