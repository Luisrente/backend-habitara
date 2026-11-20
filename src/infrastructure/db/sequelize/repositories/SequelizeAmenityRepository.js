const AmenityModel = require('../models/AmenityModel');

class SequelizeAmenityRepository {
  async findAllByIds(ids) {
    if (!ids || ids.length === 0) return [];
    return AmenityModel.findAll({ where: { id: ids } });
  }
}

module.exports = SequelizeAmenityRepository;
