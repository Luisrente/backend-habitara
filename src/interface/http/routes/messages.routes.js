const express = require('express');
const MessageController = require('../controllers/MessageController');
const authMiddleware    = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/conversations',                           authMiddleware, MessageController.getOrCreateConversation);
router.get('/conversations/:conversationId',            authMiddleware, MessageController.getMessages);
router.post('/conversations/:conversationId',           authMiddleware, MessageController.sendMessage);

module.exports = router;
