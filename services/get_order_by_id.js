const db = require('./db');

module.exports = async function get_order_by_id(order_id) {
    const [results,] = await db.query(`CALL get_order_by_id(?);`, [order_id]);
    return results[0];
};