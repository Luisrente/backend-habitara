const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const AccommodationModel = require('./AccommodationModel');

const RuleModel = sequelize.define(
  'Rule',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    accommodation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AccommodationModel,
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'rules',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

AccommodationModel.hasMany(RuleModel, { foreignKey: 'accommodation_id', as: 'rules' });
RuleModel.belongsTo(AccommodationModel, { foreignKey: 'accommodation_id', as: 'accommodation' });

module.exports = RuleModel;
