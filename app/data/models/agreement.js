module.exports = (sequelize, DataTypes) => {
  const agreement = sequelize.define('agreement', {
    agreementId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    sbi: DataTypes.INTEGER,
    agreementData: DataTypes.JSON,
    statusId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  },
  {
    tableName: 'agreements',
    freezeTableName: true
  })
  agreement.associate = function (models) {
    agreement.hasOne(models.status, {
      foreignKey: 'statusId',
      as: 'status'
    })
  }
  return agreement
}
