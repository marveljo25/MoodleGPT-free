export const globalData = { actualMode: 'autocomplete' };

// Grouped and ordered checkboxes for clearer UI: general options first, then behavior/history
export const inputsCheckbox = [
  'logs',
  'title',
  'cursor',
  'timeout',
  'typing',
  'mouseover',
  'infinite',
  'history',
  'includeImages'
];
export const mode = document.querySelector('#mode')!;
export const modes = mode.querySelectorAll('button')!;
