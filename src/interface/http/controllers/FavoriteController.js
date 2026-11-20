const FavoriteModel = require('../../../infrastructure/db/sequelize/models/FavoriteModel');
const AccommodationModel = require('../../../infrastructure/db/sequelize/models/AccommodationModel');

class FavoriteController {
  async getFavorites(req, res) {
    try {
      const favorites = await FavoriteModel.findAll({
        where: { user_id: req.user.sub },
        attributes: ['accommodation_id'],
        order: [['createdAt', 'DESC']]
      });

      const accommodationIds = favorites.map((favorite) => favorite.accommodation_id);

      return res.status(200).json({
        success: true,
        data: { favorites: accommodationIds }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async toggleFavorite(req, res) {
    try {
      const { accommodationId } = req.body;

      if (!accommodationId) {
        throw new Error('Se requiere un accommodationId');
      }

      const existingFavorite = await FavoriteModel.findOne({
        where: {
          user_id: req.user.sub,
          accommodation_id: accommodationId
        }
      });

      if (existingFavorite) {
        await existingFavorite.destroy();

        const favorites = await FavoriteModel.findAll({
          where: { user_id: req.user.sub },
          attributes: ['accommodation_id']
        });

        return res.status(200).json({
          success: true,
          data: {
            favorites: favorites.map((item) => item.accommodation_id),
            isFavorite: false
          }
        });
      }

      await FavoriteModel.create({
        user_id: req.user.sub,
        accommodation_id: accommodationId
      });

      const favorites = await FavoriteModel.findAll({
        where: { user_id: req.user.sub },
        attributes: ['accommodation_id']
      });

      return res.status(200).json({
        success: true,
        data: {
          favorites: favorites.map((item) => item.accommodation_id),
          isFavorite: true
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new FavoriteController();
