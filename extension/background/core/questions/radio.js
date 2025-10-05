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
 * Handle input radio elements
 * @param config
 * @param inputList
 * @param gptAnswer
 */
function handleRadio(config, inputList, gptAnswer) {
  const firstInput = inputList === null || inputList === void 0 ? void 0 : inputList[0];
  // Handle the case the input is not a radio
  if (!firstInput || firstInput.type !== 'radio') {
    return false;
  }
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
  const bestAnswer = (0, pick_best_response_1.pickBestReponse)(
    gptAnswer.normalizedResponse,
    possibleAnswers
  );
  if (config.logs && bestAnswer.value) {
    logs_1.default.bestAnswer(bestAnswer.value, bestAnswer.similarity);
  }
  const correctInput = bestAnswer.element;
  if (config.mouseover) {
    correctInput.addEventListener('mouseover', () => correctInput.click(), {
      once: true
    });
  } else {
    correctInput.click();
  }
  return true;
}
exports.default = handleRadio;
//# sourceMappingURL=radio.js.map
