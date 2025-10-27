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

const inputsText = ['apiKey', 'model', 'code', 'baseURL', 'maxTokens'];
const includeImagesCheckbox = document.querySelector<HTMLInputElement>('#includeImages');
if (!includeImagesCheckbox) throw new Error('Checkbox #includeImages not found');

// Save configuration
saveBtn.addEventListener('click', async () => {
  const values = inputsText.map(selector => {
    const input = document.querySelector<HTMLInputElement>('#' + selector);
    if (!input) throw new Error(`Input #${selector} not found`);
    return input.value.trim();
  });

  const [apiKey, model, code, baseURL, maxTokens] = values;

  const includeImagesCheckbox = document.querySelector<HTMLInputElement>('#includeImages');
  if (!includeImagesCheckbox) throw new Error('Include Images checkbox not found');

  if (!apiKey || !model) {
    showMessage({ msg: 'Please complete all the form', isError: true });
    return;
  }

  // ✅ Check model support before saving
let supportsImage = false;

try {
  const res = await fetch('https://openrouter.ai/api/v1/models', {
    headers: { Authorization: `Bearer ${apiKey}` }
  });

    if (res.ok) {
      const data = await res.json();
      function normalizeModelId(id: string | undefined) {
        if (!id) return '';
        return id.toLowerCase().replace(/:free$/, '');
      }

      const modelInfo = data.data?.find((m: any) =>
        normalizeModelId(m.id).includes(normalizeModelId(model)) ||
        normalizeModelId(m.hugging_face_id).includes(normalizeModelId(model))
      );

      // Check the right place for input_modalities
      supportsImage = modelInfo?.architecture?.input_modalities?.includes('image') ?? false;
      console.log('Model info:', modelInfo);
      console.log('Supports image:', supportsImage);

    }
  } catch (err) {
    console.warn('Failed to check model capabilities:', err);
  }

  // ✅ Update checkbox based on support
  if (!supportsImage) {
    includeImagesCheckbox.checked = false;
    includeImagesCheckbox.disabled = true;
    showMessage({
      msg: `Model "${model}" does not support image input.`,
      isError: false
    });
  } else {
    includeImagesCheckbox.disabled = false;
  }

  // ✅ Now collect checkbox values for saving
  const checkboxValues = inputsCheckbox.map(selector => {
    const element = document.querySelector<HTMLInputElement>('#' + selector);
    if (!element) throw new Error(`Checkbox #${selector} not found`);
    return element.checked && element.parentElement?.style.display !== 'none';
  });

  const [logs, title, cursor, typing, mouseover, infinite, timeout, history, includeImages] =
    checkboxValues;

  // ✅ Save everything to storage
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
      model
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
    } else if (!cfg.model) {
      showMessage({ msg: 'Model not set', isError: true });
      return;
    }

    try {
      const testResponse = await getResponse(
        { apiKey: cfg.apiKey, model: cfg.model, maxTokens: 50 },
        'Hello, what is your model?',
      );
      showMessage({ msg: 'Test successful: ' + testResponse.response });
    } catch (err: any) {
      showMessage({ msg: 'Test failed: ' + err.message, isError: true });
    }
  });
});
