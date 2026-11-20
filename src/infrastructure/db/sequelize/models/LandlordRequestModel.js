const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const UserModel = require('./UserModel');

const LandlordRequestModel = sequelize.define(
  'LandlordRequest',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    property_title: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    property_type: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    address: {
      type: DataTypes.STRING(220),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    documents_summary: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
      allowNull: false
    },
    admin_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    national_id: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: ''
    },
    id_document_photo: {
      type: DataTypes.TEXT('medium'),
      allowNull: false,
      defaultValue: ''
    },
    education_level: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: ''
    },
    criminal_record_status: {
      type: DataTypes.STRING(80),
      allowNull: false,
      defaultValue: 'No registrado'
    },
    criminal_record_document: {
      type: DataTypes.TEXT('medium'),
      allowNull: true
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    tableName: 'landlord_requests',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

UserModel.hasMany(LandlordRequestModel, { foreignKey: 'user_id', as: 'landlordRequests' });
LandlordRequestModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });

module.exports = LandlordRequestModel;
