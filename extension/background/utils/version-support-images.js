'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
/**
 * Check if the current ChatGPT version is greater or equal to 4
 * @param version
 * @returns
 */
function isGPTModelGreaterOrEqualTo4(version) {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!(versionNumber === null || versionNumber === void 0 ? void 0 : versionNumber[1])) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}
exports.default = isGPTModelGreaterOrEqualTo4;
//# sourceMappingURL=version-support-images.js.map
