const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const AccommodationModel = require('./AccommodationModel');
const UserModel = require('./UserModel');

const ConversationModel = sequelize.define(
  'Conversation',
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
    landlord_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
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
    status: {
      type: DataTypes.ENUM('open', 'resolved', 'archived'),
      defaultValue: 'open'
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'conversations',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

AccommodationModel.hasMany(ConversationModel, { foreignKey: 'accommodation_id', as: 'conversations' });
ConversationModel.belongsTo(AccommodationModel, { foreignKey: 'accommodation_id', as: 'accommodation' });

UserModel.hasMany(ConversationModel, { foreignKey: 'landlord_id', as: 'landlordConversations' });
UserModel.hasMany(ConversationModel, { foreignKey: 'tenant_id', as: 'tenantConversations' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'tenant_id', as: 'tenant' });
ConversationModel.belongsTo(UserModel, { foreignKey: 'landlord_id', as: 'landlord' });

module.exports = ConversationModel;
