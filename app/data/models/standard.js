module.exports = (sequelize, DataTypes) => {
  const standard = sequelize.define('standard', {
    standardId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    schemeId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    code: DataTypes.STRING
  },
  {
    tableName: 'standards',
    freezeTableName: true,
    timestamps: false
  })
  standard.associate = function (models) {
    standard.belongsTo(models.scheme, {
      foreignKey: 'schemeId',
      as: 'scheme'
    })
    standard.hasMany(models.level, {
      foreignKey: 'standardId',
      as: 'levels'
    })
  }
  return standard
}
