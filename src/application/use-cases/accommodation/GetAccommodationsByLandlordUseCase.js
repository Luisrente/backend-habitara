class GetAccommodationsByLandlordUseCase {
  constructor(accommodationRepository) {
    this.accommodationRepository = accommodationRepository;
  }

  async execute(landlordId) {
    if (!landlordId) {
      throw new Error('Se requiere el usuario propietario');
    }

    return this.accommodationRepository.findAllByLandlord(landlordId);
  }
}

module.exports = GetAccommodationsByLandlordUseCase;
