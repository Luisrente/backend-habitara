const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const UserModel = require('./UserModel');
const LocationModel = require('./LocationModel');

const AccommodationModel = sequelize.define(
  'Accommodation',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    landlord_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: LocationModel,
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: 'COP'
    },
    room_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived', 'rented'),
      defaultValue: 'published'
    },
    is_furnished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    max_tenants: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    area_m2: {
      type: DataTypes.DECIMAL(8, 2),
      allowNull: true
    },
    distance_to_university_km: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    ideal_for: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    available_from: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    availability_note: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'accommodations',
    underscored: true,
    paranoid: true,
    timestamps: true
  }
);

UserModel.hasMany(AccommodationModel, { foreignKey: 'landlord_id', as: 'accommodations' });
AccommodationModel.belongsTo(UserModel, { foreignKey: 'landlord_id', as: 'landlord' });
AccommodationModel.belongsTo(LocationModel, { foreignKey: 'location_id', as: 'location' });
LocationModel.hasMany(AccommodationModel, { foreignKey: 'location_id', as: 'accommodations' });

module.exports = AccommodationModel;
