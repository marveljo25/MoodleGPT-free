'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const clipboard_1 = __importDefault(require('background/core/questions/clipboard'));
/**
 * Clipboard mode:
 * Simply copy the answer into the clipboard
 * @param props
 */
function clipboardMode(props) {
  if (!props.config.infinite) props.removeListener();
  (0, clipboard_1.default)(props.config, props.gptAnswer);
}
exports.default = clipboardMode;
//# sourceMappingURL=clipboard.js.map
