module.exports = (sequelize, DataTypes) => {
  const crossCheck = sequelize.define('crossCheck', {
    crossCheckId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    parcel: DataTypes.STRING,
    landCoverId: DataTypes.INTEGER,
    area: DataTypes.DECIMAL
  },
  {
    tableName: 'crossChecks',
    freezeTableName: true
  })
  crossCheck.associate = function (models) {
    crossCheck.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
    crossCheck.belongsTo(models.landCover, {
      foreignKey: 'landCoverId',
      as: 'landCovers'
    })
  }
  return crossCheck
}
