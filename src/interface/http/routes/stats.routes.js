const express = require('express');
const StatsController = require('../controllers/StatsController');
const authMiddleware  = require('../middlewares/authMiddleware');
const roleMiddleware  = require('../middlewares/roleMiddleware');
const UserRole        = require('../../../domain/user/enums/UserRole');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware([UserRole.ADMIN]), StatsController.overview);

module.exports = router;
