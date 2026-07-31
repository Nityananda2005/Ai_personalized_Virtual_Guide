const { generateVivaQuestion, evaluateVivaAnswer } = require('../services/viva.service');

/**
 * Controller to handle POST /api/viva/question
 */
async function handleGetQuestion(req, res) {
  try {
    const { branch, subject, persona, previousTurns } = req.body;

    const data = await generateVivaQuestion({
      branch,
      subject,
      persona,
      previousTurns,
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[Viva Controller Error - GetQuestion]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate viva question.',
    });
  }
}

/**
 * Controller to handle POST /api/viva/evaluate
 */
async function handleEvaluateAnswer(req, res) {
  try {
    const { question, studentAnswer, branch, subject, persona } = req.body;

    if (!question || !studentAnswer) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "question" and "studentAnswer" fields are required.',
      });
    }

    const scorecard = await evaluateVivaAnswer({
      question,
      studentAnswer,
      branch,
      subject,
      persona,
    });

    return res.status(200).json({
      success: true,
      data: scorecard,
    });
  } catch (error) {
    console.error('[Viva Controller Error - EvaluateAnswer]:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to evaluate viva answer.',
    });
  }
}

module.exports = {
  handleGetQuestion,
  handleEvaluateAnswer,
};
