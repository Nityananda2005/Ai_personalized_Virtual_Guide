const Groq = require('groq-sdk');

// Retrieve API Key from environment variables
const apiKey = process.env.GROQ_API_KEY;

if (!apiKey || apiKey === 'gsk_your_groq_api_key_here') {
  console.warn(
    '[Groq Service Warning]: GROQ_API_KEY is missing or using placeholder in environment variables. Ensure it is set in .env'
  );
}

// Initialize Groq AI Client
const groq = new Groq({ apiKey: apiKey || '' });

/**
 * Formats conversation history into Groq Chat Completion messages array.
 * @param {Array} history - Previous conversation turns
 * @returns {Array} Formatted messages array
 */
function formatHistory(history = []) {
  if (!Array.isArray(history) || history.length === 0) {
    return [];
  }

  return history
    .filter(item => item && (item.content || item.text || item.message))
    .map(item => {
      const role =
        item.role === 'model' || item.role === 'assistant' || item.sender === 'ai'
          ? 'assistant'
          : 'user';
      const content = item.text || item.content || item.message || '';
      return {
        role: role,
        content: String(content),
      };
    });
}

/**
 * Sends prompt to Groq AI model with history & system instructions and returns response text.
 * 
 * @param {string} message - Current user query/message
 * @param {Array} [history=[]] - Conversation history array
 * @param {Object} [options={}] - Custom configuration options
 * @param {string} [options.systemInstruction] - System prompt instructions
 * @param {string} [options.model] - Model override
 * @returns {Promise<string>} Generated text reply from Groq AI
 */
async function generateReply(message, history = [], options = {}) {
  if (!message || typeof message !== 'string' || message.trim() === '') {
    throw new Error('Invalid input: "message" parameter must be a non-empty string.');
  }

  try {
    // Select Groq model (default: llama-3.3-70b-versatile)
    const model = options.model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

    // Build messages array (System Instruction -> History -> User Message)
    const messages = [];

    if (options.systemInstruction) {
      messages.push({
        role: 'system',
        content: options.systemInstruction,
      });
    }

    const formattedHistory = formatHistory(history);
    messages.push(...formattedHistory);

    messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Call Groq API via official SDK
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: model,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error('Groq API returned an empty response.');
    }

    return reply;
  } catch (error) {
    console.error('[Groq API Error]:', error.message || error);
    throw new Error(`Groq AI service error: ${error.message || 'Failed to generate AI response'}`);
  }
}

module.exports = {
  groq,
  generateReply,
};
