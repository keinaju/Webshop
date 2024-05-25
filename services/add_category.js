const db = require('./db');

module.exports = async function add_category(name, image_file) {
    return await db.query('CALL add_category(?, ?);', [name, image_file]);
}