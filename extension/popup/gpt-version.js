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
Object.defineProperty(exports, '__esModule', { value: true });
exports.checkModel = checkModel;
exports.checkCanIncludeImages = checkCanIncludeImages;
const utils_1 = require('./utils');
const apiKeySelector = document.querySelector('#apiKey');
const inputModel = document.querySelector('#model');
const baseURLSelector = document.querySelector('#baseURL');
if (!apiKeySelector || !inputModel || !baseURLSelector) {
  throw new Error('Required inputs not found in DOM');
}
/**
 * Check if a Hugging Face model is valid by sending a dummy request
 */
function checkModel() {
  return __awaiter(this, void 0, void 0, function* () {
    const model = inputModel.value.trim();
    const apiKey = apiKeySelector.value.trim();
    const baseURL = baseURLSelector.value.trim() || 'https://api-inference.huggingface.co/models';
    if (!model) {
      (0, utils_1.showMessage)({ msg: 'Please enter a model name', isError: true });
      return;
    }
    if (!apiKey) {
      (0, utils_1.showMessage)({ msg: 'Please enter a Hugging Face API key', isError: true });
      return;
    }
    try {
      (0, utils_1.showMessage)({ msg: 'Checking model...', isInfinite: true, isError: false });
      const res = yield fetch(`${baseURL}/${model}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inputs: 'ping' })
      });
      if (!res.ok) throw new Error(yield res.text());
      (0, utils_1.showMessage)({ msg: `The model "${model}" is valid!` });
    } catch (err) {
      console.error(err);
      (0, utils_1.showMessage)({ msg: `Error: ${err.message}`, isError: true });
    }
  });
}
/**
 * Example function to handle "Include Images" checkbox
 */
function checkCanIncludeImages() {
  const includeImagesCheckbox = document.querySelector('#includeImages');
  if (includeImagesCheckbox) {
    includeImagesCheckbox.disabled = false; // Add your logic here
  }
}
// Attach click listener for button
const checkModelBtn = document.querySelector('#check-model');
if (checkModelBtn) {
  checkModelBtn.addEventListener('click', checkModel);
}
//# sourceMappingURL=gpt-version.js.map
