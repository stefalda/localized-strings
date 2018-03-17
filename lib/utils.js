'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInterfaceLanguage = getInterfaceLanguage;
exports.validateTranslationKeys = validateTranslationKeys;
/**
 * Return the current interface language
 * If the navigator object is defined it returns the current navigator language
 * otherwise it falls back to 'en-US'
 */
function getInterfaceLanguage() {
  var defaultLang = 'en-US';
  if (typeof navigator === "undefined") {
    return defaultLang;
  }
  if (!!navigator && !!navigator.language) {
    return navigator.language;
  } else if (!!navigator && !!navigator.languages && !!navigator.languages[0]) {
    return navigator.languages[0];
  } else if (!!navigator && !!navigator.userLanguage) {
    return navigator.userLanguage;
  } else if (!!navigator && !!navigator.browserLanguage) {
    return navigator.browserLanguage;
  }
  return defaultLang;
}

/**
 * Check that the keys used in the provided strings object don't collide with existing property
 * already defined in the LocalizedStrings object
 * @param {*} translationKeys 
 */
function validateTranslationKeys(translationKeys) {
  var reservedNames = ['_interfaceLanguage', '_language', '_defaultLanguage', '_defaultLanguageFirstLevelKeys', '_props'];
  translationKeys.forEach(function (key) {
    if (reservedNames.indexOf(key) !== -1) {
      throw new Error(key + ' cannot be used as a key. It is a reserved word.');
    }
  });
}