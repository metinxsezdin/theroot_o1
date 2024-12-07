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
      validate: {
        isEmail: true, // E-posta doğrulama
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Şifre zorunlu
      validate: {
        len: [6, 255], // Şifre uzunluğu en az 6 karakter olmalı
      },
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
