import { afterEach, describe, expect, it, vi } from 'vitest';
import * as utils from '../src/utils.ts';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('getInterfaceLanguage', () => {
  it('returns default language if not set', () => {
    vi.stubGlobal('navigator', {});
    expect(utils.getInterfaceLanguage()).toBe('en-US');
  });

  it('returns language when found', () => {
    vi.stubGlobal('navigator', { language: 'fi' });
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns first in languages if set', () => {
    vi.stubGlobal('navigator', { languages: ['it', 'fr'] });
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns userLanguage if set', () => {
    vi.stubGlobal('navigator', { userLanguage: 'fi' }); // `userLanguage` is non-standard
    expect(utils.getInterfaceLanguage()).toBe('fi');
  });

  it('returns browserLanguage if set', () => {
    vi.stubGlobal('navigator', { browserLanguage: 'it' }); // `browserLanguage` is non-standard
    expect(utils.getInterfaceLanguage()).toBe('it');
  });

  it('returns language when all properties are available', () => {
    vi.stubGlobal('navigator', {
      language: 'hu',
      languages: ['fr'],
      userLanguage: 'de',
      browserLanguage: 'it',
    }); // Combine standard and non-standard properties
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
