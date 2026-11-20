const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const UniversityModel = sequelize.define(
  'University',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
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
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    }
  },
  {
    tableName: 'universities',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

module.exports = UniversityModel;
