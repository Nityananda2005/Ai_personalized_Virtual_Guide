/**
 * Sarvam AI Bulbul Text-to-Speech (TTS) Voice Service
 * Converts AI response text into natural speech audio in English, Hindi, or Odia.
 */

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';

/**
 * Maps standard language code to Sarvam AI target language code.
 * 
 * @param {string} langCode - Input language code ('en', 'hi', 'or')
 * @returns {string} Sarvam target language code ('en-IN', 'hi-IN', 'or-IN')
 */
function mapSarvamLanguageCode(langCode) {
  if (!langCode || typeof langCode !== 'string') return 'hi-IN';
  const clean = langCode.toLowerCase().trim();

  if (clean === 'en' || clean === 'english' || clean === 'en-in') return 'en-IN';
  if (clean === 'or' || clean === 'od' || clean === 'odia' || clean === 'or-in' || clean === 'od-in') return 'od-IN';
  if (clean === 'hi' || clean === 'hindi' || clean === 'hi-in') return 'hi-IN';

  return 'hi-IN';
}

/**
 * Splits long text cleanly at sentence boundaries into chunks of <= maxChunkLen characters
 * to satisfy Sarvam AI's 500-character limit per input while covering full response content.
 * 
 * @param {string} text 
 * @param {number} [maxChunkLen=400] 
 * @param {number} [maxChunks=5] 
 * @returns {Array<string>}
 */
function splitTextForTTS(text, maxChunkLen = 400, maxChunks = 5) {
  if (!text || typeof text !== 'string') return [];
  
  // Clean markdown formatting (*, #, _, `) for natural voice speech
  const clean = text.replace(/[*#_`]/g, '').trim();
  if (clean.length === 0) return [];
  if (clean.length <= maxChunkLen) return [clean];

  const chunks = [];
  let remaining = clean;

  while (remaining.length > 0 && chunks.length < maxChunks) {
    if (remaining.length <= maxChunkLen) {
      chunks.push(remaining.trim());
      break;
    }

    let chunk = remaining.substring(0, maxChunkLen);
    let splitIdx = Math.max(
      chunk.lastIndexOf('. '),
      chunk.lastIndexOf('! '),
      chunk.lastIndexOf('? '),
      chunk.lastIndexOf('\n'),
      chunk.lastIndexOf('। '), // Hindi/Odia Purna Viram
      chunk.lastIndexOf('।')
    );

    if (splitIdx < 80) {
      splitIdx = chunk.lastIndexOf(' ');
    }

    if (splitIdx < 80) {
      splitIdx = maxChunkLen;
    }

    const currentChunk = remaining.substring(0, splitIdx + 1).trim();
    if (currentChunk) {
      chunks.push(currentChunk);
    }
    remaining = remaining.substring(splitIdx + 1).trim();
  }

  return chunks;
}

/**
 * Concatenates multiple WAV base64 audio responses into a single combined WAV Data URI.
 * 
 * @param {Array<string>} base64Audios - List of base64 WAV strings from Sarvam AI
 * @returns {string} Consolidated WAV Data URI
 */
function concatenateWavBase64(base64Audios) {
  if (!Array.isArray(base64Audios) || base64Audios.length === 0) {
    return generateMockAudioDataUri();
  }
  if (base64Audios.length === 1) {
    const raw = base64Audios[0];
    return raw.startsWith('data:') ? raw : `data:audio/wav;base64,${raw}`;
  }

  try {
    const buffers = base64Audios.map(b64 => {
      const cleanB64 = b64.replace(/^data:audio\/\w+;base64,/, '');
      return Buffer.from(cleanB64, 'base64');
    });

    const header = Buffer.from(buffers[0].subarray(0, 44));
    const pcmChunks = [];

    for (let i = 0; i < buffers.length; i++) {
      const buf = buffers[i];
      if (buf.length > 44) {
        pcmChunks.push(buf.subarray(44));
      }
    }

    const combinedPcm = Buffer.concat(pcmChunks);
    const totalWavSize = 36 + combinedPcm.length;

    header.writeUInt32LE(totalWavSize, 4);
    header.writeUInt32LE(combinedPcm.length, 40);

    const fullWavBuffer = Buffer.concat([header, combinedPcm]);
    return `data:audio/wav;base64,${fullWavBuffer.toString('base64')}`;
  } catch (error) {
    console.warn('[WAV Concatenation Warning]:', error.message);
    const raw = base64Audios[0];
    return raw.startsWith('data:') ? raw : `data:audio/wav;base64,${raw}`;
  }
}

/**
 * Generates a mock WAV audio Data URI for local development testing when SARVAM_API_KEY is not set.
 */
function generateMockAudioDataUri() {
  const mockWavBase64 = 'UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
  return `data:audio/wav;base64,${mockWavBase64}`;
}

/**
 * Converts text input into synthesized speech using Sarvam AI Bulbul TTS.
 * 
 * @param {string} text - Text to convert into speech
 * @param {Object} [options={}] - Synthesizer options
 * @param {string} [options.language='hi-IN'] - Target language ('en', 'hi', 'or')
 * @param {string} [options.speaker='anushka'] - Voice speaker name (e.g., 'anushka', 'rahul', 'priya')
 * @param {number} [options.pace=1.0] - Speech speed pace
 * @returns {Promise<{ audioContent: string, format: string, language: string, speaker: string, isMock: boolean }>}
 */
async function textToSpeech(text, options = {}) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    throw new Error('Invalid input: "text" parameter must be a non-empty string.');
  }

  const apiKey = process.env.SARVAM_API_KEY;
  const targetLangCode = mapSarvamLanguageCode(options.language);
  const speaker = options.speaker || process.env.SARVAM_SPEAKER || 'anushka';
  const model = options.model || process.env.SARVAM_MODEL || 'bulbul:v2';
  
  // Split long response into clean sentence chunks (<= 400 chars each) to satisfy Sarvam AI limits
  const inputChunks = splitTextForTTS(text, 400, 5);

  if (inputChunks.length === 0) {
    throw new Error('No valid speech content found.');
  }

  // If SARVAM_API_KEY is missing or placeholder, use fallback mock audio URI
  if (!apiKey || apiKey === 'your_sarvam_api_key_here') {
    console.warn(
      '[Voice Service Warning]: SARVAM_API_KEY is missing or using placeholder in .env. Returning fallback mock audio data URI.'
    );
    return {
      audioContent: generateMockAudioDataUri(),
      format: 'audio/wav',
      language: targetLangCode,
      speaker: speaker,
      isMock: true,
    };
  }

  try {
    const response = await fetch(SARVAM_TTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        inputs: inputChunks,
        target_language_code: targetLangCode,
        speaker: speaker,
        pitch: 0,
        pace: options.pace || 1.0,
        loudness: 1.5,
        speech_sample_rate: 8000,
        enable_preprocessing: true,
        model: model,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam AI HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();

    if (!data || !Array.isArray(data.audios) || data.audios.length === 0) {
      throw new Error('Sarvam AI returned an empty audio response.');
    }

    // Concatenate all synthesized WAV audio chunks into a single seamless audio file
    const combinedDataUri = concatenateWavBase64(data.audios);

    return {
      audioContent: combinedDataUri,
      format: 'audio/wav',
      language: targetLangCode,
      speaker: speaker,
      isMock: false,
    };
  } catch (error) {
    console.error('[Voice Service Error]:', error.message || error);
    throw new Error(`Text-to-Speech synthesis failed: ${error.message || 'Unknown error'}`);
  }
}

module.exports = {
  textToSpeech,
  mapSarvamLanguageCode,
  splitTextForTTS,
  concatenateWavBase64,
};
