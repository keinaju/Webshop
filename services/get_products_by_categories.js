const db = require('./db');

module.exports = async function get_products_by_categories(limit, offset, chosen_categories) {
    const [results,] =
        await db.query(`CALL get_products_by_categories(?, ?, ${chosen_categories ? 'FALSE' : 'TRUE'}, ?);`, [limit, offset, chosen_categories || null]);
    return results;
};