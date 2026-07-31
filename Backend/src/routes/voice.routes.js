const express = require('express');
const { handleSpeak } = require('../controllers/voice.controller');

const router = express.Router();

/**
 * POST /api/voice/speak
 * Body: { "text": "...", "language": "en" }
 */
router.post('/speak', handleSpeak);

module.exports = router;
