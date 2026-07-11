const db = require('../utils/db');

const sendMessage = async (req, res) => {
  const { message } = req.body;
  const receiverId = req.params.receiverId;

  if (!message) {
    return res.status(400).json({ message: 'Cannot send empty message' });
  }

  try {
    const chatMsg = await db.ChatMessage.create({
      senderId: req.user._id,
      receiverId,
      message
    });
    res.status(201).json(chatMsg);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error sending message' });
  }
};

const getChatHistory = async (req, res) => {
  const otherUserId = req.params.userId;
  try {
    const messages = await db.ChatMessage.find({});
    // Filter messages between current user and other user
    const chatHistory = messages.filter(m => 
      (String(m.senderId._id || m.senderId) === String(req.user._id) && String(m.receiverId._id || m.receiverId) === String(otherUserId)) ||
      (String(m.senderId._id || m.senderId) === String(otherUserId) && String(m.receiverId._id || m.receiverId) === String(req.user._id))
    );
    res.json(chatHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving chat history' });
  }
};

const getContacts = async (req, res) => {
  try {
    const allUsers = await db.User.find({});
    if (req.user.role === 'Student') {
      // Students chat with Industry Partners (Mentors) or Teachers
      const contacts = allUsers.filter(u => u.role === 'Industry Partner' || u.role === 'Teacher');
      res.json(contacts);
    } else if (req.user.role === 'Industry Partner' || req.user.role === 'Teacher') {
      // Mentors/Teachers chat with Students
      const contacts = allUsers.filter(u => u.role === 'Student');
      res.json(contacts);
    } else {
      // Admin sees all
      res.json(allUsers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
};

module.exports = { sendMessage, getChatHistory, getContacts };
