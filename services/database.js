const mysql = require('mysql2/promise');
const config = require('../db_config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.execute(sql, params);
    connection.end();
    return results;
}

class Database {
    static get = {
        //Get category data by product id
        async categories_by_product(id) {
            const [results,] = await query('CALL get_categories_by_id(?);', [id]);
            return results;
        },

        //Get a single product by id
        async product(id) {
            const [results,] = await query(`CALL get_product_by_id(?);`, [id]);
            return results[0];
        },

        //Get multiple products by categories and matching regular expression
        async products(limit, offset, chosen_categories, regex) {
            const [results,] = await query(
                `CALL get_products(?, ?, ${chosen_categories ? 'FALSE' : 'TRUE'}, ?, ?);`,
                [limit, offset, chosen_categories || null, regex]
            );
            return results;
        },

        //Get total count of products by categories and matching regular expression
        async products_count(chosen_categories, regex) {
            const [results,] = await query(
                `CALL get_products_count(${chosen_categories ? 'FALSE' : 'TRUE'}, ?, ?);`,
                [chosen_categories || null, regex]
            );
            return results[0].product_count;
        },
    };
}

module.exports = Database;