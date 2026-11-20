const CreateAccommodationUseCase = require('../../../application/use-cases/accommodation/CreateAccommodationUseCase');
const GetAccommodationsByLandlordUseCase = require('../../../application/use-cases/accommodation/GetAccommodationsByLandlordUseCase');
const UpdateAccommodationUseCase = require('../../../application/use-cases/accommodation/UpdateAccommodationUseCase');
const DeleteAccommodationUseCase = require('../../../application/use-cases/accommodation/DeleteAccommodationUseCase');
const SequelizeAccommodationRepository = require('../../../infrastructure/db/sequelize/repositories/SequelizeAccommodationRepository');
const SequelizeLocationRepository = require('../../../infrastructure/db/sequelize/repositories/SequelizeLocationRepository');

class AccommodationController {
  async create(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const locationRepository = new SequelizeLocationRepository();
      const useCase = new CreateAccommodationUseCase(repository);

      const location = req.body.location;
      if (!location || !location.address || !location.city || !location.district) {
        throw new Error('La ubicación es obligatoria');
      }

      const createdLocation = await locationRepository.create(location);

      const accommodation = await useCase.execute({
        landlordId: req.user.sub,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        roomType: req.body.roomType,
        locationId: createdLocation.id,
        amenities: req.body.amenities,
        photos: req.body.photos,
        rules: req.body.rules,
        isFurnished: req.body.isFurnished,
        bedrooms: req.body.bedrooms,
        bathrooms: req.body.bathrooms,
        maxTenants: req.body.maxTenants,
        areaM2: req.body.areaM2,
        distanceToUniversityKm: req.body.distanceToUniversityKm,
        idealFor: req.body.idealFor,
        availableFrom: req.body.availableFrom,
        availabilityNote: req.body.availabilityNote
      });

      return res.status(201).json({ success: true, data: accommodation });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listPublished(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const accommodations = await repository.findAllPublished();

      return res.status(200).json({ success: true, data: accommodations });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async listByLandlord(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const useCase = new GetAccommodationsByLandlordUseCase(repository);

      const accommodations = await useCase.execute(req.user.sub);

      return res.status(200).json({ success: true, data: accommodations });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const useCase = new UpdateAccommodationUseCase(repository);

      const accommodation = await useCase.execute(req.params.id, req.body);

      return res.status(200).json({ success: true, data: accommodation });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const useCase = new DeleteAccommodationUseCase(repository);

      const result = await useCase.execute(req.params.id);

      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const repository = new SequelizeAccommodationRepository();
      const accommodation = await repository.findById(req.params.id);

      if (!accommodation) {
        return res.status(404).json({ success: false, message: 'Alojamiento no encontrado' });
      }

      return res.status(200).json({ success: true, data: accommodation });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AccommodationController();
