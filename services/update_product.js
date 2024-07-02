const db = require('./db');

module.exports = async function update_product(product) {
    return await db.query('CALL update_product(?, ?, ?, ?, ?, ?, ?, ?, ?);', [
        product.code,
        product.price,
        product.name,
        product.description || null,
        product.manufacturer || null,
        product.country_of_origin || null,
        product.released || null,
        product.lead_time_workdays || null,
        product.notes || null
    ]);
};