const db = require('./db');

module.exports = async function get_products(limit, offset) {
    const [results, ] = await db.query('CALL get_products(?, ?);', [limit, offset]);
    return results;
}