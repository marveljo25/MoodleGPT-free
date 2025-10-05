'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.showMessage = showMessage;
exports.isCurrentVersionSupportingImages = isCurrentVersionSupportingImages;
/**
 * Show message into the popup
 */
function showMessage({ msg, isError, isInfinite }) {
  const message = document.querySelector('#message');
  message.style.color = isError ? 'red' : 'limegreen';
  message.textContent = msg;
  message.style.display = 'block';
  if (!isInfinite) setTimeout(() => (message.style.display = 'none'), 5000);
}
/**
 * Check if the current model support images integrations
 * @param {string} version
 * @returns
 */
function isCurrentVersionSupportingImages(version) {
  const versionNumber = version.match(/gpt-(\d+)/);
  if (!(versionNumber === null || versionNumber === void 0 ? void 0 : versionNumber[1])) {
    return false;
  }
  return Number(versionNumber[1]) >= 4;
}
//# sourceMappingURL=utils.js.map
