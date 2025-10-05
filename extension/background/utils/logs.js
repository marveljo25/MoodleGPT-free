'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const pick_best_response_1 = require('./pick-best-response');
class Logs {
  static question(text) {
    const css = 'color: cyan';
    console.log('%c[QUESTION]: %s', css, text);
  }
  static bestAnswer(answer, similarity) {
    const css = 'color: green';
    console.log(
      '%c[BEST ANSWER]: %s',
      css,
      `"${answer}" with a similarity of ${(0, pick_best_response_1.toPourcentage)(similarity)}`
    );
  }
  static array(arr) {
    console.log('[CORRECTS] ', arr);
  }
  static response(gptAnswer) {
    console.log('Original:\n' + gptAnswer.response);
    console.log('Normalized:\n' + gptAnswer.normalizedResponse);
  }
}
exports.default = Logs;
//# sourceMappingURL=logs.js.map
