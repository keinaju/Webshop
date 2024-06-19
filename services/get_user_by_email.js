const db = require('./db');

module.exports = async function get_user_by_email(email) {
    const [results,] = await db.query(
        `CALL get_user_by_email(?);`, [email]
    );
    return results[0];
};