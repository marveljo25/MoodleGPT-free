import type Config from '../types/config';
import imageToBase64 from 'background/utils/image-to-base64';
// The attempt and the cmid allow us to identify a quiz
type Message = {
  role: 'system' | 'user' | 'assistant';
  content: any; // string or multimodal object
};

type History = {
  host: string;
  cmid: string;
  attempt: string;
  history: Message[];
};

const INSTRUCTION: string = `
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

const SYSTEM_INSTRUCTION_MESSAGE: Message = {
  role: 'system',
  content: INSTRUCTION
};
/**
 * Get the content to send to ChatGPT API (it allows to includes images if supported)
 * @param config
 */
async function getContent(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<any> {
  const imagesElements = questionElement.querySelectorAll('img');

  if (!config.includeImages || imagesElements.length === 0) {
    return question;
  }

  const contentWithImages: any[] = [];

  const base64Images = Array.from(imagesElements).map(imgEl => imageToBase64(imgEl));
  const base64ImagesResolved = await Promise.allSettled(base64Images);

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
}

/**
 * Create a new history object from the current page
 * @returns
 */
function createNewHistory(): History {
  const urlParams = new URLSearchParams(document.location.search);

  return {
    host: document.location.host,
    cmid: urlParams.get('cmid') ?? '',
    attempt: urlParams.get('attempt') ?? '',
    history: []
  };
}

/**
 * Load the past history from the session storage otherwise return the default history object
 * @returns
 */
function loadPastHistory(): History | null {
  return JSON.parse(sessionStorage.moodleGPTHistory ?? 'null');
}

/**
 * Check if two history are from the same origin
 * @param a
 * @param b
 * @returns
 */
function areHistoryFromSameQuiz(a: History, b: History): boolean {
  return a.host === b.host && a.cmid === b.cmid && a.attempt === b.attempt;
}

/**
 * Return the content to send to chatgpt api with history if needed
 * @param config
 * @param questionElement
 * @param question
 * @returns
 */
async function getContentWithHistory(
  config: Config,
  questionElement: HTMLElement,
  question: string
): Promise<{
  messages: [Message, ...Message[]];
  saveResponse?: (response: string) => void;
}> {
  const content = await getContent(config, questionElement, question);
  const message: Message = { role: 'user', content };

  if (!config.history) return { messages: [SYSTEM_INSTRUCTION_MESSAGE, message] };

  let history: History;

  const pastHistory: History | null = loadPastHistory();
  const newHistory: History = createNewHistory();

  if (pastHistory === null || !areHistoryFromSameQuiz(pastHistory, newHistory)) {
    history = newHistory;
  } else {
    history = pastHistory;
  }

  return {
    messages: [SYSTEM_INSTRUCTION_MESSAGE, ...history.history, message],
    saveResponse(response: string) {
      if (config.history) {
        history.history.push(message);
        history.history.push({ role: 'assistant', content: response });
        sessionStorage.moodleGPTHistory = JSON.stringify(history);
      }
    }
  };
}

export default getContentWithHistory;
