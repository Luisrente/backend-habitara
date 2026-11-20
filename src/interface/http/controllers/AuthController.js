const RegisterUserUseCase = require('../../../application/use-cases/auth/RegisterUserUseCase');
const LoginUserUseCase = require('../../../application/use-cases/auth/LoginUserUseCase');
const SequelizeUserRepository = require('../../../infrastructure/db/sequelize/repositories/SequelizeUserRepository');

class AuthController {
  async register(req, res) {
    try {
      const repository = new SequelizeUserRepository();
      const useCase = new RegisterUserUseCase(repository);

      const result = await useCase.execute(req.body);

      return res.status(201).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const repository = new SequelizeUserRepository();
      const useCase = new LoginUserUseCase(repository);

      const result = await useCase.execute(req.body);

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async me(req, res) {
    try {
      const repository = new SequelizeUserRepository();
      const user = await repository.findById(req.user.sub);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const repository = new SequelizeUserRepository();
      const userId = req.user.sub;
      const { firstName, lastName, phone, email } = req.body;

      if (!firstName && !lastName && !phone && !email) {
        return res.status(400).json({
          success: false,
          message: 'No hay campos para actualizar'
        });
      }

      const updatedUser = await repository.update(userId, { firstName, lastName, phone, email });

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
