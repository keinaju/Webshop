const db = require('./db');

module.exports = async function add_product(product) {
    return await db.query('CALL add_product(?, ?, ?, ?, ?, ?, ?, ?, ?, ?);', [
        product.code,
        product.price,
        product.name,
        product.description || null,
        product.image_file || null,
        product.manufacturer || null,
        product.country_of_origin || null,
        product.released || null,
        product.lead_time_workdays || null,
        product.notes || null
    ]);
};