const UserModel = require('./UserModel');
const UniversityModel = require('./UniversityModel');
const LocationModel = require('./LocationModel');
const AccommodationModel = require('./AccommodationModel');
const AmenityModel = require('./AmenityModel');
const AccommodationAmenityModel = require('./AccommodationAmenityModel');
const AccommodationPhotoModel = require('./AccommodationPhotoModel');
const RuleModel = require('./RuleModel');
const ConversationModel = require('./ConversationModel');
const MessageModel = require('./MessageModel');
const FavoriteModel = require('./FavoriteModel');

const models = {
  UserModel,
  UniversityModel,
  LocationModel,
  AccommodationModel,
  AmenityModel,
  AccommodationAmenityModel,
  AccommodationPhotoModel,
  RuleModel,
  ConversationModel,
  MessageModel,
  FavoriteModel
};

module.exports = models;
