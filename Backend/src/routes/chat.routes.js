const express = require('express');
const { handleChat } = require('../controllers/chat.controller');

const router = express.Router();

/**
 * POST /api/chat
 * Body: { "message": "Your prompt here" }
 */
router.post('/chat', handleChat);

module.exports = router;
