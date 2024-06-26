const db = require('./db');

module.exports = async function get_orders_count_by_status(status) {
    const [results,] = await db.query(
        `CALL get_orders_count_by_status(?);`, [status]
    );
    return results[0].orders_count;
};