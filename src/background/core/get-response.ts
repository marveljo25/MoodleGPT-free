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

  // OpenRouter API endpoint for Qwen2.5-VL-72B-Instruct
  const OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

  let response: Response;

  // Case 1: text-only messages
  if (typeof contentHandler.messages[contentHandler.messages.length - 1].content === 'string') {
    const messages = contentHandler.messages.map(m => ({
      role: m.role,
      content: typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
    }));

    response = await fetch(OR_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`, // OpenRouter API key
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen2.5-vl-72b-instruct:free',
        messages,
        max_tokens: config.maxTokens || 200,
      }),
      signal: config.timeout ? controller.signal : null,
    });
  } 
  // Case 2: multimodal (images + text)
  else {
    const lastContent = contentHandler.messages[contentHandler.messages.length - 1]
      .content as any[];

    const messages = [
      {
        role: 'user',
        content: lastContent.map(item =>
          item.type === 'image_url'
            ? { type: 'image_url', image_url: { url: item.image_url.url } }
            : { type: 'text', text: item.text }
        ),
      },
    ];

    response = await fetch(OR_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen/qwen2.5-vl-72b-instruct:free',
        messages,
        max_tokens: config.maxTokens || 200,
      }),
      signal: config.timeout ? controller.signal : null,
    });
  }

  clearTimeout(timeoutControler);

  if (!response.ok) {
    throw new Error(`OpenRouter API error ${response.status}: ${await response.text()}`);
  }

  const result = await response.json();
  const text =
    result.choices?.[0]?.message?.content ??
    JSON.stringify(result);

  // Save history if enabled
  if (typeof contentHandler.saveResponse === 'function') {
    contentHandler.saveResponse(text);
  }

  return {
    question,
    response: text,
    normalizedResponse: normalizeText(text),
  };
}

export default getChatGPTResponse;
