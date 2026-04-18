import { describe, expect, it } from 'vitest';

import { audioPrompt, visionPrompt } from '../src/services/gemini';

describe('Gemini prompts', () => {
  it('keeps the pill verification prompt constrained to JSON booleans', () => {
    expect(visionPrompt).toContain('Return a JSON object');
    expect(visionPrompt).toContain('pill_detected');
    expect(visionPrompt).toContain('intake_verified');
  });

  it('keeps the voice verification prompt constrained to JSON booleans', () => {
    expect(audioPrompt).toContain('Return a JSON object');
    expect(audioPrompt).toContain('confirmed_intake');
  });
});
