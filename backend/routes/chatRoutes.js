const express = require('express');
const router = express.Router();
const { sendMessage, getChatHistory, getContacts } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:receiverId', protect, sendMessage);
router.get('/history/:userId', protect, getChatHistory);
router.get('/contacts', protect, getContacts);

module.exports = router;
