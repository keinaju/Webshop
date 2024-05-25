const db = require('./db');

module.exports = async function get_categories() {
    const [results,] = await db.query('CALL get_categories();');
    return results;
};