module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sütunu NULL değer kabul edecek şekilde ekleyin
    await queryInterface.addColumn('Personnels', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Varsayılan bir şifre belirleyin ve tüm mevcut kullanıcıları güncelleyin
    const hashedPassword = await bcrypt.hash('defaultPassword123', 10);
    await queryInterface.sequelize.query(
      `UPDATE "Personnels" SET "password" = '${hashedPassword}' WHERE "password" IS NULL;`
    );

    // Sütunu NOT NULL olarak ayarlayın
    await queryInterface.changeColumn('Personnels', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Personnels', 'password');
  },
};
