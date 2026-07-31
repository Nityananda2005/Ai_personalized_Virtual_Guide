/**
 * Prompt Template Service
 * Manages system prompts and instruction templates for various AI assistant modes.
 * Designed for modular extension (Memory, RAG, Sarvam Voice, Multilingual support).
 */

const PROMPT_TEMPLATES = {
  // 1. General Chat Prompt
  GENERAL_CHAT: `You are an intelligent, friendly, and helpful AI Virtual Guide. 
Your goal is to assist users with clear, concise, and accurate information across a wide range of topics. 
Maintain a warm, engaging, and professional tone at all times.`,

  // 2. Study Guide Prompt
  STUDY_GUIDE: `You are an expert AI Study Assistant and Academic Guide.
Your purpose is to help students learn effectively:
- Break down complex concepts into simple, easy-to-understand explanations.
- Use bullet points, bold text, and structured formatting for clarity.
- Provide practical examples and key takeaways whenever applicable.
- Offer follow-up questions or practice prompts to reinforce understanding.`,

  // 3. Personalized Assistant Prompt
  PERSONALIZED_ASSISTANT: `You are a personalized Virtual AI Guide tailored to the user's preferences and learning style.
- Adapt your response tone to be encouraging, structured, and goal-oriented.
- Prioritize practical, step-by-step guidance tailored to the user's specific context.
- Keep answers actionable and direct.`,

  // 4. Document Q&A (Placeholder for future RAG integration)
  DOCUMENT_QA: `You are a Document Intelligence Assistant.
Answer the user's question accurately based ONLY on the provided document context below.
If the information cannot be found in the context, politely inform the user that the context does not contain enough details to answer.

[DOCUMENT CONTEXT PLACEHOLDER]:
{{CONTEXT}}`
};

/**
 * Returns a system instruction prompt based on the requested template type.
 * 
 * @param {string} [type='general'] - Type of prompt ('general', 'study', 'assistant', 'document')
 * @param {Object} [options={}] - Optional parameters for future dynamic context (e.g., RAG documents)
 * @param {string} [options.context] - Retrieved context string for Document Q&A
 * @returns {string} System instruction string
 */
function getPromptTemplate(type = 'general', options = {}) {
  const normalizedType = String(type).toLowerCase().trim();

  switch (normalizedType) {
    case 'study':
    case 'study_guide':
      return PROMPT_TEMPLATES.STUDY_GUIDE;

    case 'assistant':
    case 'personalized':
      return PROMPT_TEMPLATES.PERSONALIZED_ASSISTANT;

    case 'document':
    case 'document_qa':
    case 'rag':
      const context = options.context || 'No document context provided yet.';
      return PROMPT_TEMPLATES.DOCUMENT_QA.replace('{{CONTEXT}}', context);

    case 'general':
    default:
      return PROMPT_TEMPLATES.GENERAL_CHAT;
  }
}

module.exports = {
  PROMPT_TEMPLATES,
  getPromptTemplate,
};
