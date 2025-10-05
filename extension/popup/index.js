'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const data_1 = require('./data');
const mode_handler_1 = require('./mode-handler');
require('./version');
require('./settings');
const utils_1 = require('./utils');
const gpt_version_1 = require('./gpt-version');
const saveBtn = document.querySelector('.save');
if (!saveBtn) throw new Error('Save button not found');
const inputsText = ['apiKey', 'code', 'model', 'baseURL', 'maxTokens'];
// Save configuration
saveBtn.addEventListener('click', () => {
  const values = inputsText.map(selector => {
    const input = document.querySelector('#' + selector);
    if (!input) throw new Error(`Input #${selector} not found`);
    return input.value.trim();
  });
  const [apiKey, code, model, baseURL, maxTokens] = values;
  const checkboxValues = data_1.inputsCheckbox.map(selector => {
    var _a;
    const element = document.querySelector('#' + selector);
    if (!element) throw new Error(`Checkbox #${selector} not found`);
    return (
      element.checked &&
      ((_a = element.parentElement) === null || _a === void 0 ? void 0 : _a.style.display) !==
        'none'
    );
  });
  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    checkboxValues;
  if (!apiKey || !model) {
    (0, utils_1.showMessage)({ msg: 'Please complete all the form', isError: true });
    return;
  }
  if (code.length > 0 && code.length < 2) {
    (0, utils_1.showMessage)({
      msg: 'The code should at least contain 2 characters',
      isError: true
    });
    return;
  }
  chrome.storage.sync.set({
    moodleGPT: {
      apiKey,
      code,
      model,
      baseURL,
      maxTokens: maxTokens ? parseInt(maxTokens) : undefined,
      logs,
      title,
      cursor,
      typing,
      mouseover,
      infinite,
      timeout,
      history,
      includeImages,
      mode: data_1.globalData.actualMode
    }
  });
  (0, utils_1.showMessage)({ msg: 'Configuration saved' });
});
// Load configuration and initialize UI
chrome.storage.sync.get(['moodleGPT']).then(storage => {
  const config = storage.moodleGPT;
  if (!config) return;
  // Load mode
  if (config.mode) {
    data_1.globalData.actualMode = config.mode;
    data_1.modes.forEach(mode => {
      if (mode.value === config.mode) mode.classList.remove('not-selected');
      else mode.classList.add('not-selected');
    });
  }
  // Load text inputs
  inputsText.forEach(key => {
    const input = document.querySelector('#' + key);
    if (input && config[key]) input.value = config[key];
  });
  // Load checkboxes
  data_1.inputsCheckbox.forEach(key => {
    const input = document.querySelector('#' + key);
    if (input) input.checked = config[key] || false;
  });
  (0, mode_handler_1.handleModeChange)();
  (0, gpt_version_1.checkCanIncludeImages)();
  // Automatically check model on load
  (0, gpt_version_1.checkModel)();
});
//# sourceMappingURL=index.js.map
