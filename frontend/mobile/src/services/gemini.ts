import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const client = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export const visionPrompt = `Analyze this medicine photo. Identify the medicine as carefully as possible from the visible pill, strip, bottle, or packaging.

Return strict JSON with these keys:
{
  "detected": boolean,
  "name": string,
  "dosage": string,
  "potency": string,
  "purpose": string,
  "when_to_take": string,
  "frequency": string,
  "course_days": number,
  "confidence": string,
  "precautions": string[],
  "summary": string,
  "schedule_time": string
}

If the image is unclear, set detected to false and explain uncertainty in summary. Do not wrap the JSON in markdown.`;

export const audioPrompt =
  "Listen to this audio. Did the user confirm they took their medication (e.g., 'I took my medicine', 'Done')? Return a JSON object with a boolean confirmed_intake.";

export type VisionAnalysisResult = {
  detected: boolean;
  name: string;
  dosage: string;
  potency: string;
  purpose: string;
  when_to_take: string;
  frequency: string;
  course_days: number;
  confidence: string;
  precautions: string[];
  summary: string;
  schedule_time: string;
};

export type AudioAnalysisResult = {
  confirmed_intake: boolean;
};

function getGeminiModel() {
  if (!client) {
    return null;
  }

  return client.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
}

function stripCodeFence(jsonLikeText: string) {
  return jsonLikeText.replace(/```json/g, '').replace(/```/g, '').trim();
}

function parseJsonResponse<T>(rawText: string, fallback: T) {
  try {
    return JSON.parse(stripCodeFence(rawText)) as T;
  } catch {
    return fallback;
  }
}

export async function analyzeMedicationImage(input: {
  base64: string;
  mimeType: string;
}): Promise<VisionAnalysisResult> {
  const model = getGeminiModel();

  if (!model) {
    return {
      detected: false,
      name: '',
      dosage: '',
      potency: '',
      purpose: '',
      when_to_take: '',
      frequency: '',
      course_days: 0,
      confidence: 'low',
      precautions: [],
      summary: 'Gemini is unavailable. Add medication details manually.',
      schedule_time: '08:00',
    };
  }

  const response = await model.generateContent([
    visionPrompt,
    {
      inlineData: {
        data: input.base64,
        mimeType: input.mimeType,
      },
    },
  ]);

  return parseJsonResponse<VisionAnalysisResult>(response.response.text(), {
    detected: false,
    name: '',
    dosage: '',
    potency: '',
    purpose: '',
    when_to_take: '',
    frequency: '',
    course_days: 0,
    confidence: 'low',
    precautions: [],
    summary: 'Gemini could not confidently identify the medicine from the photo.',
    schedule_time: '08:00',
  });
}

export async function analyzeMedicationAudio(input: {
  base64: string;
  mimeType: string;
}): Promise<AudioAnalysisResult> {
  const model = getGeminiModel();

  if (!model) {
    return {
      confirmed_intake: false,
    };
  }

  const response = await model.generateContent([
    audioPrompt,
    {
      inlineData: {
        data: input.base64,
        mimeType: input.mimeType,
      },
    },
  ]);

  return parseJsonResponse<AudioAnalysisResult>(response.response.text(), {
    confirmed_intake: false,
  });
}
