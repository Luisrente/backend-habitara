const express = require('express');
const AccommodationController = require('../controllers/AccommodationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const UserRole = require('../../../domain/user/enums/UserRole');

const router = express.Router();

router.get('/', AccommodationController.listPublished);

router.get(
  '/me',
  authMiddleware,
  roleMiddleware([UserRole.LANDLORD]),
  AccommodationController.listByLandlord
);

router.get('/:id', AccommodationController.getById);

router.post(
  '/',
  authMiddleware,
  roleMiddleware([UserRole.LANDLORD]),
  AccommodationController.create
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware([UserRole.LANDLORD]),
  AccommodationController.update
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware([UserRole.LANDLORD]),
  AccommodationController.delete
);

module.exports = router;
