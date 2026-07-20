const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: 'mysql',
      logging: false,
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        },
        connectTimeout: 60000
      }
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false
          },
          connectTimeout: 60000
        }
      }
    );

module.exports = sequelize;