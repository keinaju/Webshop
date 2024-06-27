const db = require('./db');

module.exports = async function delete_category_links(code) {
    return await db.query('CALL delete_category_links(?);', [code]);
};