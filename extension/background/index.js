'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const code_listener_1 = require('./core/code-listener');
chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
  const config = storage.moodleGPT;
  if (!config) throw new Error('Please configure MoodleGPT into the extension');
  if (config.code) {
    (0, code_listener_1.codeListener)(config);
  } else {
    (0, code_listener_1.setUpMoodleGpt)(config);
  }
});
//# sourceMappingURL=index.js.map
