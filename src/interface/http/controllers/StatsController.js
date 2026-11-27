const { fn, col } = require('sequelize');
const UserModel            = require('../../../infrastructure/db/sequelize/models/UserModel');
const AccommodationModel   = require('../../../infrastructure/db/sequelize/models/AccommodationModel');
const LocationModel        = require('../../../infrastructure/db/sequelize/models/LocationModel');
const ReservationModel     = require('../../../infrastructure/db/sequelize/models/ReservationModel');
const FavoriteModel        = require('../../../infrastructure/db/sequelize/models/FavoriteModel');
const LandlordRequestModel = require('../../../infrastructure/db/sequelize/models/LandlordRequestModel');
const ConversationModel    = require('../../../infrastructure/db/sequelize/models/ConversationModel');
const MessageModel         = require('../../../infrastructure/db/sequelize/models/MessageModel');

function countBy(rows, key) {
  return rows.reduce((acc, r) => {
    const k = r[key] ?? 'unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
}

class StatsController {
  async overview(req, res) {
    try {
      const since30 = new Date(Date.now() - 30 * 86400000);

      const [users, accommodations, reservations, requests, favorites, conversations, messages] = await Promise.all([
        UserModel.findAll({ attributes: ['id', 'role', 'createdAt'], raw: true }),
        AccommodationModel.findAll({
          attributes: ['id', 'title', 'price', 'status'],
          include: [{ model: LocationModel, as: 'location', attributes: ['city', 'district'] }],
        }),
        ReservationModel.findAll({
          attributes: ['id', 'status', 'total_price', 'accommodation_id', 'createdAt'],
          raw: true,
        }),
        LandlordRequestModel.findAll({ attributes: ['id', 'status'], raw: true }),
        FavoriteModel.findAll({
          attributes: ['accommodation_id', [fn('COUNT', col('id')), 'count']],
          group: ['accommodation_id'],
          raw: true,
        }),
        ConversationModel.count(),
        MessageModel.count(),
      ]);

      const accById = new Map(accommodations.map(a => [a.id, a]));

      const confirmed = reservations.filter(r => r.status === 'confirmed');
      const revenue = confirmed.reduce((s, r) => s + Number(r.total_price || 0), 0);

      // Last 6 calendar months, oldest first
      const now = new Date();
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, reservations: 0, revenue: 0 });
      }
      const monthIdx = new Map(months.map((m, i) => [m.key, i]));
      reservations.forEach(r => {
        const d = new Date(r.createdAt);
        const i = monthIdx.get(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        if (i === undefined) return;
        months[i].reservations += 1;
        if (r.status === 'confirmed') months[i].revenue += Number(r.total_price || 0);
      });

      const cityCounts = {};
      accommodations.forEach(a => {
        const raw = (a.location?.city || '').trim();
        const key = raw.toLocaleLowerCase('es') || 'sin ciudad';
        if (!cityCounts[key]) {
          const name = raw ? raw.charAt(0).toLocaleUpperCase('es') + raw.slice(1).toLocaleLowerCase('es') : 'Sin ciudad';
          cityCounts[key] = { city: name, count: 0 };
        }
        cityCounts[key].count += 1;
      });
      const byCity = Object.values(cityCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6);

      const resPerAcc = countBy(reservations, 'accommodation_id');
      const topReserved = Object.entries(resPerAcc)
        .map(([id, count]) => ({ id: Number(id), title: accById.get(Number(id))?.title || `#${id}`, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const topFavorited = favorites
        .map(f => ({
          id: f.accommodation_id,
          title: accById.get(f.accommodation_id)?.title || `#${f.accommodation_id}`,
          count: Number(f.count),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const prices = accommodations.map(a => Number(a.price || 0)).filter(p => p > 0);

      return res.status(200).json({
        success: true,
        data: {
          users: {
            total: users.length,
            byRole: countBy(users, 'role'),
            newLast30: users.filter(u => new Date(u.createdAt) >= since30).length,
          },
          accommodations: {
            total: accommodations.length,
            byStatus: countBy(accommodations.map(a => ({ status: a.status })), 'status'),
            avgPrice: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0,
            byCity,
          },
          reservations: {
            total: reservations.length,
            byStatus: countBy(reservations, 'status'),
            revenue,
            monthly: months,
            topReserved,
          },
          landlordRequests: { total: requests.length, byStatus: countBy(requests, 'status') },
          favorites: { total: favorites.reduce((s, f) => s + Number(f.count), 0), topFavorited },
          messaging: { conversations, messages },
        },
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new StatsController();
