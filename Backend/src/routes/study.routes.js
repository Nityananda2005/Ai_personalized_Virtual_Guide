const express = require('express');
const { handleGenerateStudyMaterial } = require('../controllers/study.controller');

const router = express.Router();

/**
 * POST /api/study/generate
 * Body: { "topic": "DBMS Normalization" }
 */
router.post('/generate', handleGenerateStudyMaterial);

module.exports = router;
