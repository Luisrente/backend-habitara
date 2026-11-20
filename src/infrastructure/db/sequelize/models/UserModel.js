const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const UserModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'landlord', 'tenant'),
      allowNull: false,
      defaultValue: 'tenant'
    },
    status: {
      type: DataTypes.ENUM('active', 'blocked', 'pending'),
      allowNull: false,
      defaultValue: 'active'
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    tableName: 'users',
    underscored: true,
    paranoid: true,
    timestamps: true
  }
);

module.exports = UserModel;
