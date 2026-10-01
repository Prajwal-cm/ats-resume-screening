import { KNOWLEDGE_BASE } from '../components/chatbot/knowledgeBase';

/**
 * Very lightweight intent matcher.
 * In production, swap this for an LLM API (OpenAI, Claude, etc.)
 */
export const matchIntent = (userInput, context = {}) => {
  const input = (userInput || '').trim();

  if (!input) return null;

  // Score each knowledge entry by pattern matches
  const scored = KNOWLEDGE_BASE.map((entry) => {
    let score = 0;
    for (const pattern of entry.patterns) {
      if (pattern instanceof RegExp) {
        if (pattern.test(input)) score += 1;
      } else if (typeof pattern === 'string') {
        if (input.toLowerCase().includes(pattern.toLowerCase())) score += 0.5;
      }
    }
    // Small boost if the entry is relevant to the current page
    if (entry.pages && context.path && entry.pages.some((p) => context.path.startsWith(p))) {
      score += 0.3;
    }
    return { entry, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  return best && best.score > 0 ? best.entry : null;
};

/**
 * Builds a response object from a matched entry.
 */
export const buildResponse = (entry, context) => {
  if (!entry) {
    return {
      text: `I'm not sure I understand that yet. 🤔

Try asking about:
• Uploading resumes
• ATS scores
• Adding jobs
• Shortlisting
• Interview requests
• Navigation

Or type **help** to see everything I can do.`,
      followUps: ['help', 'How do I upload resumes?', 'How is the ATS score calculated?'],
    };
  }

  const text = typeof entry.answer === 'function' ? entry.answer(context) : entry.answer;

  return {
    text,
    followUps: entry.followUps || [],
    sourceId: entry.id,
  };
};