const UserModel = require('../models/UserModel');

class SequelizeUserRepository {
  async create(data) {
    const user = await UserModel.create({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password_hash: data.passwordHash,
      phone: data.phone,
      role: data.role,
      status: data.status,
      is_verified: data.isVerified,
      avatar_url: data.avatarUrl
    });

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      passwordHash: user.password_hash,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.is_verified,
      avatarUrl: user.avatar_url
    };
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      passwordHash: user.password_hash,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.is_verified,
      avatarUrl: user.avatar_url
    };
  }

  async findById(id) {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      passwordHash: user.password_hash,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.is_verified,
      avatarUrl: user.avatar_url
    };
  }

  async update(id, data) {
    const user = await UserModel.findByPk(id);
    if (!user) return null;

    const nextData = {
      ...(data.firstName !== undefined && { first_name: data.firstName }),
      ...(data.lastName !== undefined && { last_name: data.lastName }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.email !== undefined && { email: data.email }),
      ...(data.role !== undefined && { role: data.role }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.avatarUrl !== undefined && { avatar_url: data.avatarUrl })
    };

    await user.update(nextData);

    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      passwordHash: user.password_hash,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.is_verified,
      avatarUrl: user.avatar_url
    };
  }
}

module.exports = SequelizeUserRepository;
