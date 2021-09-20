module.exports = (sequelize, DataTypes) => {
  const landCover = sequelize.define('landCover', {
    landCoverId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    code: DataTypes.STRING,
    name: DataTypes.STRING
  },
  {
    tableName: 'landCovers',
    freezeTableName: true,
    timestamps: false
  })
  landCover.associate = function (models) {
    landCover.belongsToMany(models.standard, {
      foreignKey: 'landCoverId',
      as: 'standards',
      through: 'standardLandCovers'
    })
  }
  return landCover
}
