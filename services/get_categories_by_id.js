const db = require('./db');

module.exports = async function get_categories_by_id(id) {
    const [results,] = await db.query('CALL get_categories_by_id(?);', [id]);
    return results;
};