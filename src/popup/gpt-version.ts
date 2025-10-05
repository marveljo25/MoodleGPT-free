import { showMessage } from './utils';

const apiKeySelector = document.querySelector<HTMLInputElement>('#apiKey')!;
const inputModel = document.querySelector<HTMLInputElement>('#model')!;
const baseURLSelector = document.querySelector<HTMLInputElement>('#baseURL')!;

if (!apiKeySelector || !inputModel || !baseURLSelector) {
  throw new Error('Required inputs not found in DOM');
}

/**
 * Check if a Hugging Face model is valid by sending a dummy request
 */

export async function checkModel() {
  const model = inputModel.value.trim();
  const apiKey = apiKeySelector.value.trim();
  const baseURL = baseURLSelector.value.trim() || 'https://api-inference.huggingface.co/models';

  if (!model) {
    showMessage({ msg: 'Please enter a model name', isError: true });
    return;
  }

  if (!apiKey) {
    showMessage({ msg: 'Please enter a Hugging Face API key', isError: true });
    return;
  }

  try {
    showMessage({ msg: 'Checking model...', isInfinite: true, isError: false });

    const res = await fetch(`${baseURL}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ inputs: 'ping' })
    });

    if (!res.ok) throw new Error(await res.text());

    showMessage({ msg: `The model "${model}" is valid!` });
  } catch (err: any) {
    console.error(err);
    showMessage({ msg: `Error: ${err.message}`, isError: true });
  }
}

/**
 * Example function to handle "Include Images" checkbox
 */
export function checkCanIncludeImages() {
  const includeImagesCheckbox = document.querySelector<HTMLInputElement>('#includeImages');
  if (includeImagesCheckbox) {
    includeImagesCheckbox.disabled = false; // Add your logic here
  }
}

// Attach click listener for button
const checkModelBtn = document.querySelector<HTMLButtonElement>('#check-model');
if (checkModelBtn) {
  checkModelBtn.addEventListener('click', checkModel);
}
