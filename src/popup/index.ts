import { globalData, inputsCheckboxExtended } from './data';
import { handleModeChange } from './mode-handler';
import './version';
import './settings';
import { showMessage } from './utils';
import getResponse from '../background/core/get-response';

// If hiddenMode is enabled, show a minimal input-only view and hide the rest of the popup
chrome.storage.sync.get(['hiddenMode']).then(storage => {
  const hidden = !!storage.hiddenMode;
  if (!hidden) return;

  const main = document.querySelector('main');
  const hiddenView = document.getElementById('hidden-view');
  if (main && hiddenView) {
    Array.from(main.children).forEach(child => {
      const el = child as HTMLElement;
      if (el.id !== 'hidden-view') el.style.display = 'none';
      else el.style.display = 'block';
    });
  }

  // wire hidden send button
  const sendBtn = document.getElementById('hidden-send');
  const input = document.getElementById('hidden-input') as HTMLInputElement | null;
  const openSettings = document.getElementById('open-settings');

  if (sendBtn && input) {
    sendBtn.addEventListener('click', () => {
      const q = input.value && input.value.trim();
      if (!q) return;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs[0] && typeof tabs[0].id === 'number') {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'moodlegpt-query', question: q });
        }
      });
    });
  }

  if (openSettings) {
    openSettings.addEventListener('click', (e) => {
      e.preventDefault();
      if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
      else window.open(chrome.runtime.getURL('options.html'));
    });
  }
});

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

  // Require apiKey, model and code (code is now a required top-level field)
  if (!apiKey || !model || !code) {
    showMessage({
      msg: 'Please complete required fields: Api Key, GPT Model and Code',
      isError: true
    });
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

      const modelInfo = data.data?.find(
        (m: any) =>
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

  // ✅ Now collect checkbox values for saving (including new options)
  const checkboxValues = inputsCheckboxExtended.map(selector => {
    const element = document.querySelector<HTMLInputElement>('#' + selector);
    if (!element) throw new Error(`Checkbox #${selector} not found`);
    return element.checked && element.parentElement?.style.display !== 'none';
  });

  const [
    logs,
    title,
    cursor,
    timeout,
    typing,
    mouseover,
    infinite,
    history,
    includeImages,
    useReasoning
  ] = checkboxValues;

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
      useReasoning,
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

  // Load checkboxes (including new options)
  inputsCheckboxExtended.forEach(key => {
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
    } else if (!cfg.code) {
      showMessage({ msg: 'Code not set (required)', isError: true });
      return;
    }

    try {
      const testResponse = await getResponse(
        { apiKey: cfg.apiKey, model: cfg.model, maxTokens: 50, useReasoning: cfg.useReasoning },
        'Hello, what is your model?'
      );
      showMessage({ msg: 'Test successful: ' + testResponse.response });
    } catch (err: any) {
      showMessage({ msg: 'Test failed: ' + err.message, isError: true });
    }
  });
});
