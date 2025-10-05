'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const title_indications_1 = __importDefault(require('background/utils/title-indications'));
/**
 * Copy the response in the clipboard if we can automaticaly fill the question
 * @param config
 * @param gptAnswer
 */
function handleClipboard(config, gptAnswer) {
  if (config.title) (0, title_indications_1.default)('Copied to clipboard');
  navigator.clipboard.writeText(gptAnswer.response);
}
exports.default = handleClipboard;
//# sourceMappingURL=clipboard.js.map
