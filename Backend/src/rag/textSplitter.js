/**
 * Splits text into overlapping chunks for vector embedding and retrieval.
 * 
 * @param {string} text - Raw document text
 * @param {Object} [options={}]
 * @param {number} [options.chunkSize=800] - Max character length per chunk
 * @param {number} [options.chunkOverlap=150] - Character overlap between consecutive chunks
 * @returns {Array<{ id: string, text: string, chunkIndex: number }>} Array of text chunks
 */
function splitTextIntoChunks(text, options = {}) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return [];
  }

  const chunkSize = options.chunkSize || 800;
  const chunkOverlap = options.chunkOverlap || 150;

  const chunks = [];
  const cleanText = text.trim();
  let start = 0;
  let chunkIndex = 0;

  while (start < cleanText.length) {
    let end = start + chunkSize;

    // If not at the end of text, attempt to break at whitespace or sentence boundary
    if (end < cleanText.length) {
      const spaceIdx = cleanText.lastIndexOf(' ', end);
      if (spaceIdx > start + Math.floor(chunkSize / 2)) {
        end = spaceIdx;
      }
    }

    const chunkContent = cleanText.substring(start, end).trim();

    if (chunkContent.length > 0) {
      chunks.push({
        id: `chunk_${chunkIndex}_${Date.now()}`,
        text: chunkContent,
        chunkIndex: chunkIndex,
      });
      chunkIndex++;
    }

    start = end - chunkOverlap;
    if (start >= cleanText.length || end >= cleanText.length) {
      break;
    }
  }

  return chunks;
}

module.exports = {
  splitTextIntoChunks,
};
