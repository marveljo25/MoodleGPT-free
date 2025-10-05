'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const clipboard_1 = __importDefault(require('background/core/questions/clipboard'));
const contenteditable_1 = __importDefault(require('background/core/questions/contenteditable'));
const number_1 = __importDefault(require('background/core/questions/number'));
const radio_1 = __importDefault(require('background/core/questions/radio'));
const checkbox_1 = __importDefault(require('background/core/questions/checkbox'));
const select_1 = __importDefault(require('background/core/questions/select'));
const textbox_1 = __importDefault(require('background/core/questions/textbox'));
const atto_1 = __importDefault(require('background/core/questions/atto'));
/**
 * Autocomplete mode:
 * Autocomplete the question by checking the good answer
 * @param props
 * @returns
 */
function autoCompleteMode(props) {
  if (!props.config.infinite) props.removeListener();
  const handlers = [
    atto_1.default,
    contenteditable_1.default,
    textbox_1.default,
    number_1.default,
    select_1.default,
    radio_1.default,
    checkbox_1.default
  ];
  for (const handler of handlers) {
    if (handler(props.config, props.inputList, props.gptAnswer)) return;
  }
  // In the case we can't auto complete the question
  (0, clipboard_1.default)(props.config, props.gptAnswer);
}
exports.default = autoCompleteMode;
//# sourceMappingURL=autocomplete.js.map
