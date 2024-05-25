const db = require('./db');

module.exports = async function add_category_links(product_code, categories) {
    for (const category_id of categories) {
        await db.query('CALL add_category_link(?, ?);', [product_code, category_id]);
    }
};