const db = require('./db');

module.exports = async function get_products_count(chosen_categories, regex) {
    const [results,] = await db.query(
        `CALL get_products_count(${chosen_categories ? 'FALSE' : 'TRUE'}, ?, ?);`,
        [chosen_categories || null, regex]
    );
    return results[0].product_count;
};