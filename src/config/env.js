require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || 'habitara_super_secret_key',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    connection: process.env.DB_CONNECTION || 'mysql',
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 8889),
    database: process.env.DB_DATABASE || 'habitara',
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root'
  }
};
