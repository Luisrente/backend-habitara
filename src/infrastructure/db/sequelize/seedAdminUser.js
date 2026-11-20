const bcrypt = require('bcryptjs');
const sequelize = require('./index');
const UserModel = require('./models/UserModel');

async function seedAdminUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos exitosa.');

    const password = 'Admin1234!';
    const password_hash = await bcrypt.hash(password, 10);

    const [admin, created] = await UserModel.findOrCreate({
      where: { email: 'admin@habitara.com' },
      defaults: {
        first_name: 'Admin',
        last_name: 'Habitara',
        email: 'admin@habitara.com',
        password_hash,
        phone: null,
        role: 'admin',
        status: 'active',
        is_verified: true
      }
    });

    if (created) {
      console.log('✅ Usuario admin creado exitosamente.');
    } else {
      console.log('ℹ️  El usuario admin ya existe.');
    }

    console.log(`📧 Email:    ${admin.email}`);
    console.log(`🔑 Password: ${password}`);
    console.log(`👤 Rol:      ${admin.role}`);
  } catch (error) {
    console.error('❌ Error al crear el usuario admin:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

seedAdminUser();
