const LocationModel = require('../models/LocationModel');

class SequelizeLocationRepository {
  async create(data) {
    return LocationModel.create({
      address: data.address,
      district: data.district,
      city: data.city,
      state: data.state,
      country: data.country || 'Perú',
      postal_code: data.postalCode,
      latitude: data.latitude,
      longitude: data.longitude,
      university_id: data.universityId || null
    });
  }

  async findById(id) {
    return LocationModel.findByPk(id);
  }
}

module.exports = SequelizeLocationRepository;
