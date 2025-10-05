'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.handleModeChange = handleModeChange;
const data_1 = require('./data');
// input to don't take in consideration
const toExcludes = ['includeImages'];
// inputs id that need to be disabled for a specific mode
const disabledForThisMode = {
  autocomplete: [],
  clipboard: ['typing', 'mouseover'],
  'question-to-answer': ['typing', 'infinite', 'mouseover']
};
/**
 * Handle when a mode change to show specific input or to hide them
 */
function handleModeChange() {
  const needDisable = disabledForThisMode[data_1.globalData.actualMode];
  const dontNeedDisable = data_1.inputsCheckbox.filter(
    input => !needDisable.includes(input) && !toExcludes.includes(input)
  );
  for (const id of needDisable) {
    document.querySelector('#' + id).parentElement.style.display = 'none';
  }
  for (const id of dontNeedDisable) {
    document.querySelector('#' + id).parentElement.style.display = '';
  }
}
// Mode hanlder
for (const button of data_1.modes) {
  button.addEventListener('click', function () {
    const value = button.value;
    data_1.globalData.actualMode = value;
    for (const mode of data_1.modes) {
      if (mode.value !== value) {
        mode.classList.add('not-selected');
      } else {
        mode.classList.remove('not-selected');
      }
    }
    handleModeChange();
  });
}
//# sourceMappingURL=mode-handler.js.map
