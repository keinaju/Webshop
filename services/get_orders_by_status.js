const db = require('./db');

module.exports = async function get_orders_by_status(status, limit, offset) {
    const [results,] = await db.query(
        `CALL get_orders_by_status(?, ?, ?);`, [status, limit, offset]
    );
    return results;
};