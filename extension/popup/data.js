'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.modes = exports.mode = exports.inputsCheckbox = exports.globalData = void 0;
exports.globalData = { actualMode: 'autocomplete' };
exports.inputsCheckbox = [
  'logs',
  'title',
  'cursor',
  'typing',
  'mouseover',
  'infinite',
  'timeout',
  'history',
  'includeImages'
];
exports.mode = document.querySelector('#mode');
exports.modes = exports.mode.querySelectorAll('button');
//# sourceMappingURL=data.js.map
