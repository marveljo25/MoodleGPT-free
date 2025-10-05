'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.getLastVersion = getLastVersion;
exports.setVersion = setVersion;
exports.notifyUpdate = notifyUpdate;
const CURRENT_VERSION = '1.1.5';
const versionDisplay = document.querySelector('#version');
/**
 * Get the last version from the github
 * @returns
 */
function getLastVersion() {
  return __awaiter(this, void 0, void 0, function* () {
    const req = yield fetch(
      'https://raw.githubusercontent.com/yoannchb-pro/MoodleGPT/main/package.json'
    );
    const rep = yield req.json();
    return rep.version;
  });
}
/**
 * Display the version or an update message
 * @param {string} version
 * @param {boolean} isCurrent
 * @returns
 */
function setVersion(version, isCurrent = true) {
  if (isCurrent) {
    versionDisplay.textContent = 'v' + version;
    return;
  }
  const link = document.createElement('a');
  link.href = 'https://github.com/yoannchb-pro/MoodleGPT';
  link.rel = 'noopener noreferrer';
  link.target = '_blank';
  link.textContent = 'v' + version;
  versionDisplay.appendChild(link);
  versionDisplay.appendChild(document.createTextNode(' is now available !'));
}
/**
 * Check if the extension neeed an update or not
 */
function notifyUpdate() {
  return __awaiter(this, void 0, void 0, function* () {
    const lastVersion = yield getLastVersion().catch(err => {
      console.error(err);
      return CURRENT_VERSION;
    });
    const lastVertionSplitted = lastVersion.split('.');
    const currentVersionSplitted = CURRENT_VERSION.split('.');
    const minVersionLength = Math.min(lastVertionSplitted.length, currentVersionSplitted.length);
    for (let i = 0; i < minVersionLength; ++i) {
      if (parseInt(lastVertionSplitted[i]) > parseInt(currentVersionSplitted[i])) {
        return setVersion(lastVersion, false);
      } else if (parseInt(currentVersionSplitted[i]) > parseInt(lastVertionSplitted[i])) {
        return setVersion(CURRENT_VERSION);
      }
    }
    setVersion(CURRENT_VERSION);
  });
}
notifyUpdate();
//# sourceMappingURL=version.js.map
