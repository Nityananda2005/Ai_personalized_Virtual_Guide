const { generateReply } = require('./groq');

/**
 * Generates a targeted Viva / Interview Question based on Branch, Subject, and Examiner Persona.
 * 
 * @param {Object} params
 * @param {string} [params.branch='CSE'] - Student's academic branch (e.g., CSE, IT, ECE)
 * @param {string} [params.subject='DBMS'] - Subject domain (e.g., DBMS, OS, DSA, Computer Networks)
 * @param {string} [params.persona='Strict HOD'] - Examiner persona ('Strict HOD' | 'Senior Tech Lead' | 'Rapid-Fire Examiner')
 * @param {Array} [params.previousTurns=[]] - Conversation context of previous questions/answers
 * @returns {Promise<Object>} Object containing { question, questionId, topic }
 */
async function generateVivaQuestion({ branch = 'CSE', subject = 'DBMS', persona = 'Strict HOD', previousTurns = [] }) {
  let personaInstruction = '';

  if (persona === 'Strict HOD') {
    personaInstruction = `You are a stern, demanding University HOD and Chief External Examiner. You expect precise technical definitions, exact terminology, and deep conceptual clarity.`;
  } else if (persona === 'Senior Tech Lead') {
    personaInstruction = `You are a Principal Software Architect / Tech Lead at a top tech company. You focus on real-world practical trade-offs, system performance, scalability, and code optimization.`;
  } else {
    personaInstruction = `You are a fast-paced Rapid-Fire Technical Examiner. Ask crisp, core conceptual questions that test immediate recall and core intuition.`;
  }

  const systemPrompt = `${personaInstruction}
You are conducting a formal 1-on-1 Oral Viva / Interview for a ${branch} student on the subject "${subject}".

CRITICAL INSTRUCTIONS:
1. Ask ONE clear, challenging, and realistic Viva question.
2. Do NOT provide the answer or additional conversational filler.
3. Output strictly JSON format:
{
  "question": "Your exact viva question text here",
  "topic": "Specific sub-topic name (e.g. Normalization / B-Trees / Deadlocks)",
  "difficulty": "Easy" | "Medium" | "Hard"
}
`;

  const previousSummary = previousTurns.length > 0
    ? `Avoid repeating previous questions: ${previousTurns.map(t => t.question).join('; ')}`
    : '';

  const userMessage = `Ask a high-yield viva question for ${branch} student in subject "${subject}". ${previousSummary}`;

  try {
    const rawReply = await generateReply(userMessage, [], { systemInstruction: systemPrompt });

    let cleaned = rawReply.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    let parsed = {};
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      // Fallback if JSON parse fails
      parsed = {
        question: rawReply.replace(/[{}"\n]/g, ' ').trim(),
        topic: subject,
        difficulty: 'Medium',
      };
    }

    return {
      question: parsed.question || `Explain core concepts of ${subject} in ${branch}.`,
      topic: parsed.topic || subject,
      difficulty: parsed.difficulty || 'Medium',
      questionId: `viva_${Date.now()}`,
    };
  } catch (error) {
    console.error('[Viva Service - Generate Question Error]:', error);
    throw new Error(`Failed to generate viva question: ${error.message}`);
  }
}

/**
 * Evaluates student's spoken/written answer across Technical Correctness, Missed Concepts, Tone, and Model Answer.
 * 
 * @param {Object} params
 * @param {string} params.question - The question asked by examiner
 * @param {string} params.studentAnswer - The transcript/text of student's answer
 * @param {string} [params.branch='CSE']
 * @param {string} [params.subject='DBMS']
 * @param {string} [params.persona='Strict HOD']
 * @returns {Promise<Object>} Evaluation scorecard JSON object
 */
async function evaluateVivaAnswer({ question, studentAnswer, branch = 'CSE', subject = 'DBMS', persona = 'Strict HOD' }) {
  if (!question || !studentAnswer) {
    throw new Error('Both question and studentAnswer are required for viva evaluation.');
  }

  const systemPrompt = `You are a university chief examiner evaluating a ${branch} student's oral viva response on "${subject}".
The examiner persona for this session is "${persona}".

EVALUATION CRITERIA:
1. Technical Accuracy (Score out of 10): Is the answer correct and technically precise?
2. Covered Concepts: List exact keywords/concepts the student accurately identified.
3. Missed Concepts: List crucial keywords, definitions, or edge cases the student missed or got wrong (e.g., "Missed: ACID properties, BCNF lossless join condition").
4. Tone & Confidence Feedback: Analyze delivery structure, clarity, confidence, or filler word usage based on transcript.
5. Model Answer: Provide a concise, top-scoring 10/10 model answer.
6. Follow-up Question: Formulate a logical follow-up question based on what the student missed or to test deeper knowledge.

OUTPUT SCHEMA:
Respond STRICTLY with a valid JSON object. No outer markdown wrapper if possible:
{
  "score": 7.5,
  "grade": "B+" | "A" | "A+" | "C" | "F",
  "summary": "Concise 1-2 sentence overall evaluation",
  "coveredConcepts": ["Concept 1", "Concept 2"],
  "missedConcepts": ["Missed Concept 1", "Missed Concept 2"],
  "toneFeedback": "Constructive feedback on delivery and confidence",
  "modelAnswer": "Clear 10/10 reference answer text",
  "followupQuestion": "Follow-up question string"
}
`;

  const userMessage = `Question: "${question}"
Student's Spoken Answer: "${studentAnswer}"

Evaluate this answer now and return the JSON scorecard.`;

  try {
    const rawReply = await generateReply(userMessage, [], { systemInstruction: systemPrompt });

    let cleaned = rawReply.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    }

    let scorecard = {};
    try {
      scorecard = JSON.parse(cleaned);
    } catch (e) {
      console.warn('[Viva Service Warning]: Failed to parse evaluation JSON directly.', e.message);
      // Extraction fallback
      const jsonMatch = rawReply.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        scorecard = JSON.parse(jsonMatch[0]);
      } else {
        scorecard = {
          score: 6.0,
          grade: 'B',
          summary: 'Answer covered basic ideas but lacked technical depth.',
          coveredConcepts: ['Basic definitions'],
          missedConcepts: ['Key technical terms and formulas'],
          toneFeedback: 'Tone was acceptable.',
          modelAnswer: rawReply,
          followupQuestion: 'Can you elaborate further on the core definition?',
        };
      }
    }

    return scorecard;
  } catch (error) {
    console.error('[Viva Service - Evaluate Answer Error]:', error);
    throw new Error(`Failed to evaluate viva answer: ${error.message}`);
  }
}

module.exports = {
  generateVivaQuestion,
  evaluateVivaAnswer,
};
