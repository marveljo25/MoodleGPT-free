'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Normlize text
 * @param text
 */
function normalizeText(text, toLowerCase = true) {
  if (toLowerCase) text = text.toLowerCase();
  const normalizedText = text
    .replace(/\n+/gi, '\n') //remove duplicate new lines
    .replace(/(\n\s*\n)+/g, '\n') //remove useless white space from textcontent
    .replace(/[ \t]+/gi, ' ') //replace multiples space or tabs by a space
    .trim()
    // We remove the following content because sometimes ChatGPT will reply: "answer d"
    .replace(/^[a-z\d]\.\s/gi, '') //a. text, b. text, c. text, 1. text, 2. text, 3.text
    .replace(/\n[a-z\d]\.\s/gi, '\n'); //same but with new line
  return normalizedText;
}
exports.default = normalizeText;
//# sourceMappingURL=normalize-text.js.map
