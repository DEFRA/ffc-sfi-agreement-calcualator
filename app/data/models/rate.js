module.exports = (sequelize, DataTypes) => {
  const rate = sequelize.define('rate', {
    rateId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    levelId: DataTypes.INTEGER,
    rate: DataTypes.INTEGER,
    startDate: DataTypes.DATE
  },
  {
    tableName: 'rates',
    freezeTableName: true,
    timestamps: false
  })
  rate.associate = function (models) {
    rate.belongsTo(models.level, {
      foreignKey: 'levelId',
      as: 'level'
    })
  }
  return rate
}
