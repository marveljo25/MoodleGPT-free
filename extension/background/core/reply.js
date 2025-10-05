'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const logs_1 = __importDefault(require('background/utils/logs'));
const get_response_1 = __importDefault(require('./get-response'));
const create_question_1 = __importDefault(require('./create-question'));
const clipboard_1 = __importDefault(require('./modes/clipboard'));
const question_to_answer_1 = __importDefault(require('./modes/question-to-answer'));
const autocomplete_1 = __importDefault(require('./modes/autocomplete'));
/**
 * Reply to the question
 * @param props
 * @returns
 */
function reply(props) {
  return __awaiter(this, void 0, void 0, function* () {
    if (props.config.cursor) props.questionElement.style.cursor = 'wait';
    const question = (0, create_question_1.default)(props.form);
    const inputList = props.form.querySelectorAll(props.inputQuery);
    const gptAnswer = yield (0, get_response_1.default)(
      props.config,
      props.questionElement,
      question
    ).catch(error => ({
      error
    }));
    const haveError = typeof gptAnswer === 'object' && 'error' in gptAnswer;
    if (props.config.cursor) {
      props.questionElement.style.cursor =
        props.config.infinite || haveError ? 'pointer' : 'initial';
    }
    if (haveError) {
      console.error(gptAnswer.error);
      return;
    }
    if (props.config.logs) {
      logs_1.default.question(question);
      logs_1.default.response(gptAnswer);
    }
    switch (props.config.mode) {
      case 'clipboard':
        (0, clipboard_1.default)({
          config: props.config,
          questionElement: props.questionElement,
          gptAnswer,
          removeListener: props.removeListener
        });
        break;
      case 'question-to-answer':
        (0, question_to_answer_1.default)({
          gptAnswer,
          questionElement: props.questionElement,
          removeListener: props.removeListener
        });
        break;
      case 'autocomplete':
        (0, autocomplete_1.default)({
          config: props.config,
          gptAnswer,
          inputList,
          questionElement: props.questionElement,
          removeListener: props.removeListener
        });
        break;
    }
  });
}
exports.default = reply;
//# sourceMappingURL=reply.js.map
