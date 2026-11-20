const AccommodationModel = require('../models/AccommodationModel');
const LocationModel = require('../models/LocationModel');
const AmenityModel = require('../models/AmenityModel');
const AccommodationAmenityModel = require('../models/AccommodationAmenityModel');

class SequelizeAccommodationRepository {
  async create(data) {
    const accommodation = await AccommodationModel.create({
      landlord_id: data.landlordId,
      location_id: data.locationId,
      title: data.title,
      description: data.description,
      price: data.price,
      currency: data.currency || 'USD',
      room_type: data.roomType,
      status: data.status || 'published',
      is_furnished: data.isFurnished,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      max_tenants: data.maxTenants,
      area_m2: data.areaM2 || null,
      distance_to_university_km: data.distanceToUniversityKm || null,
      ideal_for: data.idealFor || null,
      available_from: data.availableFrom || null,
      availability_note: data.availabilityNote || null
    });

    if (data.amenities && data.amenities.length > 0) {
      const validAmenities = await AmenityModel.findAll({
        where: { id: data.amenities }
      });

      const validAmenityIds = validAmenities.map(item => item.id);
      if (validAmenityIds.length > 0) {
        await accommodation.addAmenities(validAmenityIds);
      }
    }

    if (data.photos && data.photos.length > 0) {
      await Promise.all(
        data.photos.map((photo, index) => {
          const photoModel = require('../models/AccommodationPhotoModel');
          return photoModel.create({
            accommodation_id: accommodation.id,
            url: photo.url || photo,
            caption: photo.caption || '',
            is_cover: index === 0,
            order_index: index
          });
        })
      );
    }

    if (data.rules && data.rules.length > 0) {
      const RuleModel = require('../models/RuleModel');
      await Promise.all(
        data.rules.map(rule => RuleModel.create({
          accommodation_id: accommodation.id,
          title: typeof rule === 'string' ? rule : (rule.title || 'Regla'),
          description: typeof rule === 'string' ? null : (rule.description || null)
        }))
      );
    }

    return this.findById(accommodation.id);
  }

  async findById(id) {
    const accommodation = await AccommodationModel.findByPk(id, {
      include: [
        { model: LocationModel, as: 'location' },
        { model: AmenityModel, as: 'amenities', through: { attributes: [] } },
        { model: require('../models/AccommodationPhotoModel'), as: 'photos' },
        { model: require('../models/RuleModel'), as: 'rules' }
      ]
    });

    if (!accommodation) return null;

    return {
      id: accommodation.id,
      landlordId: accommodation.landlord_id,
      title: accommodation.title,
      description: accommodation.description,
      price: Number(accommodation.price),
      currency: accommodation.currency,
      roomType: accommodation.room_type,
      status: accommodation.status,
      location: accommodation.location,
      amenities: accommodation.amenities || [],
      photos: accommodation.photos || [],
      rules: accommodation.rules || [],
      isFurnished: accommodation.is_furnished,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms,
      maxTenants: accommodation.max_tenants,
      areaM2: accommodation.area_m2 ? Number(accommodation.area_m2) : null,
      distanceToUniversityKm: accommodation.distance_to_university_km ? Number(accommodation.distance_to_university_km) : null,
      idealFor: accommodation.ideal_for,
      availableFrom: accommodation.available_from ? accommodation.available_from.toISOString ? accommodation.available_from.toISOString().slice(0, 10) : accommodation.available_from : null,
      availabilityNote: accommodation.availability_note
    };
  }

  async findAllPublished() {
    const accommodations = await AccommodationModel.findAll({
      where: { status: 'published' },
      include: [
        { model: LocationModel, as: 'location' },
        { model: AmenityModel, as: 'amenities', through: { attributes: [] } },
        { model: require('../models/AccommodationPhotoModel'), as: 'photos' },
        { model: require('../models/RuleModel'), as: 'rules' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return accommodations.map(accommodation => ({
      id: accommodation.id,
      landlordId: accommodation.landlord_id,
      title: accommodation.title,
      description: accommodation.description,
      price: Number(accommodation.price),
      currency: accommodation.currency,
      roomType: accommodation.room_type,
      status: accommodation.status,
      location: accommodation.location,
      amenities: accommodation.amenities || [],
      photos: accommodation.photos || [],
      rules: accommodation.rules || [],
      isFurnished: accommodation.is_furnished,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms,
      maxTenants: accommodation.max_tenants,
      areaM2: accommodation.area_m2 ? Number(accommodation.area_m2) : null,
      distanceToUniversityKm: accommodation.distance_to_university_km ? Number(accommodation.distance_to_university_km) : null,
      idealFor: accommodation.ideal_for,
      availableFrom: accommodation.available_from ? accommodation.available_from.toISOString ? accommodation.available_from.toISOString().slice(0, 10) : accommodation.available_from : null,
      availabilityNote: accommodation.availability_note
    }));
  }

  async findAllByLandlord(landlordId) {
    const accommodations = await AccommodationModel.findAll({
      where: { landlord_id: landlordId },
      include: [
        { model: LocationModel, as: 'location' },
        { model: AmenityModel, as: 'amenities', through: { attributes: [] } },
        { model: require('../models/AccommodationPhotoModel'), as: 'photos' },
        { model: require('../models/RuleModel'), as: 'rules' }
      ],
      order: [['createdAt', 'DESC']]
    });

    return accommodations.map(accommodation => ({
      id: accommodation.id,
      landlordId: accommodation.landlord_id,
      title: accommodation.title,
      description: accommodation.description,
      price: Number(accommodation.price),
      currency: accommodation.currency,
      roomType: accommodation.room_type,
      status: accommodation.status,
      location: accommodation.location,
      amenities: accommodation.amenities || [],
      photos: accommodation.photos || [],
      rules: accommodation.rules || [],
      isFurnished: accommodation.is_furnished,
      bedrooms: accommodation.bedrooms,
      bathrooms: accommodation.bathrooms,
      maxTenants: accommodation.max_tenants,
      areaM2: accommodation.area_m2 ? Number(accommodation.area_m2) : null,
      distanceToUniversityKm: accommodation.distance_to_university_km ? Number(accommodation.distance_to_university_km) : null,
      idealFor: accommodation.ideal_for,
      availableFrom: accommodation.available_from ? accommodation.available_from.toISOString ? accommodation.available_from.toISOString().slice(0, 10) : accommodation.available_from : null,
      availabilityNote: accommodation.availability_note
    }));
  }

  async update(id, payload) {
    const accommodation = await AccommodationModel.findByPk(id);
    if (!accommodation) {
      throw new Error('Alojamiento no encontrado');
    }

    const nextData = {
      ...(payload.title && { title: payload.title }),
      ...(payload.description && { description: payload.description }),
      ...(payload.price && { price: payload.price }),
      ...(payload.roomType && { room_type: payload.roomType }),
      ...(payload.status && { status: payload.status }),
      ...(payload.isFurnished !== undefined && { is_furnished: payload.isFurnished }),
      ...(payload.bedrooms !== undefined && { bedrooms: payload.bedrooms }),
      ...(payload.bathrooms !== undefined && { bathrooms: payload.bathrooms }),
      ...(payload.maxTenants !== undefined && { max_tenants: payload.maxTenants }),
      ...(payload.areaM2 !== undefined && { area_m2: payload.areaM2 }),
      ...(payload.distanceToUniversityKm !== undefined && { distance_to_university_km: payload.distanceToUniversityKm }),
      ...(payload.idealFor !== undefined && { ideal_for: payload.idealFor }),
      ...(payload.availableFrom !== undefined && { available_from: payload.availableFrom }),
      ...(payload.availabilityNote !== undefined && { availability_note: payload.availabilityNote })
    };

    if (Object.keys(nextData).length > 0) {
      await accommodation.update(nextData);
    }

    if (payload.locationId) {
      await accommodation.update({ location_id: payload.locationId });
    }

    if (payload.amenities) {
      const validAmenities = await AmenityModel.findAll({ where: { id: payload.amenities } });
      const validAmenityIds = validAmenities.map(item => item.id);
      if (validAmenityIds.length > 0) {
        await accommodation.setAmenities(validAmenityIds);
      }
    }

    if (payload.photos) {
      const PhotoModel = require('../models/AccommodationPhotoModel');
      await PhotoModel.destroy({ where: { accommodation_id: id } });
      await Promise.all(payload.photos.map((photo, index) => PhotoModel.create({
        accommodation_id: id,
        url: photo.url || photo,
        caption: photo.caption || '',
        is_cover: index === 0,
        order_index: index
      })));
    }

    if (payload.rules) {
      const RuleModel = require('../models/RuleModel');
      await RuleModel.destroy({ where: { accommodation_id: id } });
      await Promise.all(payload.rules.map(rule => RuleModel.create({
        accommodation_id: id,
        title: typeof rule === 'string' ? rule : (rule.title || 'Regla'),
        description: typeof rule === 'string' ? null : (rule.description || null)
      })));
    }

    return this.findById(id);
  }

  async delete(id) {
    const accommodation = await AccommodationModel.findByPk(id);
    if (!accommodation) {
      throw new Error('Alojamiento no encontrado');
    }

    await accommodation.destroy();
    return { deleted: true, id };
  }
}

module.exports = SequelizeAccommodationRepository;
