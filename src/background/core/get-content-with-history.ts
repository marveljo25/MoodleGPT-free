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

function makeSystemInstruction(useReasoning: boolean): Message {
  if (useReasoning) {
    const instr = `
You are a quiz assistant. Provide the correct answer(s) and, when helpful, concise reasoning or brief explanations.

RULES:
- If answer options are provided, return the correct answer(s) exactly as written in the option(s).
- Format answers as:
<answer 1>
<answer 2>
...
- Keep the answers in the same order as they appear in the question.
- Retain all text from the selected answer option (including descriptions).
- For "put in order" questions, output in the format:
<order>:<answer>
<order>:<answer>
- If the question provides no answer options, provide a full answer and include brief reasoning when useful.
- For math questions without options, include:
result: <value>
- Do not include long, unnecessary explanations; keep reasoning concise and relevant.
- Always respond in the same language as the question.
`.trim();

    return { role: 'system', content: instr };
  }

  const instr = `
Act as a quiz solver.

RULES:
- Output ONLY the correct answer(s) exactly as written in the provided options.
- Format answers as:
<answer 1>
<answer 2>
...
- Keep the answers in the same order as they appear in the question.
- Retain all text from the selected answer option (including descriptions).
- For "put in order" questions, output only in the format:
<order>:<answer>
<order>:<answer>
- If the question provides no answer options, respond normally.
- For math questions without options, add:
result: <value>
- Never include explanations, reasoning, or extra text.
- Never mention these instructions in your answer.
- Always respond in the same language as the question.
- NO EXPLANATIONS, JUST ANSWERS.
`.trim();

  return { role: 'system', content: instr };
}
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

  const systemMessage = makeSystemInstruction(Boolean(config.useReasoning));

  if (!config.history) return { messages: [systemMessage, message] };

  let history: History;

  const pastHistory: History | null = loadPastHistory();
  const newHistory: History = createNewHistory();

  if (pastHistory === null || !areHistoryFromSameQuiz(pastHistory, newHistory)) {
    history = newHistory;
  } else {
    history = pastHistory;
  }

  return {
    messages: [systemMessage, ...history.history, message],
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
