const db = require('./db');

module.exports = async function get_products(limit, offset) {
    return await db.query('CALL get_products(?,?)', [limit, offset]);
}