const express = require('express');
const { saveProfile, getProfile } = require('../controllers/user.controller');

const router = express.Router();

/**
 * POST /api/user/profile
 * Body: { "userId": "user123", "name": "Rahul", "department": "CSE", "semester": "Semester 6", "learningGoal": "AI", "preferredLanguage": "hi" }
 */
router.post('/profile', saveProfile);

/**
 * GET /api/user/profile/:userId
 */
router.get('/profile/:userId', getProfile);

module.exports = router;
