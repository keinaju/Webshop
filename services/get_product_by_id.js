const db = require('./db');

module.exports = async function get_product_by_id(product_id) {
    const [results,] = await db.query(`CALL get_product_by_id(?);`, [product_id]);
    return results[0];
};