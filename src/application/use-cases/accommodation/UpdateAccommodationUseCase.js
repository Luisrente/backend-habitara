class UpdateAccommodationUseCase {
  constructor(accommodationRepository) {
    this.accommodationRepository = accommodationRepository;
  }

  async execute(id, payload) {
    if (!id) {
      throw new Error('ID de alojamiento requerido');
    }

    return this.accommodationRepository.update(id, payload);
  }
}

module.exports = UpdateAccommodationUseCase;
