'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Show some informations into the document title and remove it after 3000ms
 * @param text
 */
function titleIndications(text) {
  const backTitle = document.title;
  document.title = text;
  setTimeout(() => (document.title = backTitle), 3000);
}
exports.default = titleIndications;
//# sourceMappingURL=title-indications.js.map
