const db = require('./db');

module.exports = async function update_product(code, price, name, description, manufacturer, country_of_origin, released, lead_time_workdays, notes) {
    return await db.query('CALL update_product(?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [code, price, name, description || null, manufacturer || null, country_of_origin || null, released || null, lead_time_workdays || null, notes || null]
    );
};