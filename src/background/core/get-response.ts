import type Config from '../types/config';
import type GPTAnswer from '../types/gpt-answer';
import normalizeText from 'background/utils/normalize-text';
import getContentWithHistory from './get-content-with-history';

async function getChatGPTResponse(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<GPTAnswer> {
  const controller = new AbortController();
  const timeoutControler = setTimeout(() => controller.abort(), 20 * 1000);

  const contentHandler = await getContentWithHistory(config, questionElement, question);

  // Hugging Face API URL (switch model here if needed)
  const HF_API_URL =
    'https://api-inference.huggingface.co/models/MiaoshouAI/Florence-2-large-PromptGen-v2.0';

  let response: Response;

  // Case 1: text-only messages
  if (typeof contentHandler.messages[contentHandler.messages.length - 1].content === 'string') {
    const prompt = contentHandler.messages
      .map(m =>
        typeof m.content === 'string'
          ? `${m.role}: ${m.content}`
          : JSON.stringify(m.content)
      )
      .join('\n');

    response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { max_new_tokens: config.maxTokens || 200 }
      }),
      signal: config.timeout ? controller.signal : null
    });
  }
  // Case 2: multimodal (images + text)
  else {
    const formData = new FormData();

    for (const item of contentHandler.messages[contentHandler.messages.length - 1].content as any[]) {
      if (item.type === 'image_url') {
        // image_url.url is already base64 (from getContent)
        const base64 = item.image_url.url.split(',')[1];
        const blob = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        formData.append('image', new Blob([blob]));
      } else if (item.type === 'text') {
        formData.append('text', item.text);
      }
    }

    response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.apiKey}` },
      body: formData,
      signal: config.timeout ? controller.signal : null
    });
  }

  clearTimeout(timeoutControler);

  if (!response.ok) {
    throw new Error(`HF API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text =
    Array.isArray(result) && result[0]?.generated_text
      ? result[0].generated_text
      : JSON.stringify(result);

  // Save history if enabled
  if (typeof contentHandler.saveResponse === 'function') {
    contentHandler.saveResponse(text);
  }

  return {
    question,
    response: text,
    normalizedResponse: normalizeText(text)
  };
}

export default getChatGPTResponse;
