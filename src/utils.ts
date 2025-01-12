/**
 * Return the current interface language
 * If the navigator object is defined it returns the current navigator language
 * otherwise it falls back to 'en-US'
 * Works in browsers
 */
export function getInterfaceLanguage(): string {
  const defaultLang = 'en-US';

  if (typeof navigator === 'undefined') {
    return defaultLang;
  }

  const nav: Navigator = navigator;

  if (nav) {
    if (nav.language) {
      return nav.language;
    }
    if (nav.languages && nav.languages[0]) {
      return nav.languages[0];
    }
    if ('userLanguage' in nav) {
      return (nav as any).userLanguage;
    }
    if ('browserLanguage' in nav) {
      return (nav as any).browserLanguage;
    }
  }

  return defaultLang;
}

/**
 * Interface for the props object containing language strings
 */
interface LocalizedStringsProps {
  [language: string]: {
    [key: string]: any;
  };
}

/**
 * Get the best match based on the language passed and the available languages
 * @param language - The target language code
 * @param props - Object containing available language translations
 */
export function getBestMatchingLanguage(language: string, props: LocalizedStringsProps): string {
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
 * @param translationKeys - Array of translation keys to validate
 */
export function validateTranslationKeys(translationKeys: string[]): void {
  const reservedNames: string[] = [
    '_interfaceLanguage',
    '_language',
    '_defaultLanguage',
    '_defaultLanguageFirstLevelKeys',
    '_props'
  ];

  translationKeys.forEach((key) => {
    if (reservedNames.indexOf(key) !== -1) {
      throw new Error(`${key} cannot be used as a key. It is a reserved word.`);
    }
  });
}

/**
 * Get a random pseudo string back after specified a length
 * @param len - How many characters to get back
 */
export function randomPseudo(len: number): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}