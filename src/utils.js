/**
 * Return the current interface language
 * If the navigator object is defined it returns the current navigator language
 * otherwise it falls back to 'en-US'
 * Works in browsers
 */
export function getInterfaceLanguage() {
  const defaultLang = 'en-US';
  if (typeof navigator === 'undefined') {
    return defaultLang;
  }
  const nav = navigator; // eslint-disable-line no-undef
  if (nav) {
    if (nav.language) {
      return nav.language;
    }
    if (!!nav.languages && !!nav.languages[0]) {
      return nav.languages[0];
    }
    if (nav.userLanguage) {
      return nav.userLanguage;
    }
    if (nav.browserLanguage) {
      return nav.browserLanguage;
    }
  }
  return defaultLang;
}

/**
 * Get the best match based on the language passed and the available languages
 * @param {*} language
 * @param {*} props
 */
export function getBestMatchingLanguage(language, props) {
  // If an object with the passed language key exists return it
  if (props[language]) return language;

  // if the string is composed try to find a match with only the first language identifiers (en-US --> en)
  const idx = language.indexOf('-');
  const auxLang = idx >= 0 ? language.substring(0, idx) : language;
  return props[auxLang] ? auxLang : Object.keys(props)[0];
}

/**
 * Check that the keys used in the provided strings object don't collide with existing property
 * already defined in the LocalizedStrings object
 * @param {*} translationKeys
 */
export function validateTranslationKeys(translationKeys) {
  const reservedNames = [
    '_interfaceLanguage',
    '_language',
    '_defaultLanguage',
    '_defaultLanguageFirstLevelKeys',
    '_props',
  ];
  translationKeys.forEach((key) => {
    if (reservedNames.indexOf(key) !== -1) {
      throw new Error(`${key} cannot be used as a key. It is a reserved word.`);
    }
  });
}

/**
 * Get a random pseudo string back after specified a length
 * @param {Number} len - How many characters to get back
 */
export function randomPseudo(len) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i += 1) text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
