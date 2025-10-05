'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.codeListener = codeListener;
exports.removeListener = removeListener;
exports.setUpMoodleGpt = setUpMoodleGpt;
const title_indications_1 = __importDefault(require('background/utils/title-indications'));
const reply_1 = __importDefault(require('./reply'));
const pressedKeys = [];
const listeners = [];
/**
 * Create a listener on the keyboard to inject the code
 * @param config
 */
function codeListener(config) {
  document.body.addEventListener('keydown', function (event) {
    pressedKeys.push(event.key);
    if (pressedKeys.length > config.code.length) pressedKeys.shift();
    if (pressedKeys.join('') === config.code) {
      pressedKeys.length = 0;
      setUpMoodleGpt(config);
    }
  });
}
/**
 * Remove the event listener on a specific question
 * @param element
 */
function removeListener(element) {
  const index = listeners.findIndex(listener => listener.element === element);
  if (index !== -1) {
    const listener = listeners.splice(index, 1)[0];
    listener.element.removeEventListener('click', listener.fn);
  }
}
/**
 * Setup moodleGPT into the page (remove/injection)
 * @param config
 * @returns
 */
function setUpMoodleGpt(config) {
  // Removing events if there are already declared
  if (listeners.length > 0) {
    for (const listener of listeners) {
      if (config.cursor) listener.element.style.cursor = 'initial';
      listener.element.removeEventListener('click', listener.fn);
    }
    if (config.title) (0, title_indications_1.default)('Removed');
    listeners.length = 0;
    return;
  }
  // Query to find inputs and forms
  const inputTypeQuery = ['checkbox', 'radio', 'text', 'number']
    .map(e => `input[type="${e}"]`)
    .join(',');
  const inputQuery = inputTypeQuery + ', textarea, select, [contenteditable], .qtype_essay_editor';
  const forms = document.querySelectorAll('.formulation');
  // For each form we inject a function on the queqtion
  for (const form of forms) {
    const questionElement = form.querySelector('.qtext');
    if (questionElement === null) continue;
    if (config.cursor) questionElement.style.cursor = 'pointer';
    const injectionFunction = reply_1.default.bind(null, {
      config,
      questionElement,
      form: form,
      inputQuery,
      removeListener: () => removeListener(questionElement)
    });
    listeners.push({ element: questionElement, fn: injectionFunction });
    questionElement.addEventListener('click', injectionFunction);
  }
  if (config.title) (0, title_indications_1.default)('Injected');
}
//# sourceMappingURL=code-listener.js.map
