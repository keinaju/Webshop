const config = {
  db: {
    host: process.env.DB_URL,
    database: 'webshop',
    connectTimeout: 60000,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }
};

module.exports = config;