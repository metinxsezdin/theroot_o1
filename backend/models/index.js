
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.js').development;

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.Personnel = require('./personnel')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.Project = require('./project')(sequelize, DataTypes);
db.Client = require('./client')(sequelize, DataTypes);
db.Booking = require('./booking')(sequelize, DataTypes);
db.Activity = require('./activity')(sequelize, DataTypes);

module.exports = db;
