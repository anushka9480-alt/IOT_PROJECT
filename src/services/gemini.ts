import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const client = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

export const visionPrompt =
  'Analyze this image. Does it show a pill or a medication strip? Are there missing pills indicating a dose was taken? Return a JSON object with a boolean pill_detected and intake_verified.';

export const audioPrompt =
  "Listen to this audio. Did the user confirm they took their medication (e.g., 'I took my medicine', 'Done')? Return a JSON object with a boolean confirmed_intake.";

export type VisionAnalysisResult = {
  pill_detected: boolean;
  intake_verified: boolean;
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
      pill_detected: false,
      intake_verified: false,
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
    pill_detected: false,
    intake_verified: false,
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
