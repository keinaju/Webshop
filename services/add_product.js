const db = require('./db');

module.exports = async function add_product(code, price, name, description, image_file, manufacturer, country_of_origin, released, lead_time_workdays, notes) {
    return await db.query('CALL add_product(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);',
        [code, price, name, description || null, image_file || null, manufacturer || null, country_of_origin || null, released || null, lead_time_workdays || null, notes || null]
    );
}