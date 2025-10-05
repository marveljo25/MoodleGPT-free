import * as fs from "fs";
type Config = {
  apiKey: string;
  maxTokens?: number;
  timeout?: boolean;
};

type GPTAnswer = {
  question: string;
  response: string;
  normalizedResponse: string;
};

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export async function getChatGPTResponse(
  config: Config,
  question: string,
  imageUrl?: string // optional: pass an image URL/base64
): Promise<GPTAnswer> {
  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 20 * 1000);

  const OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  // build content array depending on if an image is included
  const content: any[] = [{ type: "text", text: question }];
  if (imageUrl) {
    content.push({
      type: "image_url",
      image_url: { url: imageUrl }, // can be https://... or data:image/...;base64
    });
  }

  const response = await fetch(OR_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'qwen/qwen2.5-vl-72b-instruct:free',
      messages: [
        {
          role: 'user',
          content,
        },
      ],
      max_tokens: config.maxTokens || 200,
    }),
    signal: config.timeout ? controller.signal : null,
  });

  clearTimeout(timeoutControler);

  if (!response.ok) {
    throw new Error(`OpenRouter API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text =
    result.choices?.[0]?.message?.content ??
    JSON.stringify(result);

  return {
    question,
    response: text,
    normalizedResponse: normalizeText(text),
  };
}

const imageBase64 = fs.readFileSync("images.jpeg", { encoding: "base64" });
const imageDataUrl = `data:image/png;base64,${imageBase64}`;

// Example usage:
const config = { apiKey: "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" };
getChatGPTResponse(
  config,
  "What do you see in this picture?",
  imageDataUrl
).then(ans => console.log(ans));