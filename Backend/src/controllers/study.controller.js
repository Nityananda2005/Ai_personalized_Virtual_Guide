const { generateStudyMaterial } = require('../services/study.service');

/**
 * Controller to handle POST /api/study/generate
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function handleGenerateStudyMaterial(req, res) {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "topic" field is required and must be a non-empty string.',
      });
    }

    const result = await generateStudyMaterial(topic.trim());

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Study Controller Error]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred while generating study materials.',
    });
  }
}

module.exports = {
  handleGenerateStudyMaterial,
};
