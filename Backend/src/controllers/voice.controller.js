const { textToSpeech } = require('../services/voice.service');

/**
 * Controller handling POST /api/voice/speak requests to convert text to speech.
 * 
 * @route POST /api/voice/speak
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 */
async function handleSpeak(req, res) {
  try {
    const { text, language = 'en', speaker = process.env.SARVAM_SPEAKER || 'anushka', pace = 1.0 } = req.body;

    if (!text || typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "text" parameter is required and must be a non-empty string.',
      });
    }

    const ttsResult = await textToSpeech(text.trim(), {
      language: language,
      speaker: speaker,
      pace: pace,
    });

    return res.status(200).json({
      success: true,
      audioContent: ttsResult.audioContent,
      format: ttsResult.format,
      language: ttsResult.language,
      speaker: ttsResult.speaker,
      isMock: ttsResult.isMock || false,
    });
  } catch (error) {
    console.error('Error in handleSpeak voice controller:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'An unexpected error occurred during voice synthesis.',
    });
  }
}

module.exports = {
  handleSpeak,
};
