const db = require('./db');

module.exports = async function add_user(email, password, first_name, last_name, role) {
    return await db.query('CALL add_user(?, ?, ?, ?, ?);', [email, password, role, first_name, last_name]);
};