// Options page: export/import config and hidden mode (improved UX)
const exportBtn = document.getElementById('export');
const copyExportBtn = document.getElementById('copyExport');
const importFile = document.getElementById('importFile');
const importBtn = document.getElementById('import');
const currentTA = document.getElementById('current');
const openPopup = document.getElementById('openPopup');
const refreshBtn = document.getElementById('refresh');
const clearBtn = document.getElementById('clearConfig');
const messageEl = document.getElementById('message');
const editBtn = document.getElementById('editConfig');
const saveConfigBtn = document.getElementById('saveConfig');
const cancelEditBtn = document.getElementById('cancelEdit');
const confirmDanger = document.getElementById('confirmDanger');
const dangerLabel = document.getElementById('dangerLabel');
const warningBox = document.getElementById('warningBox');

let lastExport = '';

function showMessage(msg, type = 'success', timeout = 4000) {
  if (!messageEl)
    return;
  messageEl.textContent = msg;
  messageEl.className = '';
  messageEl.classList.add(type === 'error' ? 'error' : 'success');
  messageEl.style.display = 'block';
  if (timeout > 0) setTimeout(() => (messageEl.style.display = 'none'), timeout);
}

function refreshCurrent() {
  chrome.storage.sync.get(null).then(all => {
    currentTA.value = JSON.stringify(all, null, 2);
  });
}

exportBtn.addEventListener('click', async () => {
  try {
    const all = await chrome.storage.sync.get(null);
    const data = JSON.stringify(all.moodleGPT || {}, null, 2);
    lastExport = data;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'moodlegpt-config.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('Configuration exported');
  }
  catch (e) {
    showMessage('Export failed: ' + e.message, 'error');
  }
});

copyExportBtn.addEventListener('click', async () => {
  if (!lastExport) {
    // produce export data if not present
    const all = await chrome.storage.sync.get(null);
    lastExport = JSON.stringify(all.moodleGPT || {}, null, 2);
  }
  try {
    await navigator.clipboard.writeText(lastExport);
    showMessage('Export copied to clipboard');
  }
  catch (e) {
    showMessage('Copy failed: ' + e.message, 'error');
  }
});

// Enable import when a file is selected
importFile.addEventListener('change', () => {
  importBtn.disabled = !(importFile.files && importFile.files.length > 0);
});

importBtn.addEventListener('click', async () => {
  if (!importFile.files || importFile.files.length === 0) {
    showMessage('Choose a JSON file first', 'error');
    return;
  }
  const file = importFile.files[0];
  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object') throw new Error('Invalid JSON');
    // If the imported JSON is a full storage dump (contains moodleGPT), extract it
    if (parsed && parsed.moodleGPT && typeof parsed.moodleGPT === 'object') {
      await chrome.storage.sync.set({ moodleGPT: parsed.moodleGPT });
    }
    else {
      await chrome.storage.sync.set({ moodleGPT: parsed });
    }
    showMessage('Configuration imported');
    refreshCurrent();
  }
  catch (e) {
    showMessage('Failed to import: ' + e.message, 'error');
  }
});

openPopup && openPopup.addEventListener('click', (e) => {
  e.preventDefault();
  const url = chrome.runtime.getURL('popup/index.html');
  window.open(url, '_blank');
});

refreshBtn && refreshBtn.addEventListener('click', () => {
  refreshCurrent();
  showMessage('Refreshed');
});

clearBtn && clearBtn.addEventListener('click', async () => {
  if (!confirm('Clear saved `moodleGPT` configuration? This cannot be undone.'))
    return;
  try {
    await chrome.storage.sync.remove('moodleGPT');
    showMessage('Configuration cleared');
    refreshCurrent();
  }
  catch (e) {
    showMessage('Failed to clear: ' + e.message, 'error');
  }
});

refreshCurrent();

// Editing support: enable editing of the JSON textarea with warning and confirmation
let originalText = '';
editBtn && editBtn.addEventListener('click', () => {
  originalText = currentTA.value;
  currentTA.readOnly = false;
  currentTA.style.background = '#fffef0';
  editBtn.style.display = 'none';
  saveConfigBtn.style.display = 'inline-block';
  cancelEditBtn.style.display = 'inline-block';
  dangerLabel.style.display = 'inline-block';
  warningBox.style.display = 'block';
  confirmDanger.checked = false;
  saveConfigBtn.disabled = true;
});

cancelEditBtn && cancelEditBtn.addEventListener('click', () => {
  currentTA.value = originalText;
  currentTA.readOnly = true;
  currentTA.style.background = '#fbfdff';
  editBtn.style.display = 'inline-block';
  saveConfigBtn.style.display = 'none';
  cancelEditBtn.style.display = 'none';
  dangerLabel.style.display = 'none';
  warningBox.style.display = 'none';
});

confirmDanger && confirmDanger.addEventListener('change', () => {
  if (saveConfigBtn)
    saveConfigBtn.disabled = !confirmDanger.checked;
});

saveConfigBtn && saveConfigBtn.addEventListener('click', async () => {
  const text = currentTA.value;
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed !== 'object')
      throw new Error('Configuration must be a JSON object');
    // Determine whether the user edited the whole storage or only the `moodleGPT` object
    // parsed can be either: { /* moodleGPT object */ }  OR { moodleGPT: { ... } }
    let newMoodle = null;
    const toSet = {};

    if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('moodleGPT')) {
      // user pasted/edited a full storage dump
      newMoodle = parsed.moodleGPT;
    }
    else {
      // parsed is expected to be the moodleGPT object itself
      newMoodle = parsed;
    }

    // Fix accidental nesting: if newMoodle contains a nested `moodleGPT` key, unwrap it
    while (newMoodle && typeof newMoodle === 'object' && newMoodle.hasOwnProperty('moodleGPT') && typeof newMoodle.moodleGPT === 'object') {
      newMoodle = newMoodle.moodleGPT;
    }

    if (!newMoodle || typeof newMoodle !== 'object')
      throw new Error('No valid `moodleGPT` object found in edited JSON');


    // Merge with existing stored moodleGPT to avoid losing unexpected keys
    const existingStorage = await chrome.storage.sync.get(['moodleGPT']);
    const existing = existingStorage.moodleGPT && typeof existingStorage.moodleGPT === 'object' ? existingStorage.moodleGPT : {};
    const merged = Object.assign({}, existing, newMoodle);
    toSet.moodleGPT = merged;

    await chrome.storage.sync.set(toSet);
    showMessage('Configuration saved');
    // exit edit mode
    cancelEditBtn && cancelEditBtn.click();
    refreshCurrent();
  }
  catch (e) {
    showMessage('Save failed: ' + e.message, 'error');
  }
});
