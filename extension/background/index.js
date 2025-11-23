import { codeListener, setUpMoodleGpt } from './core/code-listener';
chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
    const config = storage.moodleGPT;
    if (!config) {
        console.warn('MoodleGPT not configured. Background initialization skipped.');
        return;
    }
    if (config.code) {
        codeListener(config);
    }
    else {
        setUpMoodleGpt(config);
    }
});

// No context menu: hidden mode feature removed
//# sourceMappingURL=index.js.map