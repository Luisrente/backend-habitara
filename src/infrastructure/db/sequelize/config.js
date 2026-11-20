const env = require('../../../config/env');

module.exports = {
  development: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    host: env.db.host,
    port: env.db.port,
    dialect: env.db.connection,
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  },
  test: {
    username: env.db.username,
    password: env.db.password,
    database: `${env.db.database}_test`,
    host: env.db.host,
    port: env.db.port,
    dialect: env.db.connection,
    logging: false
  },
  production: {
    username: env.db.username,
    password: env.db.password,
    database: env.db.database,
    host: env.db.host,
    port: env.db.port,
    dialect: env.db.connection,
    logging: false
  }
};
