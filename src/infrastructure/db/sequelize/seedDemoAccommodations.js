const sequelize = require('./index');
const UserModel = require('./models/UserModel');
const UniversityModel = require('./models/UniversityModel');
const LocationModel = require('./models/LocationModel');
const AmenityModel = require('./models/AmenityModel');
const AccommodationModel = require('./models/AccommodationModel');
const AccommodationAmenityModel = require('./models/AccommodationAmenityModel');
const AccommodationPhotoModel = require('./models/AccommodationPhotoModel');
const RuleModel = require('./models/RuleModel');

async function clearAccommodationData() {
  await AccommodationPhotoModel.destroy({ where: {}, force: true });
  await RuleModel.destroy({ where: {}, force: true });
  await AccommodationAmenityModel.destroy({ where: {}, force: true });
  await AccommodationModel.destroy({ where: {}, force: true });
  await LocationModel.destroy({ where: {}, force: true });
}

async function ensureLandlord() {
  const [landlord] = await UserModel.findOrCreate({
    where: { email: 'demo.landlord@habitara.com' },
    defaults: {
      first_name: 'Luis',
      last_name: 'Arrendador',
      email: 'demo.landlord@habitara.com',
      password_hash: '$2a$10$Y0k7JmN2oM5r7EMpUo.G1ORPX5e0CRvQ9W0JfJ3M9FwzNfPwN5trG',
      phone: '+51 999 123 456',
      role: 'landlord',
      status: 'active',
      is_verified: true
    }
  });

  return landlord;
}

async function ensureUniversities() {
  const universityNames = [
    'Universidad Nacional Mayor de San Marcos',
    'Pontificia Universidad Católica del Perú',
    'Universidad Peruana de Ciencias Aplicadas',
    'Universidad San Ignacio de Loyola'
  ];

  const universities = {};

  for (const name of universityNames) {
    const [university] = await UniversityModel.findOrCreate({
      where: { name },
      defaults: {
        name,
        city: 'Lima',
        state: 'Lima',
        country: 'Perú'
      }
    });

    universities[name] = university;
  }

  return universities;
}

async function createLocations(universities) {
  const locationDefinitions = [
    {
      address: 'Av. Brasil 123',
      district: 'Miraflores',
      city: 'Lima',
      state: 'Lima',
      country: 'Perú',
      postal_code: '15074',
      university_id: universities['Universidad Nacional Mayor de San Marcos'].id
    },
    {
      address: 'Jr. Angamos 456',
      district: 'San Isidro',
      city: 'Lima',
      state: 'Lima',
      country: 'Perú',
      postal_code: '15046',
      university_id: universities['Pontificia Universidad Católica del Perú'].id
    },
    {
      address: 'Calle Los Jazmines 89',
      district: 'Surco',
      city: 'Lima',
      state: 'Lima',
      country: 'Perú',
      postal_code: '15023',
      university_id: universities['Universidad Peruana de Ciencias Aplicadas'].id
    },
    {
      address: 'Pasaje Primavera 20',
      district: 'San Miguel',
      city: 'Lima',
      state: 'Lima',
      country: 'Perú',
      postal_code: '15088',
      university_id: universities['Universidad San Ignacio de Loyola'].id
    },
    {
      address: 'Av. Benavides 315',
      district: 'Santiago de Surco',
      city: 'Lima',
      state: 'Lima',
      country: 'Perú',
      postal_code: '15039',
      university_id: universities['Universidad Peruana de Ciencias Aplicadas'].id
    }
  ];

  const locations = [];
  for (const definition of locationDefinitions) {
    const location = await LocationModel.create(definition);
    locations.push(location);
  }

  return locations;
}

async function createSampleAccommodations(landlord, locations) {
  const amenityNames = ['Internet', 'Agua', 'Luz', 'Gas', 'Amueblado', 'Seguridad', 'Limpieza', 'Cocina'];
  const amenitiesByName = {};

  for (const name of amenityNames) {
    const amenity = await AmenityModel.findOne({ where: { name } });
    if (amenity) {
      amenitiesByName[name] = amenity;
    }
  }

  const accommodations = [
    {
      title: 'Habitación privada en Miraflores',
      description: 'Habitación moderna con excelente iluminación, internet de alta velocidad y acceso a cocina compartida. Ideal para estudiantes o profesionales.',
      price: 650,
      currency: 'USD',
      room_type: 'room',
      status: 'published',
      is_furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      max_tenants: 2,
      location_id: locations[0].id,
      landlord_id: landlord.id,
      amenityNames: ['Internet', 'Agua', 'Luz', 'Seguridad', 'Amueblado'],
      photos: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: [
        { title: 'No fumar', description: 'Se prohíbe fumar dentro del inmueble.' },
        { title: 'Horario de ingreso', description: 'Ingreso permitido entre 6:00 y 22:00 hrs.' }
      ]
    },
    {
      title: 'Loft estudiantil cerca de la PUCP',
      description: 'Espacio cómodo con cama queen, escritorio, ventilación natural y acceso a lavandería. Muy cerca de universidades y transporte.',
      price: 820,
      currency: 'USD',
      room_type: 'apartment',
      status: 'published',
      is_furnished: true,
      bedrooms: 2,
      bathrooms: 1,
      max_tenants: 3,
      location_id: locations[1].id,
      landlord_id: landlord.id,
      amenityNames: ['Internet', 'Agua', 'Gas', 'Cocina', 'Limpieza', 'Seguridad'],
      photos: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: [
        { title: 'Mantenimiento', description: 'Requiere respeto por las áreas comunes.' },
        { title: 'Mascotas', description: 'No se admiten mascotas en el piso.' }
      ]
    },
    {
      title: 'Departamento moderno en San Isidro',
      description: 'Apartamento elegante con balcón, cocina completa y acceso a gimnasio. Perfecto para estudiantes que buscan calidad de vida.',
      price: 980,
      currency: 'USD',
      room_type: 'apartment',
      status: 'published',
      is_furnished: true,
      bedrooms: 2,
      bathrooms: 2,
      max_tenants: 4,
      location_id: locations[2].id,
      landlord_id: landlord.id,
      amenityNames: ['Internet', 'Agua', 'Luz', 'Gas', 'Cocina', 'Seguridad', 'Amueblado'],
      photos: [
        'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: [
        { title: 'Silencio', description: 'Mantener un nivel de ruido bajo después de las 22:00 hrs.' },
        { title: 'Compartición', description: 'Uso responsable de zonas comunes.' }
      ]
    },
    {
      title: 'Habitación con vista al parque',
      description: 'Habitación tranquila en zona residencial, ideal para estudiantes y profesionales que buscan comodidad y seguridad.',
      price: 720,
      currency: 'USD',
      room_type: 'room',
      status: 'published',
      is_furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      max_tenants: 2,
      location_id: locations[3].id,
      landlord_id: landlord.id,
      amenityNames: ['Internet', 'Agua', 'Luz', 'Seguridad', 'Limpieza'],
      photos: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: [
        { title: 'Lavandería', description: 'Uso del área de lavandería en horario de 8:00 a 20:00.' },
        { title: 'Visitas', description: 'Las visitas se reciben previa coordinación.' }
      ]
    },
    {
      title: 'Studio funcional cerca a campus',
      description: 'Studio pequeño pero muy bien distribuido para una persona. Cuenta con wifi, cama, kitchenette y buena iluminación.',
      price: 590,
      currency: 'USD',
      room_type: 'studio',
      status: 'published',
      is_furnished: true,
      bedrooms: 1,
      bathrooms: 1,
      max_tenants: 1,
      location_id: locations[4].id,
      landlord_id: landlord.id,
      amenityNames: ['Internet', 'Agua', 'Luz', 'Gas', 'Cocina', 'Amueblado'],
      photos: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80'
      ],
      rules: [
        { title: 'Limpieza', description: 'Se solicita mantener orden del estudio.' },
        { title: 'Pago', description: 'Pago mensual puntual antes del día 5.' }
      ]
    }
  ];

  for (const accommodationData of accommodations) {
    const accommodation = await AccommodationModel.create({
      landlord_id: accommodationData.landlord_id,
      location_id: accommodationData.location_id,
      title: accommodationData.title,
      description: accommodationData.description,
      price: accommodationData.price,
      currency: accommodationData.currency,
      room_type: accommodationData.room_type,
      status: accommodationData.status,
      is_furnished: accommodationData.is_furnished,
      bedrooms: accommodationData.bedrooms,
      bathrooms: accommodationData.bathrooms,
      max_tenants: accommodationData.max_tenants
    });

    const amenityIds = accommodationData.amenityNames
      .map((name) => amenitiesByName[name])
      .filter(Boolean)
      .map((amenity) => amenity.id);

    if (amenityIds.length > 0) {
      await accommodation.setAmenities(amenityIds);
    }

    for (const [index, photoUrl] of accommodationData.photos.entries()) {
      await AccommodationPhotoModel.create({
        accommodation_id: accommodation.id,
        url: photoUrl,
        caption: accommodationData.title,
        is_cover: index === 0,
        order_index: index
      });
    }

    for (const rule of accommodationData.rules) {
      await RuleModel.create({
        accommodation_id: accommodation.id,
        title: rule.title,
        description: rule.description
      });
    }
  }
}

async function seedDemoData() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    await clearAccommodationData();
    console.log('🧹 Registros de alojamientos eliminados.');

    const landlord = await ensureLandlord();
    const universities = await ensureUniversities();
    const locations = await createLocations(universities);
    await createSampleAccommodations(landlord, locations);

    console.log('✅ Datos de ejemplo creados con éxito.');
    console.log(`👤 Landlord: ${landlord.email}`);
    console.log(`📍 Ubicaciones creadas: ${locations.length}`);
  } catch (error) {
    console.error('❌ Error al limpiar y sembrar datos de ejemplo:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedDemoData();
