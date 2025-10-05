'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Handle number input
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleNumber(config, inputList, gptAnswer) {
  var _a, _b;
  const input = inputList[0];
  if (
    inputList.length !== 1 || // for now we don't handle many input number
    input.type !== 'number'
  ) {
    return false;
  }
  const number =
    (_b =
      (_a = gptAnswer.normalizedResponse.match(/\d+([,.]\d+)?/gi)) === null || _a === void 0
        ? void 0
        : _a[0]) === null || _b === void 0
      ? void 0
      : _b.replace(',', '.');
  if (number === undefined) return false;
  if (config.typing) {
    let index = 0;
    const eventHanlder = function (event) {
      event.preventDefault();
      if (event.key === 'Backspace' || index >= number.length) {
        input.removeEventListener('keydown', eventHanlder);
        return;
      }
      if (number.slice(index, index + 1) === '.') ++index;
      input.value = number.slice(0, ++index);
    };
    input.addEventListener('keydown', eventHanlder);
  } else {
    input.value = number;
  }
  return true;
}
exports.default = handleNumber;
//# sourceMappingURL=number.js.map
