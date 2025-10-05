'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const logs_1 = __importDefault(require('background/utils/logs'));
const normalize_text_1 = __importDefault(require('background/utils/normalize-text'));
const pick_best_response_1 = require('background/utils/pick-best-response');
/**
 * Handle select elements (and put in order select)
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleSelect(config, inputList, gptAnswer) {
  if (inputList.length === 0 || inputList[0].tagName !== 'SELECT') return false;
  const corrects = gptAnswer.normalizedResponse.split('\n');
  if (config.logs) logs_1.default.array(corrects);
  for (let i = 0; i < inputList.length; ++i) {
    if (!corrects[i]) break;
    const options = inputList[i].querySelectorAll('option');
    const possibleAnswers = Array.from(options)
      .slice(1) // We remove the first option which correspond to "Choose..."
      .map(opt => {
        var _a;
        return {
          element: opt,
          value: (0, normalize_text_1.default)(
            (_a = opt.textContent) !== null && _a !== void 0 ? _a : ''
          )
        };
      })
      .filter(obj => obj.value !== '');
    const bestAnswer = (0, pick_best_response_1.pickBestReponse)(corrects[i], possibleAnswers);
    if (config.logs && bestAnswer.value) {
      logs_1.default.bestAnswer(bestAnswer.value, bestAnswer.similarity);
    }
    const correctOption = bestAnswer.element;
    const currentSelect = correctOption.closest('select');
    if (currentSelect === null) continue;
    if (config.mouseover) {
      currentSelect.addEventListener('click', () => (correctOption.selected = true), {
        once: true
      });
    } else {
      correctOption.selected = true;
    }
  }
  return true;
}
exports.default = handleSelect;
//# sourceMappingURL=select.js.map
