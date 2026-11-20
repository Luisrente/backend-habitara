const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const AmenityModel = sequelize.define(
  'Amenity',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true
    },
    category: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    icon_name: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  },
  {
    tableName: 'amenities',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

module.exports = AmenityModel;
