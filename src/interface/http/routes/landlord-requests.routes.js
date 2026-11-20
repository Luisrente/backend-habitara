const express = require('express');
const LandlordRequestController = require('../controllers/LandlordRequestController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const UserRole = require('../../../domain/user/enums/UserRole');

const router = express.Router();

router.post('/', authMiddleware, LandlordRequestController.create);
router.get('/admin', authMiddleware, roleMiddleware([UserRole.ADMIN]), LandlordRequestController.listForAdmin);
router.patch('/:id/status', authMiddleware, roleMiddleware([UserRole.ADMIN]), LandlordRequestController.updateStatus);
router.get('/mine', authMiddleware, LandlordRequestController.mine);

module.exports = router;
