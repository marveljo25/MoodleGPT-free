'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Question to answer mode:
 * Simply turn the question into the answer by clicking on it
 * @param props
 */
function questionToAnswerMode(props) {
  var _a;
  const questionElement = props.questionElement;
  props.removeListener();
  const questionBackup = (_a = questionElement.innerHTML) !== null && _a !== void 0 ? _a : '';
  questionElement.innerHTML = props.gptAnswer.response;
  questionElement.style.whiteSpace = 'pre-wrap';
  // To go back to the question / answer
  questionElement.addEventListener('click', function () {
    const contentIsResponse = questionElement.innerHTML === props.gptAnswer.response;
    questionElement.style.whiteSpace = contentIsResponse ? 'initial' : 'pre-wrap';
    questionElement.innerHTML = contentIsResponse ? questionBackup : props.gptAnswer.response;
  });
}
exports.default = questionToAnswerMode;
//# sourceMappingURL=question-to-answer.js.map
