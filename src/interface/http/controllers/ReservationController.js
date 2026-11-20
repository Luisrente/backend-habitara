const { Op } = require('sequelize');
const ReservationModel = require('../../../infrastructure/db/sequelize/models/ReservationModel');
const AccommodationModel = require('../../../infrastructure/db/sequelize/models/AccommodationModel');
const UserModel = require('../../../infrastructure/db/sequelize/models/UserModel');

class ReservationController {
  async create(req, res) {
    try {
      const { accommodationId, startDate, endDate } = req.body;

      if (!accommodationId) {
        throw new Error('Falta el alojamiento a reservar');
      }

      if (!startDate || !endDate) {
        throw new Error('Debes elegir fecha de inicio y fin');
      }

      const start = new Date(`${startDate}T00:00:00`);
      const end = new Date(`${endDate}T00:00:00`);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
        throw new Error('La fecha final debe ser posterior a la de inicio');
      }

      const accommodation = await AccommodationModel.findByPk(accommodationId);
      if (!accommodation) {
        throw new Error('No se encontró el alojamiento');
      }

      const overlappingReservation = await ReservationModel.findOne({
        where: {
          accommodation_id: accommodationId,
          status: { [Op.ne]: 'cancelled' },
          [Op.and]: [
            { start_date: { [Op.lte]: endDate } },
            { end_date: { [Op.gte]: startDate } }
          ]
        }
      });

      if (overlappingReservation) {
        throw new Error('Ese rango de fechas ya tiene una reserva activa');
      }

      const nightlyRate = Number(accommodation.price || 0);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      const totalPrice = (nightlyRate * days).toFixed(2);

      const reservation = await ReservationModel.create({
        accommodation_id: accommodationId,
        tenant_id: req.user.sub,
        landlord_id: accommodation.landlord_id,
        start_date: startDate,
        end_date: endDate,
        status: 'pending',
        total_price: totalPrice
      });

      return res.status(201).json({
        success: true,
        data: reservation,
        message: 'Reserva creada correctamente. El arrendador la revisará.'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const validStatuses = ['pending', 'confirmed', 'cancelled'];

      if (!validStatuses.includes(status)) {
        throw new Error('El estado enviado no es válido');
      }

      const reservation = await ReservationModel.findOne({
        where: {
          id,
          landlord_id: req.user.sub
        }
      });

      if (!reservation) {
        return res.status(404).json({
          success: false,
          message: 'No se encontró la reserva para este propietario'
        });
      }

      if (reservation.status !== 'pending') {
        return res.status(409).json({
          success: false,
          message: 'La reserva ya fue actualizada y no puede cambiar de estado otra vez'
        });
      }

      await reservation.update({ status });

      return res.status(200).json({
        success: true,
        data: {
          id: reservation.id,
          status: reservation.status
        },
        message: 'Estado de la reserva actualizado correctamente'
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async listByTenant(req, res) {
    try {
      const reservations = await ReservationModel.findAll({
        where: { tenant_id: req.user.sub },
        include: [{
          model: AccommodationModel,
          as: 'accommodation',
          attributes: ['id', 'title', 'price', 'room_type', 'currency', 'location_id']
        }],
        order: [['createdAt', 'DESC']]
      });

      const payload = reservations.map((reservation) => ({
        id: reservation.id,
        status: reservation.status,
        startDate: reservation.start_date,
        endDate: reservation.end_date,
        totalPrice: reservation.total_price,
        createdAt: reservation.createdAt,
        accommodation: reservation.accommodation ? {
          id: reservation.accommodation.id,
          title: reservation.accommodation.title,
          price: reservation.accommodation.price,
          roomType: reservation.accommodation.room_type,
          currency: reservation.accommodation.currency
        } : null
      }));

      return res.status(200).json({
        success: true,
        data: payload
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async listByLandlord(req, res) {
    try {
      const reservations = await ReservationModel.findAll({
        where: { landlord_id: req.user.sub },
        include: [
          {
            model: AccommodationModel,
            as: 'accommodation',
            attributes: ['id', 'title', 'price', 'room_type', 'currency']
          },
          {
            model: UserModel,
            as: 'tenant',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const payload = reservations.map((reservation) => ({
        id: reservation.id,
        status: reservation.status,
        startDate: reservation.start_date,
        endDate: reservation.end_date,
        totalPrice: reservation.total_price,
        createdAt: reservation.createdAt,
        tenant: reservation.tenant ? {
          id: reservation.tenant.id,
          firstName: reservation.tenant.first_name,
          lastName: reservation.tenant.last_name,
          email: reservation.tenant.email
        } : null,
        accommodation: reservation.accommodation ? {
          id: reservation.accommodation.id,
          title: reservation.accommodation.title,
          price: reservation.accommodation.price,
          roomType: reservation.accommodation.room_type,
          currency: reservation.accommodation.currency
        } : null
      }));

      return res.status(200).json({
        success: true,
        data: payload
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async listBookedDatesByAccommodation(req, res) {
    try {
      const { accommodationId } = req.params;

      const reservations = await ReservationModel.findAll({
        where: {
          accommodation_id: accommodationId,
          status: { [Op.ne]: 'cancelled' }
        },
        attributes: ['start_date', 'end_date']
      });

      const bookedDates = [];

      reservations.forEach((reservation) => {
        const start = new Date(`${reservation.start_date}T00:00:00`);
        const end = new Date(`${reservation.end_date}T00:00:00`);
        const cursor = new Date(start);

        while (cursor <= end) {
          const iso = new Date(cursor.getTime() - (cursor.getTimezoneOffset() * 60000))
            .toISOString()
            .slice(0, 10);
          bookedDates.push(iso);
          cursor.setDate(cursor.getDate() + 1);
        }
      });

      return res.status(200).json({
        success: true,
        data: [...new Set(bookedDates)]
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ReservationController();
