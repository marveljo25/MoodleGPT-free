import { codeListener, setUpMoodleGpt } from './core/code-listener';
chrome.storage.sync.get(['moodleGPT']).then(function (storage) {
    const config = storage.moodleGPT;
    if (!config)
        throw new Error('Please configure MoodleGPT into the extension');
    if (config.code) {
        codeListener(config);
    }
    else {
        setUpMoodleGpt(config);
    }
});
//# sourceMappingURL=index.js.map