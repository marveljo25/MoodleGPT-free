'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Convert table to representating string table
 * @param table
 * @returns
 */
function htmlTableToString(table) {
  const tab = [];
  const lines = Array.from(table.querySelectorAll('tr'));
  const maxColumnsLength = [];
  lines.map(line => {
    const cells = Array.from(line.querySelectorAll('td, th'));
    const cellsContent = cells.map((cell, index) => {
      var _a;
      const content = (_a = cell.textContent) === null || _a === void 0 ? void 0 : _a.trim();
      maxColumnsLength[index] = Math.max(
        maxColumnsLength[index] || 0,
        (content === null || content === void 0 ? void 0 : content.length) || 0
      );
      return content !== null && content !== void 0 ? content : '';
    });
    tab.push(cellsContent);
  });
  const jointure = ' | ';
  const headerLineLength = tab[0].length;
  const lineSeparationSize =
    maxColumnsLength.reduce((a, b) => a + b, 0) + (headerLineLength - 1) * jointure.length;
  const lineSeparation = '\n' + Array(lineSeparationSize).fill('-').join('') + '\n';
  const mappedTab = tab.map(line => {
    const mappedLine = line.map((content, index) =>
      content.padEnd(
        maxColumnsLength[index],
        '\u00A0' // For no matching with \s
      )
    );
    return mappedLine.join(jointure);
  });
  const head = mappedTab.shift();
  return head + lineSeparation + mappedTab.join('\n');
}
exports.default = htmlTableToString;
//# sourceMappingURL=html-table-to-string.js.map
