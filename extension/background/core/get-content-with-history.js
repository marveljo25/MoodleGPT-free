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
const image_to_base64_1 = __importDefault(require('background/utils/image-to-base64'));
const INSTRUCTION = `
Act as a quiz solver for the best notation with the following rules:
- If no answer(s) are given, answer the statement as usual without following the other rules, providing the most detailed, complete and precise explanation. 
- But for the calculation provide this format 'result: <result of the equation>'
- For 'put in order' questions, maintain the answer in the order as presented in the question but assocy the correct order to it by usin this format '<order>:<answer 1>\n<order>:<answer 2>', ignore other rules.
- Always reply in the format: '<answer 1>\n<answer 2>\n...'.
- Retain only the correct answer(s).
- Maintain the same order for the answers as in the text.
- Retain all text from the answer with its description, content or definition.
- Only provide answers that exactly match the given answer in the text.
- The question always has the correct answer(s), so you should always provide an answer.
- Always respond in the same language as the user's question.
`.trim();
const SYSTEM_INSTRUCTION_MESSAGE = {
  role: 'system',
  content: INSTRUCTION
};
/**
 * Get the content to send to ChatGPT API (it allows to includes images if supported)
 * @param config
 */
function getContent(config, questionElement, question) {
  return __awaiter(this, void 0, void 0, function* () {
    const imagesElements = questionElement.querySelectorAll('img');
    if (!config.includeImages || imagesElements.length === 0) {
      return question;
    }
    const contentWithImages = [];
    const base64Images = Array.from(imagesElements).map(imgEl =>
      (0, image_to_base64_1.default)(imgEl)
    );
    const base64ImagesResolved = yield Promise.allSettled(base64Images);
    for (const result of base64ImagesResolved) {
      if (result.status === 'fulfilled') {
        contentWithImages.push({
          type: 'image_url',
          image_url: { url: result.value }
        });
      } else if (config.logs) {
        console.error(result.reason);
      }
    }
    contentWithImages.push({
      type: 'text',
      text: question
    });
    return contentWithImages;
  });
}
/**
 * Create a new history object from the current page
 * @returns
 */
function createNewHistory() {
  var _a, _b;
  const urlParams = new URLSearchParams(document.location.search);
  return {
    host: document.location.host,
    cmid: (_a = urlParams.get('cmid')) !== null && _a !== void 0 ? _a : '',
    attempt: (_b = urlParams.get('attempt')) !== null && _b !== void 0 ? _b : '',
    history: []
  };
}
/**
 * Load the past history from the session storage otherwise return the default history object
 * @returns
 */
function loadPastHistory() {
  var _a;
  return JSON.parse((_a = sessionStorage.moodleGPTHistory) !== null && _a !== void 0 ? _a : 'null');
}
/**
 * Check if two history are from the same origin
 * @param a
 * @param b
 * @returns
 */
function areHistoryFromSameQuiz(a, b) {
  return a.host === b.host && a.cmid === b.cmid && a.attempt === b.attempt;
}
/**
 * Return the content to send to chatgpt api with history if needed
 * @param config
 * @param questionElement
 * @param question
 * @returns
 */
function getContentWithHistory(config, questionElement, question) {
  return __awaiter(this, void 0, void 0, function* () {
    const content = yield getContent(config, questionElement, question);
    const message = { role: 'user', content };
    if (!config.history) return { messages: [SYSTEM_INSTRUCTION_MESSAGE, message] };
    let history;
    const pastHistory = loadPastHistory();
    const newHistory = createNewHistory();
    if (pastHistory === null || !areHistoryFromSameQuiz(pastHistory, newHistory)) {
      history = newHistory;
    } else {
      history = pastHistory;
    }
    return {
      messages: [SYSTEM_INSTRUCTION_MESSAGE, ...history.history, message],
      saveResponse(response) {
        if (config.history) {
          history.history.push(message);
          history.history.push({ role: 'assistant', content: response });
          sessionStorage.moodleGPTHistory = JSON.stringify(history);
        }
      }
    };
  });
}
exports.default = getContentWithHistory;
//# sourceMappingURL=get-content-with-history.js.map
