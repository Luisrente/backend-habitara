const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const AccommodationModel = require('./AccommodationModel');
const AmenityModel = require('./AmenityModel');

const AccommodationAmenityModel = sequelize.define(
  'AccommodationAmenity',
  {
    accommodation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AccommodationModel,
        key: 'id'
      }
    },
    amenity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AmenityModel,
        key: 'id'
      }
    }
  },
  {
    tableName: 'accommodation_amenities',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['accommodation_id', 'amenity_id']
      }
    ]
  }
);

AccommodationModel.belongsToMany(AmenityModel, {
  through: AccommodationAmenityModel,
  foreignKey: 'accommodation_id',
  otherKey: 'amenity_id',
  as: 'amenities'
});

AmenityModel.belongsToMany(AccommodationModel, {
  through: AccommodationAmenityModel,
  foreignKey: 'amenity_id',
  otherKey: 'accommodation_id'
});

module.exports = AccommodationAmenityModel;
