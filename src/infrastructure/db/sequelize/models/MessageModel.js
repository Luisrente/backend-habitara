const { DataTypes } = require('sequelize');
const sequelize = require('../index');
const ConversationModel = require('./ConversationModel');
const UserModel = require('./UserModel');

const MessageModel = sequelize.define(
  'Message',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    conversation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ConversationModel,
        key: 'id'
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    receiver_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    message_type: {
      type: DataTypes.ENUM('text', 'image', 'system'),
      defaultValue: 'text'
    }
  },
  {
    tableName: 'messages',
    underscored: true,
    timestamps: true,
    paranoid: true
  }
);

ConversationModel.hasMany(MessageModel, { foreignKey: 'conversation_id', as: 'messages' });
MessageModel.belongsTo(ConversationModel, { foreignKey: 'conversation_id', as: 'conversation' });

UserModel.hasMany(MessageModel, { foreignKey: 'sender_id', as: 'sentMessages' });
UserModel.hasMany(MessageModel, { foreignKey: 'receiver_id', as: 'receivedMessages' });
MessageModel.belongsTo(UserModel, { foreignKey: 'sender_id', as: 'sender' });
MessageModel.belongsTo(UserModel, { foreignKey: 'receiver_id', as: 'receiver' });

module.exports = MessageModel;
