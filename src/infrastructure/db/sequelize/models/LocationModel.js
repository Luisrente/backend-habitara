const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const UniversityModel = require('./UniversityModel');

const LocationModel = sequelize.define(
  'Location',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    district: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(120),
      allowNull: true
    },
    country: {
      type: DataTypes.STRING(120),
      allowNull: false,
      defaultValue: 'Perú'
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },
    university_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: UniversityModel,
        key: 'id'
      }
    }
  },
  {
    tableName: 'locations',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

UniversityModel.hasMany(LocationModel, { foreignKey: 'university_id', as: 'locations' });
LocationModel.belongsTo(UniversityModel, { foreignKey: 'university_id', as: 'university' });

module.exports = LocationModel;
