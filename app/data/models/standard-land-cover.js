module.exports = (sequelize, DataTypes) => {
  const standardLandCover = sequelize.define('standardLandCover', {
    standardId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false },
    landCoverId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: false }
  },
  {
    tableName: 'standardLandCovers',
    freezeTableName: true,
    timestamps: false
  })
  standardLandCover.associate = function (models) {
    standardLandCover.belongsTo(models.standard, { foreignKey: 'standardId' })
    standardLandCover.belongsTo(models.landCover, { foreignKey: 'landCoverId' })
  }
  return standardLandCover
}
