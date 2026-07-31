const { generateReply: generateGroqReply } = require('./groq');

/**
 * Service alias delegating to Groq AI service for active AI generation.
 */
async function generateReply(message, history = [], options = {}) {
  return await generateGroqReply(message, history, options);
}

module.exports = {
  generateReply,
};
