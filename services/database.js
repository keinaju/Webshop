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
        async product(id) {
            const [results,] = await query(`CALL get_product_by_id(?);`, [id]);
            return results[0];
        }
    };
}

module.exports = Database;