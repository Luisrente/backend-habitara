class CreateAccommodationUseCase {
  constructor(accommodationRepository) {
    this.accommodationRepository = accommodationRepository;
  }

  async execute({ landlordId, title, description, price, roomType, locationId, location, amenities, photos, rules, isFurnished, bedrooms, bathrooms, maxTenants, areaM2, distanceToUniversityKm, idealFor, availableFrom, availabilityNote }) {
    if (!landlordId || !title || !description || !price || !roomType) {
      throw new Error('Faltan datos obligatorios para la publicación');
    }

    if (!locationId) {
      throw new Error('La ubicación del alojamiento es obligatoria');
    }

    const accommodation = await this.accommodationRepository.create({
      landlordId,
      title,
      description,
      price,
      roomType,
      locationId,
      location,
      amenities: amenities || [],
      photos: photos || [],
      rules: rules || [],
      isFurnished: isFurnished || false,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      maxTenants: maxTenants || 1,
      areaM2,
      distanceToUniversityKm,
      idealFor,
      availableFrom,
      availabilityNote,
      status: 'published'
    });

    return accommodation;
  }
}

module.exports = CreateAccommodationUseCase;
