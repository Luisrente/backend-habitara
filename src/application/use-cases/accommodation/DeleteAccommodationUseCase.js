class DeleteAccommodationUseCase {
  constructor(accommodationRepository) {
    this.accommodationRepository = accommodationRepository;
  }

  async execute(id) {
    if (!id) {
      throw new Error('ID de alojamiento requerido');
    }

    return this.accommodationRepository.delete(id);
  }
}

module.exports = DeleteAccommodationUseCase;
