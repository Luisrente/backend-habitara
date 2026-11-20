const { Sequelize } = require('sequelize');
const config = require('./config');
const env = require('../../../config/env');

const environment = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[environment];

const isRDS = sequelizeConfig.host && sequelizeConfig.host.includes('rds.amazonaws.com');

const sequelize = new Sequelize(
  sequelizeConfig.database,
  sequelizeConfig.username,
  sequelizeConfig.password,
  {
    host: sequelizeConfig.host,
    port: sequelizeConfig.port,
    dialect: sequelizeConfig.dialect,
    logging: sequelizeConfig.logging,
    define: sequelizeConfig.define,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    ...(isRDS && {
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    })
  }
);

module.exports = sequelize;
