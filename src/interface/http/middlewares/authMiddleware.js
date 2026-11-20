const jwt = require('jsonwebtoken');
const env = require('../../../config/env');
const UserModel = require('../../../infrastructure/db/sequelize/models/UserModel');

/**
 * authMiddleware
 * Verifica el JWT y consulta el rol actual del usuario en la DB.
 * Esto evita que un token emitido cuando el usuario era 'tenant'
 * bloquee el acceso después de que su rol cambie a 'landlord'.
 */
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Token no proporcionado'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // Consultar el rol fresco desde la DB para que cambios de rol
    // (ej. tenant → landlord al aprobar solicitud) se reflejen de inmediato
    const user = await UserModel.findByPk(decoded.sub, {
      attributes: ['id', 'email', 'role', 'status']
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Cuenta inactiva o suspendida'
      });
    }

    req.user = {
      sub: decoded.sub,
      email: user.email,
      role: user.role   // rol siempre fresco desde la DB
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
}

module.exports = authMiddleware;
