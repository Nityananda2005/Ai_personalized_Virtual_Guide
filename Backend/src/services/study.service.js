const { generateReply } = require('./groq');

/**
 * Service to generate 1-page notes, Mermaid mindmap, and 5 PYQs in parallel.
 * 
 * @param {string} topic - The topic to generate study materials for (e.g. "DBMS Normalization")
 * @param {Object} [options={}] - Additional settings (e.g., targetAudience, userContext)
 * @returns {Promise<Object>} Object containing notes, mindmap, and pyqs
 */
async function generateStudyMaterial(topic, options = {}) {
  if (!topic || typeof topic !== 'string' || !topic.trim()) {
    throw new Error('Topic is required for generating study materials.');
  }

  const cleanTopic = topic.trim();

  // 1. Prompt for High-Yield Textbook-Grade 1-Page Structured Notes
  const notesSystemPrompt = `You are a distinguished university professor and chief exam strategist.
Your task is to generate comprehensive, high-density, textbook-grade 1-page study notes for "${cleanTopic}".

MUST USE STRICT MARKDOWN WITH CLEAR HEADINGS, TABLES, AND BULLETS.

STRUCTURE REQUIREMENTS:

# 📌 ${cleanTopic} — Executive Summary & Core Objective
Provide a 2-3 sentence high-impact summary explaining what ${cleanTopic} is, why it is fundamental in computer science/engineering, and its main purpose.

## 💡 Key Terminology & Definitions
Provide a bulleted list of 4-6 essential terms. Format every key term in **bold** with a clear 1-2 sentence explanation.

## ⚡ Core Principles, Rules & Formulas
Provide a numbered step-by-step breakdown of rules, mathematical formulas, algorithms, or standard procedural steps.

## 📊 Summary & Comparison Table
Create a markdown table summarizing key types, forms, or properties. Example format:
| Feature / Form | Definition / Condition | Key Advantage | Exam Tip |
| --- | --- | --- | --- |

## 💻 Real-World Example / Schema / Code Snippet
Provide a concrete illustrative example (e.g. Unnormalized vs Normalized table, or Code snippet, or Architecture breakdown).

## 🚀 Exam Strategy & Critical Pitfalls to Avoid
Use blockquotes (> ) for examiner pro tips and list 3 common mistakes students make in university exams.
`;

  const notesUserMessage = `Generate complete, highly-structured 1-page textbook notes for topic: "${cleanTopic}"`;

  // 2. Prompt for Mermaid Mindmap Syntax
  const mindmapSystemPrompt = `You are an expert visual educator and diagram designer.
Your task is to generate ONLY syntactically valid Mermaid.js mindmap code for the given topic.

CRITICAL RULES:
1. Output MUST start strictly with \`mindmap\`.
2. Use valid Mermaid mindmap indentation hierarchy.
3. Do NOT include markdown text explanation outside the diagram.
4. Keep node titles short, punchy, and clear.
5. Escape parentheses or quotes if used in node titles.

EXAMPLE FORMAT:
mindmap
  root((${cleanTopic}))
    Core Concepts
      Definition
      Key Principles
    Types / Normal Forms
      1NF
      2NF
      3NF
      BCNF
    Advantages
      No Redundancy
      Data Integrity
    Exam Tips
      Identify Keys
      Functional Dependencies
`;

  const mindmapUserMessage = `Generate a Mermaid mindmap diagram for topic: "${cleanTopic}"`;

  // 3. Prompt for 5 Important Previous Year Questions (PYQs)
  const pyqSystemPrompt = `You are a senior university exam paper setter and tutor.
Your task is to generate 5 high-yield Previous Year Questions (PYQs) with solutions for the given topic.

You MUST respond strictly with a valid JSON array of 5 objects. Do NOT include Markdown formatting codeblock backticks if possible, or wrap strictly in JSON.

Each object MUST have the following schema:
{
  "id": number (1 to 5),
  "question": "Clear exam question statement",
  "difficulty": "Easy" | "Medium" | "Hard",
  "marks": "5 Marks" | "10 Marks" | "15 Marks",
  "type": "Theory" | "Numerical" | "Conceptual",
  "solution": "Step-by-step detailed solution or answer key",
  "examTip": "Pro tip on how to score full marks for this specific question"
}
`;

  const pyqUserMessage = `Generate 5 important PYQs for topic: "${cleanTopic}"`;

  try {
    // Run all 3 LLM calls concurrently for maximum performance
    const [notesResponse, mindmapResponse, pyqResponse] = await Promise.all([
      generateReply(notesUserMessage, [], { systemInstruction: notesSystemPrompt }),
      generateReply(mindmapUserMessage, [], { systemInstruction: mindmapSystemPrompt }),
      generateReply(pyqUserMessage, [], { systemInstruction: pyqSystemPrompt }),
    ]);

    // Clean up Mermaid response (remove ```mermaid wrapping if present)
    let cleanedMindmap = mindmapResponse.trim();
    if (cleanedMindmap.startsWith('```')) {
      cleanedMindmap = cleanedMindmap
        .replace(/^```(?:mermaid)?\n?/, '')
        .replace(/\n?```$/, '')
        .trim();
    }

    // Clean up PYQs JSON response
    let parsedPyqs = [];
    try {
      let cleanedPyqText = pyqResponse.trim();
      if (cleanedPyqText.startsWith('```')) {
        cleanedPyqText = cleanedPyqText
          .replace(/^```(?:json)?\n?/, '')
          .replace(/\n?```$/, '')
          .trim();
      }
      parsedPyqs = JSON.parse(cleanedPyqText);
    } catch (parseError) {
      console.warn('[Study Service Warning]: Failed to parse PYQ JSON directly. Using raw fallback parsing.', parseError.message);
      // Fallback fallback parsing attempt if json block extraction needed
      const jsonMatch = pyqResponse.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        parsedPyqs = JSON.parse(jsonMatch[0]);
      } else {
        parsedPyqs = [
          {
            id: 1,
            question: `Explain core principles of ${cleanTopic}.`,
            difficulty: 'Medium',
            marks: '10 Marks',
            type: 'Theory',
            solution: pyqResponse,
            examTip: 'Focus on clear definitions and bullet points.',
          },
        ];
      }
    }

    return {
      topic: cleanTopic,
      notes: notesResponse,
      mindmap: cleanedMindmap,
      pyqs: parsedPyqs,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('[Study Service Error]:', error);
    throw new Error(`Failed to generate study materials: ${error.message}`);
  }
}

module.exports = {
  generateStudyMaterial,
};
