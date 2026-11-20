const sequelize = require('./index');
const AmenityModel = require('./models/AmenityModel');
const LandlordRequestModel = require('./models/LandlordRequestModel');
const UserModel = require('./models/UserModel');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const defaultAmenities = [
  { name: 'Internet', category: 'conectividad', icon_name: 'wifi' },
  { name: 'Agua', category: 'servicios', icon_name: 'droplet' },
  { name: 'Luz', category: 'servicios', icon_name: 'zap' },
  { name: 'Gas', category: 'servicios', icon_name: 'flame' },
  { name: 'Amueblado', category: 'mobiliario', icon_name: 'sofa' },
  { name: 'Seguridad', category: 'seguridad', icon_name: 'shield' },
  { name: 'Limpieza', category: 'servicios', icon_name: 'sparkles' },
  { name: 'Cocina', category: 'cocina', icon_name: 'chef-hat' }
];

async function seedDefaultAmenities() {
  for (const amenity of defaultAmenities) {
    await AmenityModel.findOrCreate({
      where: { name: amenity.name },
      defaults: amenity
    });
  }
}

async function ensureLandlordRequestColumns() {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable('landlord_requests').catch(() => null);

  if (!table) {
    await LandlordRequestModel.sync({ alter: false });
    return;
  }

  const columns = {
    national_id: { type: DataTypes.STRING(30), allowNull: false, defaultValue: '' },
    id_document_photo: { type: DataTypes.TEXT('medium'), allowNull: false, defaultValue: '' },
    education_level: { type: DataTypes.STRING(80), allowNull: false, defaultValue: '' },
    criminal_record_status: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'No registrado' },
    criminal_record_document: { type: DataTypes.TEXT('medium'), allowNull: true },
    terms_accepted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  };

  for (const [name, definition] of Object.entries(columns)) {
    if (!table[name]) {
      await queryInterface.addColumn('landlord_requests', name, definition);
    }
  }

  // Ampliar columnas de foto/documento a MEDIUMTEXT si aún son TEXT (64KB)
  // para soportar imágenes base64 que superan ese límite
  const photoColumns = ['id_document_photo', 'criminal_record_document'];
  for (const col of photoColumns) {
    if (table[col] && table[col].type === 'TEXT') {
      await sequelize.query(
        `ALTER TABLE landlord_requests MODIFY COLUMN ${col} MEDIUMTEXT`
      ).catch(() => {/* ya es MEDIUMTEXT o no hay permisos */});
    }
  }
}

async function ensureAdminUser() {
  const passwordHash = await bcrypt.hash('Admin123!', 10);
  await UserModel.findOrCreate({
    where: { email: 'admin@habitara.com' },
    defaults: {
      first_name: 'Administrador',
      last_name: 'HABITARA',
      email: 'admin@habitara.com',
      password_hash: passwordHash,
      phone: '',
      role: 'admin',
      status: 'active',
      is_verified: true
    }
  });
}

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    await seedDefaultAmenities();
    await sequelize.sync({ alter: false, force: false });
    await ensureLandlordRequestColumns();
    await ensureAdminUser();
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error.message || error);
    console.warn('⚠️ La aplicación continuará con el arranque aunque la base de datos ya tenga un estado de esquema no sincronizado.');
  }
}

module.exports = syncDatabase;
