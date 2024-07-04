const db = require('./db');

module.exports = async function get_webshop_configuration() {
    const [results,] = await db.query(`CALL get_webshop_configuration();`);
    return results[0];
};