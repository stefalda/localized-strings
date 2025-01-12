import { describe, it, expect, vi } from 'vitest';
import * as utils from '../src/utils.ts';

describe('getInterfaceLanguage', () => {
  it('returns default language if not set', () => {
    global.navigator = {} as Navigator;
    expect(utils.getInterfaceLanguage()).toBe('en-US');
  });

  it('returns language when found', () => {
    global.navigator = { language: 'fi' } as Navigator;
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns first in languages if set', () => {
    global.navigator = { languages: ['it', 'fr'] } as unknown as Navigator;
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns userLanguage if set', () => {
    global.navigator = { userLanguage: 'fi' } as any; // `userLanguage` is non-standard
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns browserLanguage if set', () => {
    global.navigator = { browserLanguage: 'it' } as any; // `browserLanguage` is non-standard
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns language when all properties are available', () => {
    global.navigator = {
      language: 'hu',
      languages: ['fr'],
      userLanguage: 'de',
      browserLanguage: 'it',
    } as any; // Combine standard and non-standard properties
    expect(utils.getInterfaceLanguage()).toBe('hu');
  });
});

describe('validateTranslationKeys', () => {
  it('does not throw an error when using non-reserved name', () => {
    expect(() => utils.validateTranslationKeys(['hello'])).not.toThrow();
  });

  it('throws an error when using reserved name', () => {
    expect(() => utils.validateTranslationKeys(['_interfaceLanguage'])).toThrow();
  });

  it('throws an error when using reserved name with valid names', () => {
    expect(() =>
      utils.validateTranslationKeys(['hello', '_defaultLanguageFirstLevelKeys']),
    ).toThrow();
  });
});
