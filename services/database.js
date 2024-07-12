const mysql = require('mysql2/promise');
const config = require('../db_config');

async function query(sql, params) {
    const connection = await mysql.createConnection(config.db);
    const [results,] = await connection.execute(sql, params);
    connection.end();
    return results;
}

class Database {

    static add = {
        async category_links(product_id, categories) {
            for (const category_id of categories) {
                query('CALL add_category_link(?, ?);', [product_id, category_id]);
            }
        },
    };

    static delete = {
        //Delete all category links by product
        async category_links(id) {
            return await query('CALL delete_category_links(?);', [id]);
        }
    };

    static get = {
        //Get category data by product id
        async categories_by_product(id) {
            const [results,] = await query('CALL get_categories_by_id(?);', [id]);
            return results;
        },

        //Get all categories
        async categories() {
            const [results,] = await query('CALL get_categories();');
            return results;
        },

        //Get a single order by id
        async order(id) {
            const [results,] = await query(`CALL get_order_by_id(?);`, [id]);
            return results[0];
        },

        //Get multiple orders by status
        async orders_by_status(status, limit, offset) {
            const [results,] = await query(
                `CALL get_orders_by_status(?, ?, ?);`,
                [status, limit, offset]
            );
            return results;
        },

        //Get total count of orders by status
        async orders_count_by_status(status) {
            const [results,] = await query(
                `CALL get_orders_count_by_status(?);`, [status]
            );
            return results[0].orders_count;
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

        //Get user
        async user(email) {
            const [results,] = await query(
                `CALL get_user_by_email(?);`, [email]
            );
            return results[0];
        },

        //Get webshop configuration
        async webshop() {
            const [results,] = await query(`CALL get_webshop_configuration();`);
            return results[0];
        },
    };
}

module.exports = Database;