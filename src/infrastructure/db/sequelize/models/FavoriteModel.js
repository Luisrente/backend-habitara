const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const UserModel = require('./UserModel');
const AccommodationModel = require('./AccommodationModel');

const FavoriteModel = sequelize.define(
  'Favorite',
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
    accommodation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: AccommodationModel,
        key: 'id'
      }
    }
  },
  {
    tableName: 'favorites',
    underscored: true,
    timestamps: true,
    paranoid: true,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'accommodation_id']
      }
    ]
  }
);

UserModel.hasMany(FavoriteModel, { foreignKey: 'user_id', as: 'favorites' });
AccommodationModel.hasMany(FavoriteModel, { foreignKey: 'accommodation_id', as: 'favorites' });
FavoriteModel.belongsTo(UserModel, { foreignKey: 'user_id', as: 'user' });
FavoriteModel.belongsTo(AccommodationModel, { foreignKey: 'accommodation_id', as: 'accommodation' });

module.exports = FavoriteModel;
