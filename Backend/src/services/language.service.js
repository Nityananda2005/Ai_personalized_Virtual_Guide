/**
 * Multilingual Support Service
 * Supports English, Hindi (हिंदी), and Odia (ଓଡ଼ିଆ) with automatic language detection.
 * Designed for modular reuse with RAG and Voice synthesis (Sarvam AI / TTS).
 */

const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', native: 'English' },
  hi: { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  or: { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
};

/**
 * Normalizes input language string to a standard 2-letter code (en, hi, or).
 * 
 * @param {string} [inputLang] - Language input (e.g. 'en', 'english', 'hi', 'hindi', 'or', 'odia', 'od')
 * @returns {string|null} Normalized code ('en', 'hi', 'or') or null if auto-detect required
 */
function normalizeLanguage(inputLang) {
  if (!inputLang || typeof inputLang !== 'string') {
    return null;
  }

  const clean = inputLang.toLowerCase().trim();

  if (clean === 'en' || clean === 'english') return 'en';
  if (clean === 'hi' || clean === 'hindi') return 'hi';
  if (clean === 'or' || clean === 'od' || clean === 'odia') return 'or';

  return null;
}

/**
 * Detects language from message text based on Unicode script analysis.
 * 
 * @param {string} text - User message text
 * @returns {string} Language code ('hi', 'or', or 'en')
 */
function detectLanguage(text) {
  if (!text || typeof text !== 'string') {
    return 'en';
  }

  // Devanagari script range (Hindi)
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  // Odia script range (Odia)
  if (/[\u0B00-\u0B7F]/.test(text)) {
    return 'or';
  }

  // Default to English for Latin/other scripts
  return 'en';
}

/**
 * Generates system prompt instruction for the target language.
 * 
 * @param {string|null} targetLang - Explicit target language code ('en', 'hi', 'or')
 * @param {string} userMessage - User query text for auto-detection fallback
 * @returns {{ instruction: string, effectiveLanguage: string }}
 */
function getLanguageInstruction(targetLang, userMessage = '') {
  const normalized = normalizeLanguage(targetLang);
  const effectiveLanguage = normalized || detectLanguage(userMessage);

  let instruction = '';

  switch (effectiveLanguage) {
    case 'hi':
      instruction =
        'LANGUAGE INSTRUCTION: You MUST respond strictly in fluent Hindi (हिंदी) using Devanagari script.';
      break;

    case 'or':
      instruction =
        'LANGUAGE INSTRUCTION: You MUST respond strictly in fluent Odia (ଓଡ଼ିଆ) using Odia script.';
      break;

    case 'en':
    default:
      instruction =
        'LANGUAGE INSTRUCTION: You MUST respond strictly in clear, natural English.';
      break;
  }

  if (!normalized) {
    instruction +=
      ' (Auto-detected user message language. Match the language of the user prompt naturally).';
  }

  return {
    instruction: instruction,
    effectiveLanguage: effectiveLanguage,
  };
}

module.exports = {
  SUPPORTED_LANGUAGES,
  normalizeLanguage,
  detectLanguage,
  getLanguageInstruction,
};
