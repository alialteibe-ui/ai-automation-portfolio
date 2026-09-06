type AgentDecision = {
  intent: 'faq' | 'branch_location' | 'handoff' | 'unknown';
  answer: string;
  confidence: number;
  tool?: 'lookup_branch' | 'handoff_to_human';
};

export function validateAgentDecision(value: unknown): AgentDecision {
  if (!value || typeof value !== 'object') {
    throw new Error('Agent output must be an object');
  }

  const v = value as Partial<AgentDecision>;
  const intents = ['faq', 'branch_location', 'handoff', 'unknown'] as const;

  if (!v.intent || !intents.includes(v.intent)) {
    throw new Error('Invalid intent');
  }

  if (typeof v.answer !== 'string' || !v.answer.trim()) {
    throw new Error('Missing answer');
  }

  if (typeof v.confidence !== 'number' || v.confidence < 0 || v.confidence > 1) {
    throw new Error('Confidence must be between 0 and 1');
  }

  return v as AgentDecision;
}

export const systemPrompt = `
You are a business support agent.
Return JSON only with: intent, answer, confidence, and optional tool.
Never invent business facts. If information is unavailable, choose handoff or unknown.
Use tools only when the requested action requires external data.
`;
