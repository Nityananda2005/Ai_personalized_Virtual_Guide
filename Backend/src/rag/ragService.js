const { loadPdfText } = require('./documentLoader');
const { splitTextIntoChunks } = require('./textSplitter');
const { generateEmbedding, generateBatchEmbeddings } = require('./embeddingService');
const { addDocuments, similaritySearch } = require('./vectorStore');
const { getPromptTemplate } = require('../services/prompt.service');
const { generateReply } = require('../services/groq');
const { getLanguageInstruction } = require('../services/language.service');

/**
 * Parses, chunks, embeds, and stores a PDF document in vector storage.
 * 
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {string} fileName - Name of uploaded file
 * @param {string} [collectionName='pdf_documents'] - Vector collection name
 * @returns {Promise<{ success: boolean, fileName: string, numPages: number, totalChunks: number }>}
 */
async function ingestDocument(fileBuffer, fileName = 'document.pdf', collectionName = 'pdf_documents') {
  if (!fileBuffer) {
    throw new Error('File buffer is required for document ingestion.');
  }

  // 1. Extract raw text from PDF
  const { text, numPages } = await loadPdfText(fileBuffer);

  // 2. Split text into chunks
  const rawChunks = splitTextIntoChunks(text, { chunkSize: 800, chunkOverlap: 150 });

  if (rawChunks.length === 0) {
    throw new Error('Document contained no processable text chunks.');
  }

  // 3. Generate embeddings for chunks
  const chunksWithEmbeddings = await generateBatchEmbeddings(rawChunks);

  // Attach metadata
  const enrichedChunks = chunksWithEmbeddings.map(chunk => ({
    ...chunk,
    metadata: {
      fileName: fileName,
      numPages: numPages,
    },
  }));

  // 4. Store in Vector Store
  await addDocuments(enrichedChunks, collectionName);

  return {
    success: true,
    fileName: fileName,
    numPages: numPages,
    totalChunks: rawChunks.length,
  };
}

/**
 * Searches vector store for relevant document context and generates an AI answer.
 * 
 * @param {string} query - User's question
 * @param {Object} [options={}]
 * @param {string} [options.language] - Target output language ('en', 'hi', 'or')
 * @param {Array} [options.history=[]] - Conversation history
 * @param {string} [options.collectionName='pdf_documents'] - Collection name
 * @param {number} [options.topK=4] - Number of vector matches
 * @returns {Promise<{ success: boolean, answer: string, retrievedContext: Array, language: string }>}
 */
async function queryRAG(query, options = {}) {
  if (!query || typeof query !== 'string' || query.trim() === '') {
    throw new Error('Query parameter must be a non-empty string.');
  }

  const collectionName = options.collectionName || 'pdf_documents';
  const topK = options.topK || 4;
  const history = options.history || [];

  // 1. Generate query embedding vector
  const queryEmbedding = await generateEmbedding(query.trim());

  // 2. Perform similarity search in Vector Store
  const matchingChunks = await similaritySearch(queryEmbedding, topK, collectionName);

  // 3. Combine matching chunks into unified context block
  const contextString = matchingChunks.length > 0
    ? matchingChunks.map((chunk, idx) => `[Chunk ${idx + 1}]:\n${chunk.text}`).join('\n\n')
    : 'No relevant document context found.';

  // 4. Retrieve Document Q&A system prompt template
  const docQaPrompt = getPromptTemplate('document', { context: contextString });

  // 5. Apply language instruction (English, Hindi, Odia, Auto)
  const { instruction: langInstruction, effectiveLanguage } = getLanguageInstruction(
    options.language,
    query.trim()
  );

  const fullSystemInstruction = `${docQaPrompt}\n\n${langInstruction}`;

  // 6. Generate AI response based on retrieved context
  const reply = await generateReply(query.trim(), history, {
    systemInstruction: fullSystemInstruction,
  });

  return {
    success: true,
    answer: reply,
    retrievedContext: matchingChunks,
    language: effectiveLanguage,
  };
}

module.exports = {
  ingestDocument,
  queryRAG,
};
