import handleClipboard from 'background/core/questions/clipboard';
import handleContentEditable from 'background/core/questions/contenteditable';
import handleNumber from 'background/core/questions/number';
import handleRadio from 'background/core/questions/radio';
import handleCheckbox from 'background/core/questions/checkbox';
import handleSelect from 'background/core/questions/select';
import handleTextbox from 'background/core/questions/textbox';
import handleAtto from 'background/core/questions/atto';
/**
 * Autocomplete mode:
 * Autocomplete the question by checking the good answer
 * @param props
 * @returns
 */
function autoCompleteMode(props) {
    if (!props.config.infinite)
        props.removeListener();
    const handlers = [
        handleAtto,
        handleContentEditable,
        handleTextbox,
        handleNumber,
        handleSelect,
        handleRadio,
        handleCheckbox
    ];
    for (const handler of handlers) {
        if (handler(props.config, props.inputList, props.gptAnswer))
            return;
    }
    // In the case we can't auto complete the question
    handleClipboard(props.config, props.gptAnswer);
}
export default autoCompleteMode;
//# sourceMappingURL=autocomplete.js.map