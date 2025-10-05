'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Handle textbox
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleTextbox(config, inputList, gptAnswer) {
  const input = inputList[0];
  if (
    inputList.length !== 1 || // for now we don't handle many input text
    (input.tagName !== 'TEXTAREA' && input.type !== 'text')
  ) {
    return false;
  }
  if (config.typing) {
    let index = 0;
    const eventHandler = function (event) {
      event.preventDefault();
      if (event.key === 'Backspace' || index >= gptAnswer.response.length) {
        input.removeEventListener('keydown', eventHandler);
        return;
      }
      input.value = gptAnswer.response.slice(0, ++index);
    };
    input.addEventListener('keydown', eventHandler);
  } else {
    input.value = gptAnswer.response;
  }
  return true;
}
exports.default = handleTextbox;
//# sourceMappingURL=textbox.js.map
