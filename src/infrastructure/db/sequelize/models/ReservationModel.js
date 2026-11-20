const { DataTypes, Op } = require('sequelize');
const sequelize = require('../index');
const AccommodationModel = require('./AccommodationModel');
const UserModel = require('./UserModel');

const ReservationModel = sequelize.define(
  'Reservation',
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
    tenant_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    landlord_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
      defaultValue: 'pending'
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: 'reservations',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

AccommodationModel.hasMany(ReservationModel, { foreignKey: 'accommodation_id', as: 'reservations' });
ReservationModel.belongsTo(AccommodationModel, { foreignKey: 'accommodation_id', as: 'accommodation' });

UserModel.hasMany(ReservationModel, { foreignKey: 'tenant_id', as: 'tenantReservations' });
ReservationModel.belongsTo(UserModel, { foreignKey: 'tenant_id', as: 'tenant' });

UserModel.hasMany(ReservationModel, { foreignKey: 'landlord_id', as: 'landlordReservations' });
ReservationModel.belongsTo(UserModel, { foreignKey: 'landlord_id', as: 'landlord' });

module.exports = ReservationModel;
