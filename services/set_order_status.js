const db = require('./db');

module.exports = async function set_order_status(order_id, new_status) {
    return await db.query(`CALL set_order_status(?, ?);`, [order_id, new_status]);
};