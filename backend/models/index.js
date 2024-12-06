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

// Sequelize instance
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Models
db.Personnel = require('./personnel')(sequelize, DataTypes);
db.Department = require('./department')(sequelize, DataTypes);
db.Project = require('./project')(sequelize, DataTypes);
db.Client = require('./client')(sequelize, DataTypes);
db.Booking = require('./booking')(sequelize, DataTypes);
db.Activity = require('./activity')(sequelize, DataTypes);
db.ClientEmployee = require('./clientEmployee')(sequelize, DataTypes); // Yeni model eklendi

// Associations
db.Client.hasMany(db.ClientEmployee, {
  foreignKey: 'clientId',
  onDelete: 'CASCADE', // Client silindiğinde ilişkili çalışanlar silinir
});

db.ClientEmployee.belongsTo(db.Client, {
  foreignKey: 'clientId',
});

module.exports = db;
