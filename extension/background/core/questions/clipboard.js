import titleIndications from 'background/utils/title-indications';
/**
 * Copy the response in the clipboard if we can automaticaly fill the question
 * @param config
 * @param gptAnswer
 */
function handleClipboard(config, gptAnswer) {
    if (config.title)
        titleIndications('Copied to clipboard');
    navigator.clipboard.writeText(gptAnswer.response);
}
export default handleClipboard;
//# sourceMappingURL=clipboard.js.map