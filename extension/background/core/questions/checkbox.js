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
 * Handle input checkbox elements
 * @param config
 * @param inputList
 * @param gptAnswer
 */
function handleCheckbox(config, inputList, gptAnswer) {
  const firstInput = inputList === null || inputList === void 0 ? void 0 : inputList[0];
  // Handle the case the input is not a checkbox
  if (!firstInput || firstInput.type !== 'checkbox') {
    return false;
  }
  const corrects = gptAnswer.normalizedResponse.split('\n');
  const possibleAnswers = Array.from(inputList)
    .map(inp => {
      var _a, _b;
      return {
        element: inp,
        value: (0, normalize_text_1.default)(
          (_b =
            (_a = inp === null || inp === void 0 ? void 0 : inp.parentElement) === null ||
            _a === void 0
              ? void 0
              : _a.textContent) !== null && _b !== void 0
            ? _b
            : ''
        )
      };
    })
    .filter(obj => obj.value !== '');
  // Find the best answers elements
  const correctElements = new Set();
  for (const correct of corrects) {
    const bestAnswer = (0, pick_best_response_1.pickBestReponse)(correct, possibleAnswers);
    if (config.logs && bestAnswer.value) {
      logs_1.default.bestAnswer(bestAnswer.value, bestAnswer.similarity);
    }
    correctElements.add(bestAnswer.element);
  }
  // Check if it should be checked or not
  for (const element of possibleAnswers.map(e => e.element)) {
    const needAction =
      (element.checked && !correctElements.has(element)) ||
      (!element.checked && correctElements.has(element));
    const action = () => needAction && element.click();
    if (config.mouseover) {
      element.addEventListener('mouseover', action, {
        once: true
      });
    } else {
      action();
    }
  }
  return true;
}
exports.default = handleCheckbox;
//# sourceMappingURL=checkbox.js.map
