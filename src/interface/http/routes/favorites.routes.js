const express = require('express');
const FavoriteController = require('../controllers/FavoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, FavoriteController.getFavorites);
router.post('/', authMiddleware, FavoriteController.toggleFavorite);

module.exports = router;
