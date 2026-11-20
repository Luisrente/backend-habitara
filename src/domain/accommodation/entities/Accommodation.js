class Accommodation {
  constructor({
    id,
    landlordId,
    title,
    description,
    price,
    currency,
    roomType,
    status,
    location,
    isFurnished,
    bedrooms,
    bathrooms,
    maxTenants,
    amenities = [],
    photos = [],
    rules = []
  }) {
    this.id = id;
    this.landlordId = landlordId;
    this.title = title;
    this.description = description;
    this.price = price;
    this.currency = currency || 'COP';
    this.roomType = roomType;
    this.status = status || 'draft';
    this.location = location;
    this.isFurnished = isFurnished || false;
    this.bedrooms = bedrooms || 1;
    this.bathrooms = bathrooms || 1;
    this.maxTenants = maxTenants || 1;
    this.amenities = amenities;
    this.photos = photos;
    this.rules = rules;
  }
}

module.exports = Accommodation;
