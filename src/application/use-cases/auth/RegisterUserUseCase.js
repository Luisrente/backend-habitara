const bcrypt = require('bcryptjs');
const UserRole = require('../../../domain/user/enums/UserRole');

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ firstName, lastName, email, password, phone, role }) {
    if (!firstName || !lastName || !email || !password) {
      throw new Error('Faltan campos requeridos');
    }

    const validRoles = [UserRole.LANDLORD, UserRole.TENANT];
    if (!validRoles.includes(role)) {
      throw new Error('Rol no válido');
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      passwordHash,
      phone,
      role,
      status: 'active',
      isVerified: false
    });

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    };
  }
}

module.exports = RegisterUserUseCase;
