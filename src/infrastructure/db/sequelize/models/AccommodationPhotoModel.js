const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const AccommodationModel = require('./AccommodationModel');

const AccommodationPhotoModel = sequelize.define(
  'AccommodationPhoto',
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
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    is_cover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    order_index: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
  {
    tableName: 'accommodation_photos',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

AccommodationModel.hasMany(AccommodationPhotoModel, { foreignKey: 'accommodation_id', as: 'photos' });
AccommodationPhotoModel.belongsTo(AccommodationModel, { foreignKey: 'accommodation_id', as: 'accommodation' });

module.exports = AccommodationPhotoModel;
