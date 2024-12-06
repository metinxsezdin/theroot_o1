module.exports = (sequelize, DataTypes) => {
  const ClientEmployee = sequelize.define('ClientEmployee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  ClientEmployee.associate = (models) => {
    ClientEmployee.belongsTo(models.Client, {
      foreignKey: 'clientId',
    });
  };

  return ClientEmployee;
};
