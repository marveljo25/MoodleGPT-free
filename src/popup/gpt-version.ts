import { showMessage } from './utils';

const apiKeySelector: HTMLInputElement = document.querySelector('#apiKey')!;
const inputModel: HTMLInputElement = document.querySelector('#model')!;
const baseURLSelector: HTMLInputElement = document.querySelector('#baseURL')!;

/**
 * Check if a Hugging Face model is valid by sending a dummy request
 */
export async function checkModel() {
  const model = inputModel.value?.trim();
  const apiKey = apiKeySelector.value?.trim();
  const baseURL = baseURLSelector.value?.trim() || 'https://api-inference.huggingface.co/models';

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

    // Send a tiny dummy request (zero content)
    const res = await fetch(`${baseURL}/${model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: "ping"
      })
    });

    if (!res.ok) throw new Error(await res.text());

    showMessage({ msg: `The model "${model}" is valid!` });
  } catch (err: any) {
    console.error(err);
    showMessage({ msg: `Error: ${err.message}`, isError: true });
  }
}

const checkModelBtn: HTMLElement = document.querySelector('#check-model')!;
checkModelBtn.addEventListener('click', checkModel);
