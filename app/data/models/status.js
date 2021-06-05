module.exports = (sequelize, DataTypes) => {
  const status = sequelize.define('status', {
    statusId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    status: DataTypes.STRING
  },
  {
    tableName: 'agreements',
    freezeTableName: true
  })
  status.associate = function (models) {
    status.hasMany(models.agreement, {
      foreignKey: 'statusId',
      as: 'agreements'
    })
  }
  return status
}
