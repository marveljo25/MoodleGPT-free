import handleClipboard from 'background/core/questions/clipboard';
/**
 * Clipboard mode:
 * Simply copy the answer into the clipboard
 * @param props
 */
function clipboardMode(props) {
    if (!props.config.infinite)
        props.removeListener();
    handleClipboard(props.config, props.gptAnswer);
}
export default clipboardMode;
//# sourceMappingURL=clipboard.js.map