const express = require('express');
const { handleGetQuestion, handleEvaluateAnswer } = require('../controllers/viva.controller');

const router = express.Router();

/**
 * POST /api/viva/question
 * Body: { "branch": "CSE", "subject": "DBMS", "persona": "Strict HOD" }
 */
router.post('/question', handleGetQuestion);

/**
 * POST /api/viva/evaluate
 * Body: { "question": "...", "studentAnswer": "...", "branch": "CSE", "subject": "DBMS" }
 */
router.post('/evaluate', handleEvaluateAnswer);

module.exports = router;
