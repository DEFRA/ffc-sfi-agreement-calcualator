module.exports = (sequelize, DataTypes) => {
  const level = sequelize.define('level', {
    levelId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    standardId: DataTypes.INTEGER,
    name: DataTypes.STRING
  },
  {
    tableName: 'levels',
    freezeTableName: true,
    timestamps: false
  })
  level.associate = function (models) {
    level.belongsTo(models.standard, {
      foreignKey: 'standardId',
      as: 'standards'
    })
    level.hasMany(models.rate, {
      foreignKey: 'levelId',
      as: 'rates'
    })
  }
  return level
}
