'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const normalize_text_1 = __importDefault(require('background/utils/normalize-text'));
const html_table_to_string_1 = __importDefault(require('background/utils/html-table-to-string'));
/**
 * Normalize the question as text and add sub informations
 * @param langage
 * @param question
 * @returns
 */
function createAndNormalizeQuestion(questionContainer) {
  let question = questionContainer.innerText;
  // We remove unnecessary information
  const accesshideElements = questionContainer.querySelectorAll('.accesshide');
  for (const useless of accesshideElements) {
    question = question.replace(useless.innerText, '');
  }
  const attoText = questionContainer.querySelector('.qtype_essay_editor');
  if (attoText) {
    question = question.replace(attoText.innerText, '');
  }
  const clearMyChoice = questionContainer.querySelector('[role="button"]');
  if (clearMyChoice) question = question.replace(clearMyChoice.innerText, '');
  // Make tables more readable for chat-gpt
  const tables = questionContainer.querySelectorAll('.qtext table');
  for (const table of tables) {
    question = question.replace(
      table.innerText,
      '\n' + (0, html_table_to_string_1.default)(table) + '\n'
    );
  }
  return (0, normalize_text_1.default)(question, false);
}
exports.default = createAndNormalizeQuestion;
//# sourceMappingURL=create-question.js.map
