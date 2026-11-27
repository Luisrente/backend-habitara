const { Op }            = require('sequelize');
const ConversationModel = require('../../../infrastructure/db/sequelize/models/ConversationModel');
const MessageModel      = require('../../../infrastructure/db/sequelize/models/MessageModel');
const ReservationModel  = require('../../../infrastructure/db/sequelize/models/ReservationModel');
const UserModel         = require('../../../infrastructure/db/sequelize/models/UserModel');
const AccommodationModel = require('../../../infrastructure/db/sequelize/models/AccommodationModel');

class MessageController {

  // GET /messages/conversations/my — lista todas las conversaciones del usuario
  async listMine(req, res) {
    try {
      const userId = parseInt(req.user.sub, 10);

      const conversations = await ConversationModel.findAll({
        where: { [Op.or]: [{ landlord_id: userId }, { tenant_id: userId }] },
        include: [
          { model: UserModel, as: 'tenant',   attributes: ['id', 'first_name', 'last_name'] },
          { model: UserModel, as: 'landlord', attributes: ['id', 'first_name', 'last_name'] },
          { model: AccommodationModel, as: 'accommodation', attributes: ['id', 'title'] },
          {
            model: MessageModel,
            as: 'messages',
            attributes: ['content', 'createdAt', 'sender_id'],
            limit: 1,
            order: [['createdAt', 'DESC']],
            separate: true,
          },
        ],
        order: [['last_message_at', 'DESC'], ['createdAt', 'DESC']],
      });

      const payload = conversations.map(c => {
        const isLandlord = c.landlord_id === userId;
        const other      = isLandlord ? c.tenant : c.landlord;
        const lastMsg    = c.messages?.[0] || null;
        return {
          id:              c.id,
          otherName:       other ? `${other.first_name} ${other.last_name}`.trim() : 'Usuario',
          accommodationTitle: c.accommodation?.title || '',
          lastMessage:     lastMsg?.content || null,
          lastMessageAt:   lastMsg?.createdAt || c.createdAt,
          lastSenderIsMe:  lastMsg?.sender_id === userId,
        };
      });

      return res.status(200).json({ success: true, data: payload });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET/POST /messages/conversations  — crea o recupera la conversación de una reserva
  async getOrCreateConversation(req, res) {
    try {
      const userId = req.user.sub;
      const { reservationId } = req.body;

      const reservation = await ReservationModel.findByPk(reservationId);
      if (!reservation) {
        return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
      }

      // Solo el landlord o el tenant de esta reserva pueden acceder
      if (reservation.landlord_id !== userId && reservation.tenant_id !== userId) {
        return res.status(403).json({ success: false, message: 'Sin acceso a esta reserva' });
      }

      const [conversation] = await ConversationModel.findOrCreate({
        where: {
          accommodation_id: reservation.accommodation_id,
          landlord_id:      reservation.landlord_id,
          tenant_id:        reservation.tenant_id,
        },
        defaults: { status: 'open' },
      });

      return res.status(200).json({ success: true, data: { conversationId: conversation.id } });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // GET /messages/conversations/:conversationId
  async getMessages(req, res) {
    try {
      const userId = req.user.sub;
      const { conversationId } = req.params;

      const conversation = await ConversationModel.findByPk(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversación no encontrada' });
      }

      if (conversation.landlord_id !== userId && conversation.tenant_id !== userId) {
        return res.status(403).json({ success: false, message: 'Sin acceso a esta conversación' });
      }

      const messages = await MessageModel.findAll({
        where: { conversation_id: conversationId },
        include: [
          { model: UserModel, as: 'sender', attributes: ['id', 'first_name', 'last_name'] },
        ],
        order: [['createdAt', 'ASC']],
      });

      const payload = messages.map(m => ({
        id:        m.id,
        content:   m.content,
        senderId:  m.sender_id,
        senderName:`${m.sender?.first_name || ''} ${m.sender?.last_name || ''}`.trim(),
        createdAt: m.createdAt,
        mine:      m.sender_id === userId,
      }));

      return res.status(200).json({ success: true, data: payload });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }

  // POST /messages/conversations/:conversationId
  async sendMessage(req, res) {
    try {
      const userId = req.user.sub;
      const { conversationId } = req.params;
      const { content } = req.body;

      if (!content?.trim()) {
        return res.status(400).json({ success: false, message: 'El mensaje no puede estar vacío' });
      }

      const conversation = await ConversationModel.findByPk(conversationId);
      if (!conversation) {
        return res.status(404).json({ success: false, message: 'Conversación no encontrada' });
      }

      if (conversation.landlord_id !== userId && conversation.tenant_id !== userId) {
        return res.status(403).json({ success: false, message: 'Sin acceso a esta conversación' });
      }

      const receiverId = conversation.landlord_id === userId
        ? conversation.tenant_id
        : conversation.landlord_id;

      const message = await MessageModel.create({
        conversation_id: conversationId,
        sender_id:       userId,
        receiver_id:     receiverId,
        content:         content.trim(),
        message_type:    'text',
      });

      await conversation.update({ last_message_at: new Date() });

      return res.status(201).json({
        success: true,
        data: {
          id:        message.id,
          content:   message.content,
          senderId:  message.sender_id,
          createdAt: message.createdAt,
          mine:      true,
        },
      });
    } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
  }
}

module.exports = new MessageController();
