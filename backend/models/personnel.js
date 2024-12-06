module.exports = (sequelize, DataTypes) => {
  const Personnel = sequelize.define('Personnel', {
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
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    availability: {
      type: DataTypes.STRING, // veya BOOLEAN olarak ayarlayabilirsiniz
      defaultValue: 'Available', // Varsayılan değer
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return Personnel;
};
