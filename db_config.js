const config = {
  db: {
    host: 'localhost',
    database: 'webshop',
    connectTimeout: 60000,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }
};

module.exports = config;