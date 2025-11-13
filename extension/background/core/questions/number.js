/**
 * Handle number input
 * @param config
 * @param inputList
 * @param gptAnswer
 * @returns
 */
function handleNumber(config, inputList, gptAnswer) {
    const input = inputList[0];
    if (inputList.length !== 1 || // for now we don't handle many input number
        input.type !== 'number') {
        return false;
    }
    const number = gptAnswer.normalizedResponse.match(/\d+([,.]\d+)?/gi)?.[0]?.replace(',', '.');
    if (number === undefined)
        return false;
    if (config.typing) {
        let index = 0;
        const eventHanlder = function (event) {
            event.preventDefault();
            if (event.key === 'Backspace' || index >= number.length) {
                input.removeEventListener('keydown', eventHanlder);
                return;
            }
            if (number.slice(index, index + 1) === '.')
                ++index;
            input.value = number.slice(0, ++index);
        };
        input.addEventListener('keydown', eventHanlder);
    }
    else {
        input.value = number;
    }
    return true;
}
export default handleNumber;
//# sourceMappingURL=number.js.map