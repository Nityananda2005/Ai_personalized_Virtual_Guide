const { ChromaClient } = require('chromadb');

// In-memory fallback vector storage if local ChromaDB server is not running
const memoryVectorStore = new Map(); // collectionName -> Array<{ id, text, embedding, metadata }>

/**
 * Calculates cosine similarity between two vector arrays.
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Gets or creates ChromaDB client instance
 */
function getChromaClient() {
  try {
    const host = process.env.CHROMA_SERVER_HOST || 'localhost';
    const port = process.env.CHROMA_SERVER_PORT || 8000;
    return new ChromaClient({ path: `http://${host}:${port}` });
  } catch (error) {
    return null;
  }
}

/**
 * Adds document chunks with vector embeddings to ChromaDB or Memory Store.
 * 
 * @param {Array<{id: string, text: string, embedding: Array<number>, metadata?: Object}>} chunks 
 * @param {string} [collectionName='pdf_documents'] 
 * @returns {Promise<boolean>}
 */
async function addDocuments(chunks, collectionName = 'pdf_documents') {
  if (!Array.isArray(chunks) || chunks.length === 0) return false;

  try {
    const chroma = getChromaClient();
    if (chroma) {
      const collection = await chroma.getOrCreateCollection({ name: collectionName });

      const ids = chunks.map((c, idx) => c.id || `doc_chunk_${idx}_${Date.now()}`);
      const embeddings = chunks.map(c => c.embedding);
      const documents = chunks.map(c => c.text);
      const metadatas = chunks.map(c => c.metadata || { source: collectionName });

      await collection.add({
        ids: ids,
        embeddings: embeddings,
        documents: documents,
        metadatas: metadatas,
      });

      console.log(`[Vector Store]: Saved ${chunks.length} chunks to ChromaDB collection '${collectionName}'.`);
      return true;
    }
  } catch (error) {
    console.warn('[Vector Store Warning]: ChromaDB connection unavailable. Using in-memory vector store.');
  }

  // Fallback to in-memory vector store
  const existing = memoryVectorStore.get(collectionName) || [];
  const updated = [...existing, ...chunks];
  memoryVectorStore.set(collectionName, updated);
  console.log(`[Vector Store]: Saved ${chunks.length} chunks to Memory Vector Store '${collectionName}'.`);
  return true;
}

/**
 * Searches for most relevant document chunks matching a query vector.
 * 
 * @param {Array<number>} queryEmbedding - Vector embedding of user query
 * @param {number} [topK=4] - Number of top relevant chunks to return
 * @param {string} [collectionName='pdf_documents'] - Target collection
 * @returns {Promise<Array<{ id: string, text: string, score: number }>>}
 */
async function similaritySearch(queryEmbedding, topK = 4, collectionName = 'pdf_documents') {
  if (!queryEmbedding || !Array.isArray(queryEmbedding)) return [];

  try {
    const chroma = getChromaClient();
    if (chroma) {
      const collection = await chroma.getCollection({ name: collectionName });
      const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: topK,
      });

      if (results && results.documents && results.documents[0]) {
        return results.documents[0].map((docText, idx) => ({
          id: results.ids[0]?.[idx] || `result_${idx}`,
          text: docText,
          score: results.distances?.[0]?.[idx] ? 1 - results.distances[0][idx] : 1.0,
        }));
      }
    }
  } catch (error) {
    // Fall back to in-memory cosine similarity search
  }

  // In-memory similarity search
  const storedChunks = memoryVectorStore.get(collectionName) || [];
  if (storedChunks.length === 0) return [];

  const scored = storedChunks.map(chunk => ({
    id: chunk.id,
    text: chunk.text,
    score: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));

  // Sort descending by similarity score
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, topK);
}

/**
 * Clears vector storage for a collection.
 * 
 * @param {string} [collectionName='pdf_documents'] 
 */
async function clearCollection(collectionName = 'pdf_documents') {
  try {
    const chroma = getChromaClient();
    if (chroma) {
      await chroma.deleteCollection({ name: collectionName });
    }
  } catch (error) {
    // ignore
  }
  memoryVectorStore.delete(collectionName);
}

module.exports = {
  addDocuments,
  similaritySearch,
  clearCollection,
};
