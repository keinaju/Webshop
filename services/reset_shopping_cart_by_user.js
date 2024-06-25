const db = require('./db');

module.exports = async function reset_shopping_cart_by_user(user_id) {
    return await db.query('CALL reset_shopping_cart_by_user(?);', [user_id]);
};