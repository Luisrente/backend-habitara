const express = require('express');
const ReservationController = require('../controllers/ReservationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const UserRole = require('../../../domain/user/enums/UserRole');

const router = express.Router();

router.get('/me', authMiddleware, roleMiddleware([UserRole.TENANT]), ReservationController.listByTenant);
router.post('/', authMiddleware, roleMiddleware([UserRole.TENANT]), ReservationController.create);
router.get('/landlord', authMiddleware, roleMiddleware([UserRole.LANDLORD]), ReservationController.listByLandlord);
router.patch('/:id/status', authMiddleware, roleMiddleware([UserRole.LANDLORD]), ReservationController.updateStatus);
router.get('/accommodation/:accommodationId/booked-dates', ReservationController.listBookedDatesByAccommodation);

module.exports = router;
