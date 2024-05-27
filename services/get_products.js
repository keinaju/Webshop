const db = require('./db');

module.exports = async function get_products(limit, offset, chosen_categories, regex) {
    const [results,] = await db.query(
        `CALL get_products(?, ?, ${chosen_categories ? 'FALSE' : 'TRUE'}, ?, ?);`,
        [limit, offset, chosen_categories || null, regex]
    );
    return results;
};