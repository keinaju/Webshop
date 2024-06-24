const db = require('./db');

module.exports = async function set_shopping_cart_by_email(email, contents) {
    return await db.query(`CALL set_shopping_cart_by_email(?, ?);`, [email, contents]);
};