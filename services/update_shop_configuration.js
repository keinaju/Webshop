const db = require('./db');

module.exports = async function update_shop_configuration(config) {
    return await db.query('CALL update_shop_configuration(?, ?, ?, ?);', [
        config.logo_file || null,
        config.business_name || null,
        config.slogan || null,
        config.main_color || null,
    ]);
};