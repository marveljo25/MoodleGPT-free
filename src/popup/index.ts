import { globalData, inputsCheckbox } from './data';
import { handleModeChange } from './mode-handler';
import './version';
import './settings';
import { showMessage } from './utils';
import getResponse from '../background/core/get-response';

const saveBtn = document.querySelector<HTMLButtonElement>('.save');
const testBtn = document.querySelector<HTMLElement>('#check-model');
if (!saveBtn) throw new Error('Save button not found');
if (!testBtn) throw new Error('Test button not found');

const inputsText = ['apiKey', 'code', 'baseURL', 'maxTokens'];

// Save configuration
saveBtn.addEventListener('click', () => {
  const values = inputsText.map(selector => {
    const input = document.querySelector<HTMLInputElement>('#' + selector);
    if (!input) throw new Error(`Input #${selector} not found`);
    return input.value.trim();
  });

  const [apiKey, code, baseURL, maxTokens] = values;

  const checkboxValues = inputsCheckbox.map(selector => {
    const element = document.querySelector<HTMLInputElement>('#' + selector);
    if (!element) throw new Error(`Checkbox #${selector} not found`);
    return element.checked && element.parentElement?.style.display !== 'none';
  });
  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    checkboxValues;

  if (!apiKey) {
    showMessage({ msg: 'Please complete all the form', isError: true });
    return;
  }

  if (code.length > 0 && code.length < 2) {
    showMessage({ msg: 'The code should at least contain 2 characters', isError: true });
    return;
  }

  chrome.storage.sync.set({
    moodleGPT: {
      apiKey,
      code,
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
      mode: globalData.actualMode,
      model: 'google/gemini-2.0-flash-exp:free' // fixed
    }
  });

  showMessage({ msg: 'Configuration saved' });
});

// Load configuration and initialize UI
chrome.storage.sync.get(['moodleGPT']).then(storage => {
  const config = storage.moodleGPT;
  if (!config) return;

  // Load mode
  if (config.mode) {
    globalData.actualMode = config.mode;
  }

  // Load text inputs
  inputsText.forEach(key => {
    const input = document.querySelector<HTMLInputElement>('#' + key);
    if (input && config[key]) input.value = config[key];
  });

  // Load checkboxes
  inputsCheckbox.forEach(key => {
    const input = document.querySelector<HTMLInputElement>('#' + key);
    if (input) input.checked = config[key] || false;
  });

  handleModeChange();
});

// Test API key / make a test request
testBtn.addEventListener('click', async () => {
  chrome.storage.sync.get(['moodleGPT']).then(async storage => {
    const cfg = storage.moodleGPT;
    if (!cfg || !cfg.apiKey) {
      showMessage({ msg: 'API key not set', isError: true });
      return;
    }

    try {
      console.log('Testing OpenRouter API ...', cfg.apiKey);
      const testResponse = await getResponse(
        { apiKey: cfg.apiKey, maxTokens: 50 },
        'Hello, test your response!'
      );
      showMessage({ msg: 'Test successful: ' + testResponse.response });
    } catch (err: any) {
      showMessage({ msg: 'Test failed: ' + err.message, isError: true });
    }
  });
});
