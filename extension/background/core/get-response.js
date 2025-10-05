'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const normalize_text_1 = __importDefault(require('background/utils/normalize-text'));
const get_content_with_history_1 = __importDefault(require('./get-content-with-history'));
function getChatGPTResponse(config, questionElement, question) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a;
    const controller = new AbortController();
    const timeoutControler = setTimeout(() => controller.abort(), 20 * 1000);
    const contentHandler = yield (0, get_content_with_history_1.default)(
      config,
      questionElement,
      question
    );
    // Hugging Face API URL (switch model here if needed)
    const HF_API_URL =
      'https://api-inference.huggingface.co/models/MiaoshouAI/Florence-2-large-PromptGen-v2.0';
    let response;
    // Case 1: text-only messages
    if (typeof contentHandler.messages[contentHandler.messages.length - 1].content === 'string') {
      const prompt = contentHandler.messages
        .map(m =>
          typeof m.content === 'string' ? `${m.role}: ${m.content}` : JSON.stringify(m.content)
        )
        .join('\n');
      response = yield fetch(HF_API_URL, {
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
      for (const item of contentHandler.messages[contentHandler.messages.length - 1].content) {
        if (item.type === 'image_url') {
          // image_url.url is already base64 (from getContent)
          const base64 = item.image_url.url.split(',')[1];
          const blob = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
          formData.append('image', new Blob([blob]));
        } else if (item.type === 'text') {
          formData.append('text', item.text);
        }
      }
      response = yield fetch(HF_API_URL, {
        method: 'POST',
        headers: { Authorization: `Bearer ${config.apiKey}` },
        body: formData,
        signal: config.timeout ? controller.signal : null
      });
    }
    clearTimeout(timeoutControler);
    if (!response.ok) {
      throw new Error(`HF API error ${response.status}: ${yield response.text()}`);
    }
    const result = yield response.json();
    const text =
      Array.isArray(result) &&
      ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.generated_text)
        ? result[0].generated_text
        : JSON.stringify(result);
    // Save history if enabled
    if (typeof contentHandler.saveResponse === 'function') {
      contentHandler.saveResponse(text);
    }
    return {
      question,
      response: text,
      normalizedResponse: (0, normalize_text_1.default)(text)
    };
  });
}
exports.default = getChatGPTResponse;
//# sourceMappingURL=get-response.js.map
